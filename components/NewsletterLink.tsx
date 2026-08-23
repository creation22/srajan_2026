"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MEDIUM_SUBSCRIBE_URL = "https://medium.com/subscribe/@creation2224";

export default function NewsletterLink() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const label = pathname === "/" ? "newsletter" : "follow me on medium";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="fixed left-6 top-6 z-50 text-[0.95rem] leading-none font-semibold text-white sm:left-10 sm:top-10">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
        >
          {label}
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 py-10 overflow-y-auto"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="subscribe to my newsletter"
        >
          <div
            className="relative w-full max-w-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="close"
              className="absolute -top-2 right-0 text-white/50 transition hover:text-white sm:-top-6 sm:right-0 text-3xl leading-none"
            >
              &times;
            </button>

            <p className="text-lg font-semibold leading-snug text-white sm:text-2xl">
              are you done reading the same AI slop everywhere?
            </p>

            <p className="mt-5 text-[0.95rem] leading-relaxed font-semibold text-white/72">
              if you want to read something written by a real human, subscribe
              to my newsletter.
            </p>

            <p className="mt-4 text-[0.95rem] leading-relaxed font-semibold text-white/72">
              no AI-generated essays, only all about my learnings: short,
              handwritten notes on tech, life, content, health and whatever i am
              figuring out.
            </p>

            <p className="mt-4 text-[0.95rem] leading-relaxed font-semibold text-white/72">
              i promise i will never spam, or post AI slop.
            </p>

            <a
              href={MEDIUM_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/80"
            >
              follow me on medium
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
