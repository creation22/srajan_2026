// The left-hand pages: a quote set quietly on a near-black page, with one
// thin line motif per scene underneath. Everything is drawn on the PW × SH
// page space.

import type { SceneName, Wallpaper } from "@/content/book";
import { PW, SH, TAU, applyGrain, makeRand, spacedText, wrapText, type Ctx, type Rand } from "./paper";

export type Fonts = { serif: string };

const BG = "#0f0f0f";
const INK = "#ececec";
const LINE = "rgba(236,236,236,.32)";
const MUTED = "rgba(236,236,236,.42)";
const PICTURE_PAGE = "#f6f4ef";
const QUOTE_X = 125;
const QUOTE_W = 600;
const HORIZON = 960;

// chess king silhouette, x from the centre line and y up from the base
export const KING_OUTLINE: [number, number][] = [
  [-150, 0], [-150, 34], [-118, 52], [-118, 74], [-86, 92], [-60, 110], [-44, 300], [-86, 318], [-86, 340],
  [-52, 350], [-70, 400], [-58, 430], [-26, 440], [-26, 460], [-10, 460], [-10, 482], [-30, 482], [-30, 508],
  [-10, 508], [-10, 530], [10, 530], [10, 508], [30, 508], [30, 482], [10, 482], [10, 460], [26, 460], [26, 440],
  [58, 430], [70, 400], [52, 350], [86, 340], [86, 318], [44, 300], [60, 110], [86, 92], [118, 74], [118, 52],
  [150, 34], [150, 0],
];

function stroke(g: Ctx, pts: [number, number][], close = false) {
  g.beginPath();
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  if (close) g.closePath();
  g.stroke();
}

const horizon = (g: Ctx) => stroke(g, [[QUOTE_X, HORIZON], [PW - QUOTE_X, HORIZON]]);

// ---------------------------------------------------------------------------
// Motifs — one quiet drawing each, in thin lines
// ---------------------------------------------------------------------------

const MOTIFS: Record<SceneName, (g: Ctx, r: Rand) => void> = {
  summit(g) {
    horizon(g);
    stroke(g, [[275, HORIZON], [425, 790], [575, HORIZON]]);
    g.beginPath(); g.arc(540, 760, 20, 0, TAU); g.stroke();
  },
  storm(g) {
    horizon(g);
    stroke(g, [[470, 720], [438, 820], [470, 820], [432, HORIZON]]);
  },
  redsun(g) {
    horizon(g);
    g.beginPath(); g.arc(PW / 2, HORIZON, 110, Math.PI, TAU); g.stroke();
  },
  king(g) {
    const s = 0.36, cx = PW / 2, base = HORIZON;
    stroke(g, KING_OUTLINE.map(([x, y]) => [cx + x * s, base - y * s] as [number, number]), true);
  },
  city(g, r) {
    horizon(g);
    let x = 235;
    for (let i = 0; i < 7; i++) {
      const w = r.range(30, 52), h = r.range(50, 170);
      stroke(g, [[x, HORIZON], [x, HORIZON - h], [x + w, HORIZON - h], [x + w, HORIZON]]);
      x += w + 12;
    }
  },
  embers(g, r) {
    g.fillStyle = LINE;
    for (let i = 0; i < 46; i++) {
      const t = Math.pow(r(), 0.8);
      g.globalAlpha = 1 - t * 0.8;
      g.beginPath();
      g.arc(PW / 2 + r.range(-170, 170) * (1 - t * 0.4), HORIZON + 20 - t * 280, r.range(1.5, 3.2), 0, TAU);
      g.fill();
    }
    g.globalAlpha = 1;
  },
};

function quoteBlock(g: Ctx, fonts: Fonts, quote: string, by?: string) {
  let size = 60;
  let lines: string[] = [];
  for (; size >= 34; size -= 2) {
    g.font = `300 ${size}px ${fonts.serif}`;
    lines = wrapText(g, quote, QUOTE_W);
    if (lines.length * size * 1.32 <= 420) break;
  }
  const lh = size * 1.32;
  let y = 250;
  g.fillStyle = LINE;
  g.fillRect(QUOTE_X, y, 40, 1.5);
  y += 70;
  g.textAlign = "left";
  g.textBaseline = "alphabetic";
  g.fillStyle = INK;
  lines.forEach((line, i) => g.fillText(line, QUOTE_X, y + i * lh));
  if (by) {
    g.fillStyle = MUTED;
    g.font = `400 18px ${fonts.serif}`;
    spacedText(g, by.toUpperCase(), QUOTE_X, y + (lines.length - 1) * lh + 64, 5, "left");
  }
}

// draws a quote page onto the page space; `img` is the loaded photo for src wallpapers
export function drawWallpaper(g: Ctx, wp: Wallpaper, seed: number, fonts: Fonts, img?: HTMLImageElement | null) {
  g.fillStyle = BG;
  g.fillRect(0, 0, PW, SH);
  if ("scene" in wp) {
    g.strokeStyle = LINE;
    g.lineWidth = 1.6;
    g.lineJoin = "round";
    g.lineCap = "round";
    MOTIFS[wp.scene](g, makeRand(seed));
    applyGrain(g, PW, SH, 0.12);
    quoteBlock(g, fonts, wp.quote, wp.by);
    return;
  }
  if (!wp.quote) {
    // a picture on its own: shown whole, mounted on a light page
    g.fillStyle = PICTURE_PAGE;
    g.fillRect(0, 0, PW, SH);
    if (img && img.width) {
      const pad = 70;
      const s = Math.min((PW - pad * 2) / img.width, (SH - pad * 2) / img.height);
      const w = img.width * s, h = img.height * s;
      g.drawImage(img, (PW - w) / 2, (SH - h) / 2, w, h);
    }
    applyGrain(g, PW, SH, 0.3);
    return;
  }
  // a picture behind a quote: black and white, darkened so the words read
  if (img && img.width) {
    const s = Math.max(PW / img.width, SH / img.height);
    const w = img.width * s, h = img.height * s;
    g.save();
    g.filter = "grayscale(1) brightness(.55)";
    g.drawImage(img, (PW - w) / 2, (SH - h) / 2, w, h);
    g.restore();
  }
  applyGrain(g, PW, SH, 0.12);
  quoteBlock(g, fonts, wp.quote, wp.by);
}
