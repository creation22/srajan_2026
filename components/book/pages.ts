// Covers, endpapers, title and ending pages, and the typeset writing pages.
// Kept deliberately plain: flat paper, one typeface, no ornaments.

import type { Book, Chapter } from "@/content/book";
import { PW, SH, applyGrain, ctx2d, finishPage, makeCanvas, pageCanvas, spacedText, wrapText, type Ctx } from "./paper";
import type { Fonts } from "./scenes";

const PAPER = "#f6f4ef";
const INK = "#1f1f1f";
const MUTED = "rgba(31,31,31,.45)";
const COVER = "#121212";
const COVER_INK = "#e8e8e8";
const COVER_MUTED = "rgba(232,232,232,.4)";

const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];
export const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

function flat(pw: number, color: string, grain: number) {
  const { c, g } = pageCanvas(pw);
  g.fillStyle = color;
  g.fillRect(0, 0, PW, SH);
  applyGrain(g, PW, SH, grain);
  return { c, g };
}

// the largest size (≤ max) at which `text` fits `width`
function fitSize(g: Ctx, text: string, font: (size: number) => string, width: number, max: number) {
  for (let size = max; size > 20; size -= 2) {
    g.font = font(size);
    if (g.measureText(text).width <= width) return size;
  }
  return 20;
}

export function drawCover(pw: number, which: "front" | "back", book: Book, fonts: Fonts) {
  const { c, g } = flat(pw, COVER, 0.18);
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  const cx = PW / 2;
  if (which === "front") {
    g.fillStyle = COVER_INK;
    g.font = `300 ${fitSize(g, book.title, (s) => `300 ${s}px ${fonts.serif}`, 600, 92)}px ${fonts.serif}`;
    g.fillText(book.title, cx, 560);
    g.fillStyle = COVER_MUTED;
    g.font = `400 20px ${fonts.serif}`;
    spacedText(g, book.author.toUpperCase(), cx, 630, 8);
  } else {
    g.fillStyle = COVER_MUTED;
    g.font = `400 16px ${fonts.serif}`;
    spacedText(g, "HEYSRAJAN.COM", cx, 1090, 6);
  }
  finishPage(c, which === "front" ? "R" : "L", true);
  return c;
}

// inside of each hard cover
export function drawEndpaper(pw: number, side: "L" | "R") {
  const { c } = flat(pw, "#181818", 0.14);
  finishPage(c, side, true);
  return c;
}

export function drawTitlePage(pw: number, book: Book, fonts: Fonts) {
  const { c, g } = flat(pw, PAPER, 0.35);
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  const cx = PW / 2;
  g.fillStyle = INK;
  g.font = `300 ${fitSize(g, book.title, (s) => `300 ${s}px ${fonts.serif}`, 560, 72)}px ${fonts.serif}`;
  g.fillText(book.title, cx, 500);
  g.fillStyle = MUTED;
  g.font = `400 18px ${fonts.serif}`;
  spacedText(g, book.author.toUpperCase(), cx, 560, 7);
  g.font = `italic 300 24px ${fonts.serif}`;
  const lines = wrapText(g, book.epigraph.quote, 460);
  lines.forEach((line, i) => g.fillText(line, cx, 860 + i * 38));
  g.font = `400 15px ${fonts.serif}`;
  spacedText(g, book.epigraph.by.toUpperCase(), cx, 860 + lines.length * 38 + 26, 5);
  finishPage(c, "R", false);
  return c;
}

export function drawEndingPage(pw: number, book: Book, fonts: Fonts) {
  const { c, g } = flat(pw, PAPER, 0.35);
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  const cx = PW / 2;
  g.fillStyle = INK;
  g.font = `300 ${fitSize(g, book.ending.title, (s) => `300 ${s}px ${fonts.serif}`, 560, 48)}px ${fonts.serif}`;
  g.fillText(book.ending.title, cx, 560);
  g.fillStyle = MUTED;
  g.font = `italic 300 24px ${fonts.serif}`;
  wrapText(g, book.ending.note, 460).forEach((line, i) => g.fillText(line, cx, 615 + i * 38));
  finishPage(c, "L", false);
  return c;
}

// ---------------------------------------------------------------------------
// Typesetting
// ---------------------------------------------------------------------------

const BODY = 28;
const LH = 46;
const MARGIN_X = 110;
const TEXT_W = PW - MARGIN_X * 2;
const TOP = 160; // first baseline on a running page
const FIRST_TOP = 470; // first baseline under a chapter heading
const BOTTOM = 1060; // last baseline
const INDENT = 40;

type Word = { text: string; italic: boolean };
type Block = { kind: "p"; words: Word[] } | { kind: "break" };

type PlacedWord = { text: string; italic: boolean; x: number };
type Line = { y: number; words: PlacedWord[] };

export type WritingPage = {
  chapter: Chapter;
  opening: boolean;
  number: number;
  lines: Line[];
  breaks: number[];
};

function parse(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.trim().split(/\n\s*\n/)) {
    const para = raw.trim().replace(/\s+/g, " ");
    if (!para) continue;
    if (/^(-{3,}|\*{3,}|\* \* \*)$/.test(para)) {
      blocks.push({ kind: "break" });
      continue;
    }
    let italic = false;
    const words: Word[] = [];
    for (let tok of para.split(" ")) {
      if (tok.startsWith("*")) {
        italic = true;
        tok = tok.slice(1);
      }
      const wordItalic = italic;
      const end = tok.match(/^(.*)\*([.,;:!?'"”’)\]]*)$/);
      if (end) {
        tok = end[1] + end[2];
        italic = false;
      }
      if (tok) words.push({ text: tok, italic: wordItalic });
    }
    if (words.length) blocks.push({ kind: "p", words });
  }
  return blocks;
}

// lays a chapter out into as many pages as it needs
export function typesetChapter(chapter: Chapter, fonts: Fonts, firstNumber: number): WritingPage[] {
  const g = ctx2d(makeCanvas(4, 4));
  const font = (italic: boolean) => `${italic ? "italic " : ""}400 ${BODY}px ${fonts.serif}`;
  const widths = new Map<string, number>();
  const measure = (w: Word) => {
    const key = (w.italic ? "i" : "r") + w.text;
    let v = widths.get(key);
    if (v === undefined) {
      g.font = font(w.italic);
      v = g.measureText(w.text).width;
      widths.set(key, v);
    }
    return v;
  };
  g.font = font(false);
  const space = g.measureText(" ").width;

  const pages: WritingPage[] = [];
  let pg: WritingPage = { chapter, opening: true, number: firstNumber, lines: [], breaks: [] };
  pages.push(pg);
  let y = FIRST_TOP;
  const nextLine = () => {
    y += LH;
    if (y > BOTTOM) {
      pg = { chapter, opening: false, number: firstNumber + pages.length, lines: [], breaks: [] };
      pages.push(pg);
      y = TOP;
    }
  };

  let firstPara = true;
  let afterBreak = false;
  for (const block of parse(chapter.text)) {
    if (block.kind === "break") {
      if (pg.lines.length) nextLine();
      pg.breaks.push(y - BODY * 0.35);
      nextLine();
      afterBreak = true;
      continue;
    }
    const words = block.words;
    let i = 0;
    let lineInPara = 0;
    while (i < words.length) {
      const indent = lineInPara === 0 && !firstPara && !afterBreak ? INDENT : 0;
      const avail = TEXT_W - indent;
      let used = 0;
      let j = i;
      while (j < words.length) {
        const add = (j > i ? space : 0) + measure(words[j]);
        if (j > i && used + add > avail) break;
        used += add;
        j++;
      }
      // ragged right: even word spacing reads calmer than justified gaps
      const line = words.slice(i, j);
      let x = MARGIN_X + indent;
      pg.lines.push({
        y,
        words: line.map((w) => {
          const placed = { text: w.text, italic: w.italic, x };
          x += measure(w) + space;
          return placed;
        }),
      });
      i = j;
      lineInPara++;
      nextLine();
    }
    firstPara = false;
    afterBreak = false;
  }
  // drop a trailing empty page left behind by the last line break
  if (pages.length > 1 && !pg.lines.length && !pg.breaks.length) pages.pop();
  return pages;
}

export function drawWritingPage(pw: number, wp: WritingPage, fonts: Fonts) {
  const { c, g } = flat(pw, PAPER, 0.35);
  const cx = PW / 2;
  g.textBaseline = "alphabetic";

  if (wp.opening) {
    g.textAlign = "left";
    g.fillStyle = MUTED;
    g.font = `400 18px ${fonts.serif}`;
    spacedText(g, `CHAPTER ${numberWord(wp.chapter.number).toUpperCase()}`, MARGIN_X, 250, 6, "left");
    g.fillStyle = INK;
    g.font = `300 ${fitSize(g, wp.chapter.title, (s) => `300 ${s}px ${fonts.serif}`, TEXT_W, 54)}px ${fonts.serif}`;
    g.fillText(wp.chapter.title, MARGIN_X, 330);
  }

  g.textAlign = "left";
  g.fillStyle = INK;
  for (const line of wp.lines) {
    for (const w of line.words) {
      g.font = `${w.italic ? "italic " : ""}400 ${BODY}px ${fonts.serif}`;
      g.fillText(w.text, w.x, line.y);
    }
  }

  g.fillStyle = MUTED;
  for (const y of wp.breaks) g.fillRect(cx - 20, y, 40, 1.2);

  g.textAlign = "center";
  g.font = `400 18px ${fonts.serif}`;
  g.fillText(String(wp.number), cx, 1130);

  finishPage(c, "R", false);
  return c;
}
