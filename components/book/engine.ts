// Page-flip engine: curling paper pages, hard covers that swing on the spine,
// drag/fling/tap/keyboard input. Ported from github.com/shubhu121/art-book.

import type { Book, Wallpaper } from "@/content/book";
import { PAPER, PH, clamp, ctx2d, finishPage, makeCanvas, pageCanvas, type Pt } from "./paper";
import { drawWallpaper, type Fonts } from "./scenes";
import {
  drawCover, drawEndingPage, drawEndpaper, drawTitlePage, drawWritingPage, numberWord, typesetChapter,
  type WritingPage,
} from "./pages";

type Spread =
  | { kind: "cover" | "title" | "ending" | "back"; label: string }
  | { kind: "page"; label: string; wallpaper: Wallpaper; seed: number; page: WritingPage };

type Pages = { L: HTMLCanvasElement | null; R: HTMLCanvasElement | null };

type Flip = {
  dir: number;
  hard?: boolean;
  t: number;
  grab?: number;
  C: Pt;
  P: Pt;
  anim?: {
    from: number | Pt;
    to: number | Pt;
    t0: number;
    dur: number;
    lift: number;
    complete: boolean;
    ease: (t: number) => number;
  };
};

export type BookElements = {
  canvas: HTMLCanvasElement;
  prev: HTMLButtonElement;
  next: HTMLButtonElement;
  indicator: HTMLElement;
  nav: HTMLElement;
};

export type BookOptions = {
  book: Book;
  fonts: Fonts;
  onReady?: () => void;
  onIndex?: (index: number, last: number) => void;
  // true while something else (the reader) owns the keyboard
  paused?: () => boolean;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
const nextFrame = () => new Promise((res) => requestAnimationFrame(() => setTimeout(res, 0)));

function buildSpreads(book: Book, fonts: Fonts): Spread[] {
  const spreads: Spread[] = [
    { kind: "cover", label: `Front cover: ${book.title}, ${book.subtitle}` },
    { kind: "title", label: `Title page: ${book.title}` },
  ];
  let number = 1;
  let shown = 0;
  let shared = 0;
  for (const chapter of book.chapters) {
    const own = chapter.wallpapers ?? [];
    typesetChapter(chapter, fonts, number).forEach((page, j) => {
      const wallpaper = j < own.length ? own[j] : book.wallpapers[shared++ % book.wallpapers.length];
      spreads.push({
        kind: "page",
        page,
        wallpaper,
        seed: 1000 + shown * 37,
        label: `Chapter ${numberWord(chapter.number)}, page ${page.number}${wallpaper.quote ? `, beside the quote “${wallpaper.quote}”` : "alt" in wallpaper && wallpaper.alt ? `, beside a picture: ${wallpaper.alt}` : ""}`,
      });
      shown++;
      number++;
    });
  }
  spreads.push({ kind: "ending", label: `${book.ending.title}: ${book.ending.note}` });
  spreads.push({ kind: "back", label: "Back cover" });
  return spreads;
}

export function mountBook(el: BookElements, opts: BookOptions) {
  const { canvas, prev: prevBtn, next: nextBtn, indicator, nav } = el;
  const { book, fonts } = opts;
  const ctx = ctx2d(canvas);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ac = new AbortController();
  const on = (target: EventTarget, type: string, fn: (e: never) => void, o: AddEventListenerOptions = {}) =>
    target.addEventListener(type, fn as EventListener, { ...o, signal: ac.signal });
  let disposed = false;
  let raf = 0;
  let resizeRaf = 0;
  let buildTimer = 0;

  const fontsReady = Promise.race([
    document.fonts
      ? Promise.all([
          document.fonts.load(`400 28px ${fonts.serif}`),
          document.fonts.load(`italic 400 28px ${fonts.serif}`),
          document.fonts.load(`300 46px ${fonts.serif}`),
          document.fonts.load(`italic 300 46px ${fonts.serif}`),
        ])
      : Promise.resolve(),
    sleep(2500),
  ]).catch(() => {});

  // photo wallpapers load over the network; a spread waits for its picture
  const photos = new Map<string, { img: HTMLImageElement | null; done: boolean }>();
  for (const wp of [...book.wallpapers, ...book.chapters.flatMap((ch) => ch.wallpapers ?? [])]) {
    if (!("src" in wp) || photos.has(wp.src)) continue;
    const st = { img: null as HTMLImageElement | null, done: false };
    const im = new Image();
    im.onload = () => { st.img = im; st.done = true; };
    im.onerror = () => { st.done = true; };
    im.src = wp.src;
    photos.set(wp.src, st);
  }

  let SPREADS: Spread[] = [];
  let LAST = 0;
  let pages: (Pages | null)[] = [];
  let builtPw = 0;
  let buildToken = 0;
  let vw = 0, vh = 0, dpr = 1;
  const geo = { x0: 0, y0: 0, W: 1 };
  let index = 0;
  let mode: "idle" | "drag" | "anim" = "idle";
  let flip: Flip | null = null;
  let drag: {
    id: number; dir: number; G: Pt; shift: number; start: Pt; t0: number; samples: [number, number][]; moved: boolean; tapY: number;
  } | null = null;
  const queue: number[] = [];
  let lastPointerTurn = -1e9;

  const spreadReady = (i: number) => {
    const sp = SPREADS[i];
    return sp.kind !== "page" || !("src" in sp.wallpaper) || !!photos.get(sp.wallpaper.src)?.done;
  };

  function renderSpread(i: number, pw: number): Pages {
    const sp = SPREADS[i];
    if (sp.kind !== "page") {
      if (sp.kind === "cover") return { L: null, R: drawCover(pw, "front", book, fonts) };
      if (sp.kind === "back") return { L: drawCover(pw, "back", book, fonts), R: null };
      if (sp.kind === "title") return { L: drawEndpaper(pw, "L"), R: drawTitlePage(pw, book, fonts) };
      return { L: drawEndingPage(pw, book, fonts), R: drawEndpaper(pw, "R") };
    }
    const { c: L, g } = pageCanvas(pw);
    const photo = "src" in sp.wallpaper ? photos.get(sp.wallpaper.src)?.img : null;
    drawWallpaper(g, sp.wallpaper, sp.seed, fonts, photo);
    finishPage(L, "L", false);
    return { L, R: drawWritingPage(pw, sp.page, fonts) };
  }

  // ---------- layout & building ----------
  function layout() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    const compact = vh < 540 && vw > vh;
    // leave the fixed site links in the corners clear
    const side = vw < 480 ? 6 : vw < 768 ? 14 : 36;
    const navH = nav.offsetHeight + 24;
    const top = compact ? 56 : vw < 640 ? 88 : 104;
    const bottom = Math.max(compact ? 8 : 20, navH);
    const availW = vw - side * 2, availH = vh - top - bottom;
    const W = Math.max(60, Math.min(availW / 2, availH / PH, 720));
    geo.W = W;
    geo.x0 = (vw - W * 2) / 2;
    geo.y0 = top + Math.max(0, (availH - W * PH) / 2);
    ensureResolution();
    render();
  }

  function ensureResolution() {
    const need = Math.min(1000, Math.ceil((geo.W * dpr) / 50) * 50);
    if (builtPw && need <= builtPw * 1.12) return;
    clearTimeout(buildTimer);
    buildTimer = window.setTimeout(() => build(need), builtPw ? 250 : 0);
  }

  // nearest spreads first; far ones wait until the book is still so a turn never stutters
  async function build(pw: number) {
    const token = ++buildToken;
    builtPw = pw;
    const done = new Set<number>();
    while (done.size < SPREADS.length) {
      await nextFrame();
      if (disposed || token !== buildToken) return;
      let best = -1;
      for (let i = 0; i < SPREADS.length; i++) {
        if (done.has(i) || !spreadReady(i)) continue;
        if (best < 0 || Math.abs(i - index) < Math.abs(best - index)) best = i;
      }
      if (best < 0) { await sleep(150); continue; }
      if ((mode === "anim" || mode === "drag") && Math.abs(best - index) > 1) { await sleep(120); continue; }
      pages[best] = renderSpread(best, pw);
      done.add(best);
      render();
      if (best === index) opts.onReady?.();
    }
  }

  // ---------- flip geometry ----------
  const canTurn = (dir: number) => (dir > 0 ? index < LAST : index > 0);
  // the covers are hard boards that swing on the spine instead of curling
  const isHard = (dir: number) => (dir > 0 ? index === 0 || index === LAST - 1 : index === 1 || index === LAST);
  // a closed book sits in the middle; it slides over as the cover opens
  const restShift = (i: number) => (i === 0 ? -1 : i === LAST ? 1 : 0) * geo.W / 2;
  const bx = () => {
    const a = restShift(index);
    if (!flip) return geo.x0 + a;
    const t = progress(), e = t * t * (3 - 2 * t);
    return geo.x0 + a + (restShift(index + flip.dir) - a) * e;
  };
  const spineX = () => bx() + geo.W;
  const toLocal = (pt: Pt, dir: number): Pt => [(dir * (pt[0] - spineX())) / geo.W, (pt[1] - geo.y0) / geo.W];

  // keep the spine flat: the lifted corner can't pull further than paper allows
  function constrain(P: Pt, C: Pt): Pt {
    const S1 = [0, C[1]], S2 = [0, PH - C[1]], D = Math.hypot(1, PH);
    let [x, y] = P;
    for (let i = 0; i < 3; i++) {
      let dx = x - S1[0], dy = y - S1[1], d = Math.hypot(dx, dy);
      if (d > 1) { x = S1[0] + dx / d; y = S1[1] + dy / d; }
      dx = x - S2[0]; dy = y - S2[1]; d = Math.hypot(dx, dy);
      if (d > D) { x = S2[0] + (dx / d) * D; y = S2[1] + (dy / d) * D; }
    }
    return [x, y];
  }

  function foldOf(f: Flip) {
    const dx = f.C[0] - f.P[0], dy = f.C[1] - f.P[1], len = Math.hypot(dx, dy);
    if (len < 1e-4) return null;
    return { n: [dx / len, dy / len] as Pt, M: [(f.C[0] + f.P[0]) / 2, (f.C[1] + f.P[1]) / 2] as Pt, len };
  }
  type Fold = NonNullable<ReturnType<typeof foldOf>>;
  function reflectPt(X: Pt, f: Fold): Pt {
    const d = (X[0] - f.M[0]) * f.n[0] + (X[1] - f.M[1]) * f.n[1];
    return [X[0] - 2 * d * f.n[0], X[1] - 2 * d * f.n[1]];
  }

  // paper grabbed at G is now under the finger at Q: fold along their perpendicular bisector
  function foldFromGrab(G: Pt, Q: Pt, C: Pt) {
    const dx = G[0] - Q[0], dy = G[1] - Q[1], L = Math.hypot(dx, dy);
    if (L < 1e-5) return null;
    const n = [dx / L, dy / L], M = [(G[0] + Q[0]) / 2, (G[1] + Q[1]) / 2];
    const d = (C[0] - M[0]) * n[0] + (C[1] - M[1]) * n[1];
    if (d <= 0) return null;
    return { C, P: constrain([C[0] - 2 * d * n[0], C[1] - 2 * d * n[1]], C) };
  }

  function progress() {
    if (!flip) return 0;
    if (flip.hard) return flip.t / Math.PI;
    return clamp((flip.C[0] - flip.P[0]) / 2, 0, 1);
  }

  // ---------- animation ----------
  function startAnim(complete: boolean, o: { dur?: number; ease?: (t: number) => number; lift?: number } = {}) {
    if (!flip) return;
    if (flip.hard) {
      const to = complete ? Math.PI : 0, from = flip.t;
      let dur = o.dur ?? 180 + (640 * Math.abs(to - from)) / Math.PI;
      if (reduceMotion) dur *= 0.6;
      flip.anim = { from, to, t0: performance.now(), dur, lift: 0, complete, ease: o.ease || easeOut };
    } else {
      const C = flip.C;
      const to: Pt = complete ? [-C[0], C[1]] : [C[0], C[1]];
      const from: Pt = [flip.P[0], flip.P[1]];
      const dist = Math.hypot(to[0] - from[0], to[1] - from[1]);
      let dur = o.dur ?? 150 + 470 * Math.min(1, dist / 2);
      if (reduceMotion) dur *= 0.6;
      flip.anim = { from, to, t0: performance.now(), dur, lift: o.lift || 0, complete, ease: o.ease || easeOut };
    }
    mode = "anim";
    kick();
  }

  function tapTurn(dir: number, cornerY: number) {
    if (!canTurn(dir)) {
      if (mode !== "anim") { flip = null; mode = "idle"; render(); }
      return;
    }
    if (isHard(dir)) {
      if (!flip || flip.dir !== dir || !flip.hard) flip = { dir, hard: true, t: 0, C: [1, 0], P: [1, 0] };
      startAnim(true, { ease: easeInOut, dur: queue.length ? 560 : 1000 });
      return;
    }
    const flat = !flip || flip.hard || flip.dir !== dir || Math.hypot(flip.P[0] - flip.C[0], flip.P[1] - flip.C[1]) < 1e-3;
    if (flat) flip = { dir, t: 0, C: [1, cornerY], P: [1, cornerY] };
    const quick = queue.length > 0;
    startAnim(true, { lift: flip!.C[1] > 0 ? -0.3 : 0.3, ease: easeInOut, dur: quick ? (queue.length > 2 ? 340 : 440) : 820 });
  }

  function stepAnim(now: number) {
    if (!flip?.anim) return;
    const a = flip.anim;
    const t = Math.min(1, (now - a.t0) / a.dur);
    const e = a.ease(t);
    if (flip.hard) {
      flip.t = (a.from as number) + ((a.to as number) - (a.from as number)) * e;
    } else {
      const from = a.from as Pt, to = a.to as Pt;
      const x = from[0] + (to[0] - from[0]) * e;
      const y = from[1] + (to[1] - from[1]) * e + a.lift * Math.sin(Math.PI * e);
      flip.P = constrain([x, y], flip.C);
    }
    if (t < 1) return;
    const done = a.complete, dir = flip.dir;
    flip = null;
    mode = "idle";
    if (done) { index += dir; onChange(); }
    while (queue.length && !canTurn(queue[0])) queue.shift();
    if (queue.length) tapTurn(queue.shift()!, PH);
  }

  function finishAnimNow() {
    queue.length = 0;
    if (mode === "anim" && flip?.anim) { flip.anim.t0 = -1e9; stepAnim(performance.now()); }
  }

  function turn(dir: number) {
    if (mode === "drag") return;
    if (mode === "anim") { if (queue.length < 4) queue.push(dir); return; }
    tapTurn(dir, PH);
  }

  function goTo(target: number) {
    if (mode === "drag") return;
    let at = index;
    if (mode === "anim" && flip?.anim?.complete) at += flip.dir;
    queue.length = 0;
    const dir = Math.sign(target - at);
    for (let i = 0; i < Math.abs(target - at); i++) queue.push(dir);
    if (mode !== "anim" && queue.length) tapTurn(queue.shift()!, PH);
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick(now: number) {
    raf = 0;
    if (disposed) return;
    if (mode === "anim") stepAnim(now);
    render();
    if (mode === "anim") raf = requestAnimationFrame(tick);
  }

  // ---------- drawing ----------
  let blank: HTMLCanvasElement | null = null;
  function drawPage(img: HTMLCanvasElement | null, side: "L" | "R") {
    if (!img) return;
    const x = side === "L" ? bx() : bx() + geo.W;
    ctx.drawImage(img, x, geo.y0, geo.W, geo.W * PH);
  }
  const has = (i: number, side: "L" | "R") => (side === "L" ? SPREADS[i].kind !== "cover" : SPREADS[i].kind !== "back");
  function pageOf(i: number, side: "L" | "R") {
    if (!has(i, side)) return null;
    const sp = pages[i];
    if (sp && sp[side]) return sp[side];
    if (!blank) {
      blank = makeCanvas(40, 48);
      const b = ctx2d(blank);
      b.fillStyle = PAPER;
      b.fillRect(0, 0, 40, 48);
    }
    return blank;
  }

  function tracePoly(pts: Pt[]) {
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
  }
  function clipPoly(pts: Pt[]) { ctx.beginPath(); tracePoly(pts); ctx.clip(); }

  function clipHalf(poly: Pt[], M: Pt, n: Pt, sign: number) {
    const out: Pt[] = [];
    const f = (q: Pt) => sign * ((q[0] - M[0]) * n[0] + (q[1] - M[1]) * n[1]);
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if (fa >= 0 !== fb >= 0) {
        const t = fa / (fa - fb);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    return out;
  }

  type M6 = [number, number, number, number, number, number];
  const mul = (m: M6, k: M6): M6 => [
    m[0] * k[0] + m[2] * k[1], m[1] * k[0] + m[3] * k[1],
    m[0] * k[2] + m[2] * k[3], m[1] * k[2] + m[3] * k[3],
    m[0] * k[4] + m[2] * k[5] + m[4], m[1] * k[4] + m[3] * k[5] + m[5],
  ];

  function pagePath(x: number, y: number, w: number, h: number, side: "L" | "R") {
    const rad = w * 0.03, pth = new Path2D();
    const l = side === "L" ? rad : 0, rr = side === "R" ? rad : 0;
    pth.moveTo(x + l, y);
    pth.lineTo(x + w - rr, y);
    if (rr) pth.quadraticCurveTo(x + w, y, x + w, y + rr);
    pth.lineTo(x + w, y + h - rr);
    if (rr) pth.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    pth.lineTo(x + l, y + h);
    if (l) pth.quadraticCurveTo(x, y + h, x, y + h - l);
    pth.lineTo(x, y + l);
    if (l) pth.quadraticCurveTo(x, y, x + l, y);
    pth.closePath();
    return pth;
  }

  function halfShadow(side: "L" | "R", a: number) {
    if (a < 0.02) return;
    const W = geo.W, H = W * PH;
    const x = side === "L" ? bx() : bx() + W;
    const pg = pagePath(x, geo.y0, W, H, side);
    const outside = new Path2D();
    outside.rect(0, 0, vw, vh);
    outside.addPath(pg);
    ctx.save();
    ctx.clip(outside, "evenodd");
    ctx.fillStyle = "#000";
    ctx.shadowColor = `rgba(0,0,0,${0.6 * a})`; ctx.shadowBlur = 44 * dpr; ctx.shadowOffsetY = 18 * dpr;
    ctx.fill(pg);
    ctx.shadowColor = `rgba(0,0,0,${0.5 * a})`; ctx.shadowBlur = 6 * dpr; ctx.shadowOffsetY = 2 * dpr;
    ctx.fill(pg);
    ctx.restore();
  }

  function pageStack(side: "L" | "R", n: number, cover: boolean) {
    const W = geo.W, H = W * PH;
    const x = side === "L" ? bx() : bx() + W;
    for (let k = n; k >= 1; k--) {
      const off = k * Math.max(1, W * 0.0032);
      const sx = side === "L" ? x - off : x + off;
      ctx.fillStyle = cover && k === n ? "#1c1c1c" : k % 2 ? "#dcdad4" : "#eae8e2";
      ctx.fill(pagePath(sx, geo.y0 + off * 0.7, W, H, side));
    }
  }

  function crease() {
    const x = spineX(), H = geo.W * PH;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.22)";
    ctx.fillRect(x - 0.6, geo.y0, 1.2, H);
    ctx.restore();
  }

  function render() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    if (!SPREADS.length) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const W = geo.W, sx = spineX(), y0 = geo.y0;
    const pr = progress();
    const nextI = flip ? index + flip.dir : index;
    const presence = (side: "L" | "R") => {
      const now = has(index, side), next = has(nextI, side);
      if (now && next) return 1;
      // a board swinging away carries its own shadow; a halo left behind would outline a ghost page
      if (now || !next) return 0;
      const t = clamp((pr - 0.86) / 0.14, 0, 1);
      return t * t * (3 - 2 * t);
    };
    halfShadow("L", presence("L"));
    halfShadow("R", presence("R"));
    // page edges only where paper stays put; a cover swinging shut has nothing beneath it
    const keeps = (side: "L" | "R") => has(index, side) && has(nextI, side);
    if (keeps("L")) pageStack("L", clamp(index, 1, 3), index === LAST);
    if (keeps("R")) pageStack("R", clamp(LAST - index, 1, 3), index === 0);

    if (flip?.hard) { renderHard(); return; }
    const f = flip && foldOf(flip);
    if (!flip || !f) {
      drawPage(pageOf(index, "L"), "L");
      drawPage(pageOf(index, "R"), "R");
      if (has(index, "L") && has(index, "R")) crease();
      return;
    }

    const s = flip.dir;
    const turnSide = s > 0 ? "R" : "L", otherSide = s > 0 ? "L" : "R";
    const turning = pageOf(index, turnSide);
    const stat = pageOf(index, otherSide);
    const verso = pageOf(nextI, otherSide);
    const revealed = pageOf(nextI, turnSide);

    const rect: Pt[] = [[0, 0], [1, 0], [1, PH], [0, PH]];
    const flapL = clipHalf(rect, f.M, f.n, 1);
    const fixedL = clipHalf(rect, f.M, f.n, -1);
    const toS = (q: Pt): Pt => [sx + s * q[0] * W, y0 + q[1] * W];
    const sm = (t: number) => t * t * (3 - 2 * t);
    const fade = sm(clamp(f.len / 0.45, 0, 1)) * sm(clamp((2 - f.len) / 0.45, 0, 1));
    const Ms = toS(f.M), ns: Pt = [s * f.n[0], f.n[1]];

    drawPage(stat, otherSide);
    drawPage(revealed, turnSide);

    // the lifted page throws a soft shadow onto the page underneath
    if (revealed && flapL.length > 2) {
      ctx.save();
      clipPoly(flapL.map(toS));
      const Ls = Math.min(0.32, f.len * 0.5 + 0.04) * W;
      const gr = ctx.createLinearGradient(Ms[0], Ms[1], Ms[0] + ns[0] * Ls, Ms[1] + ns[1] * Ls);
      gr.addColorStop(0, `rgba(0,0,0,${0.34 * fade})`);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();
    }

    if (fixedL.length > 2) {
      ctx.save();
      clipPoly(fixedL.map(toS));
      drawPage(turning, turnSide);
      ctx.restore();
    }
    if (stat && (revealed || fixedL.length > 2)) crease();

    if (flapL.length < 3) return;
    const flapS = flapL.map((q) => toS(reflectPt(q, f)));

    // drop shadow around the flap
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, vw, vh); tracePoly(flapS); ctx.clip("evenodd");
    ctx.fillStyle = "#000";
    ctx.shadowColor = `rgba(0,0,0,${0.45 * fade})`; ctx.shadowBlur = 22 * dpr;
    ctx.beginPath(); tracePoly(flapS); ctx.fill();
    ctx.restore();

    // back of the turning page, mirrored across the fold
    if (verso) {
      ctx.save();
      clipPoly(flapS);
      const vx = s > 0 ? bx() : bx() + W;
      const k = W / verso.width;
      const nx = f.n[0], ny = f.n[1], md = 2 * (f.M[0] * nx + f.M[1] * ny);
      const T = mul([s * W, 0, 0, W, sx, y0],
        mul([1 - 2 * nx * nx, -2 * nx * ny, -2 * nx * ny, 1 - 2 * ny * ny, md * nx, md * ny],
          mul([-1, 0, 0, 1, 0, 0],
            mul([1 / (s * W), 0, 0, 1 / W, -sx / (s * W), -y0 / W],
              [k, 0, 0, k, vx, y0]))));
      ctx.transform(T[0], T[1], T[2], T[3], T[4], T[5]);
      ctx.drawImage(verso, 0, 0);
      ctx.restore();

      // curl shading on the flap
      ctx.save();
      clipPoly(flapS);
      const Lf = Math.min(0.5, f.len * 0.5 + 0.05) * W;
      const gr = ctx.createLinearGradient(Ms[0], Ms[1], Ms[0] - ns[0] * Lf, Ms[1] - ns[1] * Lf);
      gr.addColorStop(0, `rgba(0,0,0,${0.2 * fade})`);
      gr.addColorStop(0.1, `rgba(0,0,0,${0.06 * fade})`);
      gr.addColorStop(0.4, `rgba(255,255,255,${0.05 * fade})`);
      gr.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();
    }
  }

  // a rigid board swinging on the spine, drawn in thin strips so it foreshortens with perspective
  let boardBuf: HTMLCanvasElement | null = null;
  function renderHard() {
    if (!flip) return;
    const s = flip.dir, th = flip.t, W = geo.W, H = W * PH, sx = spineX(), cy = geo.y0 + H / 2;
    const nextI = index + s;
    const turnSide = s > 0 ? "R" : "L", otherSide = s > 0 ? "L" : "R";
    const front = pageOf(index, turnSide), back = pageOf(nextI, otherSide);
    const stat = pageOf(index, otherSide), under = pageOf(nextI, turnSide);
    const c = Math.cos(th), sn = Math.sin(th);

    drawPage(stat, otherSide);
    drawPage(under, turnSide);
    const shade = (side: "L" | "R", a: number) => {
      if (a < 0.01) return;
      const d = side === "R" ? 1 : -1;
      const gr = ctx.createLinearGradient(sx, 0, sx + d * W * 0.85, 0);
      gr.addColorStop(0, `rgba(0,0,0,${a})`);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gr;
      ctx.fillRect(d > 0 ? sx : sx - W, geo.y0, W, H);
    };
    if (under) shade(turnSide, 0.3 * sn * (c > 0 ? 1 : 0.45));
    if (stat) shade(otherSide, 0.3 * sn * (c < 0 ? 1 : 0.45));
    if (stat && under) crease();

    const img = c >= 0 ? front : back;
    const side = c >= 0 ? turnSide : otherSide;
    if (!img) return;
    const D = 8;
    const proj = (u: number): [number, number] => { const f = D / (D - sn * u); return [sx + s * c * u * f * W, f]; };
    const [xo, fo] = proj(1);

    // paint the board into its own layer so shading and shadow follow its rounded corners
    const minX = Math.floor(Math.min(sx, xo)) - 2, maxX = Math.ceil(Math.max(sx, xo)) + 2;
    const minY = Math.floor(cy - (H / 2) * Math.max(1, fo)) - 2, maxY = Math.ceil(cy + (H / 2) * Math.max(1, fo)) + 2;
    const bw = Math.max(1, Math.ceil((maxX - minX) * dpr)), bh = Math.max(1, Math.ceil((maxY - minY) * dpr));
    if (!boardBuf) boardBuf = makeCanvas(bw, bh);
    if (boardBuf.width < bw || boardBuf.height < bh) {
      boardBuf.width = Math.max(bw, boardBuf.width);
      boardBuf.height = Math.max(bh, boardBuf.height);
    }
    const b = ctx2d(boardBuf);
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.clearRect(0, 0, bw, bh);
    b.setTransform(dpr, 0, 0, dpr, -minX * dpr, -minY * dpr);
    b.imageSmoothingEnabled = true;
    b.imageSmoothingQuality = "high";
    const N = 128, iw = img.width, ih = img.height;
    for (let i = 0; i < N; i++) {
      const u0 = i / N, u1 = (i + 1) / N;
      const x0 = proj(u0)[0], x1 = proj(u1)[0];
      const dw = Math.abs(x1 - x0);
      if (dw < 0.05) continue;
      const fm = D / (D - (sn * (u0 + u1)) / 2), hh = H * fm;
      const s0 = (side === "R" ? u0 : 1 - u0) * iw, s1 = (side === "R" ? u1 : 1 - u1) * iw;
      b.drawImage(img, Math.min(s0, s1), 0, Math.max(1, Math.abs(s1 - s0)), ih, Math.min(x0, x1) - 0.4, cy - hh / 2, dw + 0.8, hh);
    }
    // it darkens a little as it turns away from the light
    b.globalCompositeOperation = "source-atop";
    b.fillStyle = `rgba(0,0,0,${0.25 * sn * sn})`;
    b.fillRect(minX, minY, maxX - minX, maxY - minY);
    b.globalCompositeOperation = "source-over";

    ctx.save();
    ctx.shadowColor = `rgba(0,0,0,${0.45 + 0.2 * sn})`;
    ctx.shadowBlur = (30 + 8 * sn) * dpr;
    ctx.shadowOffsetY = 14 * (1 - sn) * dpr;
    ctx.drawImage(boardBuf, 0, 0, bw, bh, minX, minY, bw / dpr, bh / dpr);
    ctx.restore();
  }

  // ---------- input ----------
  function hitTest(pt: Pt) {
    const W = geo.W, lx = (pt[0] - spineX()) / W, ly = (pt[1] - geo.y0) / W;
    if (ly < -0.04 || ly > PH + 0.04) return null;
    if (lx >= 0 && lx < 1.06 && canTurn(1)) return { dir: 1, x: Math.min(lx, 1), y: clamp(ly, 0, PH) };
    if (lx < 0 && lx > -1.06 && canTurn(-1)) return { dir: -1, x: Math.min(-lx, 1), y: clamp(ly, 0, PH) };
    return null;
  }

  function updateFromDrag(Xl: Pt) {
    if (!flip || !drag) return;
    if (flip.hard) {
      flip.t = Math.acos(clamp(Xl[0] / (flip.grab ?? 1), -1, 1));
      kick();
      return;
    }
    const Q: Pt = [Xl[0] + drag.shift, Xl[1]];
    const res = foldFromGrab(drag.G, Q, flip.C);
    if (res) { flip.C = res.C; flip.P = res.P; }
    else flip.P = [flip.C[0], flip.C[1]];
    kick();
  }

  function onPointerDown(e: PointerEvent) {
    if (!SPREADS.length) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (drag) return;
    if (mode === "anim") finishAnimNow();
    const pt: Pt = [e.clientX, e.clientY];
    const hit = hitTest(pt);
    if (!hit) return;
    e.preventDefault();
    lastPointerTurn = performance.now();
    try { canvas.setPointerCapture(e.pointerId); } catch {}
    const Xl = toLocal(pt, hit.dir);
    let G: Pt = [Math.min(1, Xl[0]), clamp(Xl[1], 0, PH)];
    const shift = Math.max(0, 0.6 - G[0]);
    G = [G[0] + shift, G[1]];
    if (isHard(hit.dir)) {
      flip = { dir: hit.dir, hard: true, t: 0, grab: Math.max(0.45, G[0] - shift), C: [1, 0], P: [1, 0] };
    } else {
      const C: Pt = [1, G[1] < PH / 2 ? 0 : PH];
      flip = { dir: hit.dir, t: 0, C, P: [C[0], C[1]] };
    }
    const now = performance.now();
    drag = { id: e.pointerId, dir: hit.dir, G, shift, start: pt, t0: now, samples: [[now, pt[0]]], moved: false, tapY: hit.y };
    mode = "drag";
    canvas.style.cursor = "grabbing";
    updateFromDrag(Xl);
  }

  function onPointerMove(e: PointerEvent) {
    const pt: Pt = [e.clientX, e.clientY];
    if (drag && e.pointerId === drag.id) {
      const now = performance.now();
      drag.samples.push([now, pt[0]]);
      while (drag.samples.length > 2 && now - drag.samples[0][0] > 110) drag.samples.shift();
      if (Math.hypot(pt[0] - drag.start[0], pt[1] - drag.start[1]) > 6) drag.moved = true;
      updateFromDrag(toLocal(pt, drag.dir));
      return;
    }
    // hovering only changes the cursor; the paper stays still until it's taken
    if (e.pointerType === "mouse" && mode === "idle") canvas.style.cursor = hitTest(pt) ? "grab" : "";
  }

  function release(e: PointerEvent, cancelled: boolean) {
    if (!drag || e.pointerId !== drag.id || !flip) return;
    const d = drag;
    drag = null;
    canvas.style.cursor = "";
    const pt: Pt = [e.clientX, e.clientY];
    const dt = performance.now() - d.t0;
    if (!cancelled && !d.moved && dt < 500) {
      queue.length = 0;
      mode = "idle";
      tapTurn(d.dir, d.tapY < PH / 2 ? 0 : PH);
      return;
    }
    // screen-space velocity, flipped into this page's outward direction
    let v = 0;
    const smp = d.samples;
    if (smp.length > 1) {
      const span = (smp[smp.length - 1][0] - smp[0][0]) / 1000;
      if (span > 0.001) v = (d.dir * (smp[smp.length - 1][1] - smp[0][1])) / span / geo.W;
    }
    const flat = flip.hard ? flip.t < 1e-3 : Math.hypot(flip.P[0] - flip.C[0], flip.P[1] - flip.C[1]) < 1e-3;
    // swiping across a page the "wrong" way still turns the book that way
    const dx = (pt[0] - d.start[0]) * d.dir;
    if (flat && !cancelled && dx > 40 && canTurn(-d.dir)) {
      flip = null;
      mode = "idle";
      tapTurn(-d.dir, PH);
      return;
    }
    const past = flip.hard ? flip.t > Math.PI / 2 : flip.P[0] < 0.05;
    const complete = !cancelled && (v < -1.1 || (v < 1.1 && past));
    startAnim(complete);
  }

  function onKey(e: KeyboardEvent) {
    if (!SPREADS.length || opts.paused?.()) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("input, textarea, [contenteditable]")) return;
    const k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || (k === " " && !e.shiftKey)) { e.preventDefault(); turn(1); }
    else if (k === "ArrowLeft" || k === "PageUp" || (k === " " && e.shiftKey)) { e.preventDefault(); turn(-1); }
    else if (k === "Home") { e.preventDefault(); goTo(0); }
    else if (k === "End") { e.preventDefault(); goTo(LAST); }
  }

  // swipes and edge taps anywhere on the canvas, outside the page itself
  let touchStart = { x: 0, y: 0, t: 0 };
  function onTouchStart(e: TouchEvent) {
    if (e.touches.length !== 1) return;
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: performance.now() };
  }
  function onTouchEnd(e: TouchEvent) {
    // the pointer handlers already turned (or are dragging) this page
    if (drag || performance.now() - lastPointerTurn < 800) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStart.x, dy = touch.clientY - touchStart.y, dt = performance.now() - touchStart.t;
    if (dt < 450 && Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0 && canTurn(1)) turn(1);
      else if (dx > 0 && canTurn(-1)) turn(-1);
      return;
    }
    if (dt < 300 && Math.hypot(dx, dy) < 16) {
      if (touch.clientX > vw * 0.7 && canTurn(1)) turn(1);
      else if (touch.clientX < vw * 0.3 && canTurn(-1)) turn(-1);
    }
  }

  function onChange() {
    canvas.setAttribute("aria-label", SPREADS[index].label);
    const sp = SPREADS[index];
    indicator.textContent =
      sp.kind === "cover" ? "cover"
      : sp.kind === "title" ? "title"
      : sp.kind === "page" ? `${sp.page.number} / ${SPREADS.length - 4}`
      : sp.kind === "ending" ? "fin"
      : "back";
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === LAST;
    opts.onIndex?.(index, LAST);
    try { history.replaceState(null, "", index ? `#p${index}` : location.pathname + location.search); } catch {}
  }

  // ---------- start ----------
  (async () => {
    await fontsReady;
    if (disposed) return;
    SPREADS = buildSpreads(book, fonts);
    LAST = SPREADS.length - 1;
    pages = SPREADS.map(() => null);
    const fromHash = parseInt(location.hash.replace(/\D/g, ""), 10);
    index = !isNaN(fromHash) && fromHash >= 0 && fromHash <= LAST ? fromHash : 0;

    on(canvas, "pointerdown", onPointerDown);
    on(canvas, "pointermove", onPointerMove);
    on(canvas, "pointerup", (e: PointerEvent) => release(e, false));
    on(canvas, "pointercancel", (e: PointerEvent) => release(e, true));
    on(canvas, "touchstart", onTouchStart, { passive: true });
    on(canvas, "touchend", onTouchEnd, { passive: true });
    on(document, "keydown", onKey);
    on(prevBtn, "click", () => turn(-1));
    on(nextBtn, "click", () => turn(1));
    on(window, "resize", () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(layout);
    });

    onChange();
    layout();
  })();

  return {
    goTo: (i: number) => goTo(i),
    destroy() {
      disposed = true;
      buildToken++;
      ac.abort();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      clearTimeout(buildTimer);
    },
  };
}
