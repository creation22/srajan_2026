// Canvas helpers shared by every page of the book: seeded randomness,
// paper grain and the gutter/corner finish. Adapted from
// github.com/shubhu121/art-book.

export const TAU = Math.PI * 2;
export const PW = 850; // coordinate width of one page
export const SH = 1200; // coordinate height of one page
export const PH = SH / PW; // page height ÷ page width
export const PAPER = "#f6f4ef";

export type Ctx = CanvasRenderingContext2D;
export type Pt = [number, number];

export type Rand = (() => number) & {
  range: (lo: number, hi: number) => number;
  int: (lo: number, hi: number) => number;
  pick: <T>(arr: T[]) => T;
  chance: (p: number) => boolean;
};

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function makeRand(seed: number): Rand {
  let a = seed >>> 0;
  const r = (() => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }) as Rand;
  r.range = (lo, hi) => lo + (hi - lo) * r();
  r.int = (lo, hi) => Math.floor(lo + (hi - lo + 1) * r());
  r.pick = (arr) => arr[Math.floor(r() * arr.length)];
  r.chance = (p) => r() < p;
  return r;
}

export function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

export function ctx2d(c: HTMLCanvasElement): Ctx {
  const g = c.getContext("2d");
  if (!g) throw new Error("2d canvas unavailable");
  return g;
}

// a page-sized canvas whose drawing space is PW × SH regardless of resolution
export function pageCanvas(pw: number) {
  const c = makeCanvas(pw, Math.round(pw * PH));
  const g = ctx2d(c);
  g.setTransform(pw / PW, 0, 0, pw / PW, 0, 0);
  return { c, g };
}

let grainTileCache: HTMLCanvasElement | null = null;
let toothTileCache: HTMLCanvasElement | null = null;

function grainTile() {
  if (grainTileCache) return grainTileCache;
  const c = makeCanvas(256, 256);
  const x = ctx2d(c);
  const id = x.createImageData(256, 256);
  const d = id.data;
  const r = makeRand(7);
  for (let i = 0; i < d.length; i += 4) {
    const v = r();
    if (v < 0.03) {
      d[i] = 255; d[i + 1] = 253; d[i + 2] = 247; d[i + 3] = 30 + r() * 80;
    } else if (v < 0.09) {
      d[i] = 110; d[i + 1] = 90; d[i + 2] = 72; d[i + 3] = 8 + r() * 26;
    }
  }
  x.putImageData(id, 0, 0);
  return (grainTileCache = c);
}

function toothTile() {
  if (toothTileCache) return toothTileCache;
  const c = makeCanvas(160, 160);
  const x = ctx2d(c);
  const r = makeRand(9);
  for (let i = 0; i < 900; i++) {
    x.fillStyle = r() < 0.5 ? `rgba(255,255,255,${r.range(0.05, 0.16)})` : `rgba(90,70,55,${r.range(0.02, 0.06)})`;
    x.beginPath();
    x.arc(r() * 160, r() * 160, r.range(0.6, 1.8), 0, TAU);
    x.fill();
  }
  return (toothTileCache = c);
}

export function applyGrain(g: Ctx, w: number, h: number, alpha = 1) {
  const p1 = g.createPattern(grainTile(), "repeat");
  const p2 = g.createPattern(toothTile(), "repeat");
  if (!p1 || !p2) return;
  p1.setTransform?.(new DOMMatrix().scale(1.5));
  p2.setTransform?.(new DOMMatrix().scale(2.6).rotate(14));
  g.save();
  g.globalAlpha = alpha;
  g.fillStyle = p1;
  g.fillRect(0, 0, w, h);
  g.globalAlpha = 0.8 * alpha;
  g.fillStyle = p2;
  g.fillRect(0, 0, w, h);
  g.restore();
}

// gutter shading + rounded outer corners
export function finishPage(c: HTMLCanvasElement, side: "L" | "R", cover: boolean) {
  const g = ctx2d(c), w = c.width, h = c.height;
  const spine = side === "R" ? 0 : w, dir = side === "R" ? 1 : -1;
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gw = w * (cover ? 0.06 : 0.11);
  const tone = "0,0,0";
  const gr = g.createLinearGradient(spine, 0, spine + dir * gw, 0);
  gr.addColorStop(0, `rgba(${tone},.16)`);
  gr.addColorStop(0.28, `rgba(${tone},.04)`);
  gr.addColorStop(1, `rgba(${tone},0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, w, h);
  const rad = w * 0.03;
  g.globalCompositeOperation = "destination-in";
  g.beginPath();
  if (side === "R") {
    g.moveTo(0, 0); g.lineTo(w - rad, 0); g.quadraticCurveTo(w, 0, w, rad);
    g.lineTo(w, h - rad); g.quadraticCurveTo(w, h, w - rad, h); g.lineTo(0, h);
  } else {
    g.moveTo(w, 0); g.lineTo(rad, 0); g.quadraticCurveTo(0, 0, 0, rad);
    g.lineTo(0, h - rad); g.quadraticCurveTo(0, h, rad, h); g.lineTo(w, h);
  }
  g.closePath();
  g.fillStyle = "#000";
  g.fill();
  g.restore();
}

// greedy word wrap; returns the lines that fit `width` in the current font
export function wrapText(g: Ctx, text: string, width: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (line && g.measureText(next).width > width) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// letter-spaced text (canvas letterSpacing support is still patchy)
export function spacedText(g: Ctx, text: string, x: number, y: number, spacing: number, align: "left" | "center" = "center") {
  const chars = [...text];
  const widths = chars.map((ch) => g.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  const prevAlign = g.textAlign;
  g.textAlign = "left";
  let cx = align === "center" ? x - total / 2 : x;
  chars.forEach((ch, i) => {
    g.fillText(ch, cx, y);
    cx += widths[i] + spacing;
  });
  g.textAlign = prevAlign;
  return total;
}
