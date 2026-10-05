"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { book } from "@/content/book";
import { mountBook } from "./engine";
import { numberWord } from "./pages";

type BookProps = {
  serif: string;
  serifClassName: string;
};

// `*word*` → <em>word</em>
function inline(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function Reader({ serifClassName, onClose }: { serifClassName: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // portalled so it stacks above the site's fixed corner links
  return createPortal(
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#050505]/95 px-6 py-20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`read ${book.title} as text`}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="fixed right-6 top-6 text-[0.95rem] font-semibold text-white underline decoration-white/35 underline-offset-4 hover:decoration-white sm:right-10 sm:top-10"
      >
        back to the book
      </button>
      <article className={`${serifClassName} mx-auto w-full max-w-[34rem] text-white/90`}>
        <p className="text-xs tracking-[0.35em] text-white/40 uppercase">{book.author}</p>
        <h1 className="mt-3 text-5xl font-light">{book.title}</h1>
        {book.chapters.map((chapter) => (
          <section key={chapter.number} className="mt-16">
            <p className="text-xs tracking-[0.35em] text-white/40 uppercase">
              chapter {numberWord(chapter.number)}
            </p>
            <h2 className="mt-3 text-3xl font-light">{chapter.title}</h2>
            {chapter.wallpapers?.map((wp) =>
              "src" in wp ? (
                <Image
                  key={wp.src}
                  src={wp.src}
                  alt={wp.alt ?? wp.quote ?? ""}
                  width={1000}
                  height={1000}
                  className="mt-8 h-auto w-full"
                />
              ) : null,
            )}
            <div className="mt-8 space-y-6 text-[1.08rem] leading-8 text-white/75">
              {chapter.text
                .trim()
                .split(/\n\s*\n/)
                .map((para, i) =>
                  /^(-{3,}|\*{3,}|\* \* \*)$/.test(para.trim()) ? (
                    <hr key={i} className="mx-auto w-10 border-white/25" />
                  ) : (
                    <p key={i}>{inline(para.trim().replace(/\s+/g, " "))}</p>
                  ),
                )}
            </div>
          </section>
        ))}
        <p className="mt-16 text-center italic text-white/45">
          {book.ending.title} — {book.ending.note}
        </p>
      </article>
    </div>,
    document.body,
  );
}

export default function Book({ serif, serifClassName }: BookProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const readerOpenRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const closeReader = useCallback(() => setReaderOpen(false), []);

  useEffect(() => {
    readerOpenRef.current = readerOpen;
  }, [readerOpen]);

  useEffect(() => {
    const canvas = canvasRef.current, nav = navRef.current, prev = prevRef.current;
    const next = nextRef.current, indicator = indicatorRef.current;
    if (!canvas || !nav || !prev || !next || !indicator) return;
    const handle = mountBook(
      { canvas, nav, prev, next, indicator },
      {
        book,
        fonts: { serif },
        onReady: () => setReady(true),
        paused: () => readerOpenRef.current,
      },
    );
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      handle.destroy();
      document.body.style.overflow = overflow;
    };
  }, [serif]);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-[#050505]">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`${book.title}, ${book.subtitle}`}
        className={`absolute inset-0 h-full w-full touch-none outline-none transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />

      {!ready ? (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-white/40">
          opening the book…
        </p>
      ) : null}

      <p className="pointer-events-none fixed inset-x-0 bottom-16 text-center text-xs text-white/45 sm:hidden landscape:hidden">
        turn your phone sideways, or tap read
      </p>

      <nav
        ref={navRef}
        aria-label="book navigation"
        className="fixed bottom-[max(14px,env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-[0.85rem] font-semibold text-white/80 backdrop-blur-md"
      >
        <button
          ref={prevRef}
          type="button"
          aria-label="previous page"
          className="rounded-full px-2 text-lg leading-none transition hover:bg-white/10 disabled:opacity-25"
        >
          ‹
        </button>
        <span ref={indicatorRef} className="min-w-14 text-center tracking-wide" />
        <button
          ref={nextRef}
          type="button"
          aria-label="next page"
          className="rounded-full px-2 text-lg leading-none transition hover:bg-white/10 disabled:opacity-25"
        >
          ›
        </button>
        <span className="h-4 w-px bg-white/15" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setReaderOpen(true)}
          className="underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
        >
          read
        </button>
      </nav>

      {readerOpen ? <Reader serifClassName={serifClassName} onClose={closeReader} /> : null}
    </div>
  );
}
