"use client";

import { useState } from "react";

export default function AboutToggle() {
  const [gamerOpen, setGamerOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);

  return (
    <div className="grid min-w-0 gap-2 home-detail-row">
      <p className="text-[0.95rem] leading-none font-semibold text-white">
        about/
      </p>
      <p className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white/72">
        actively learning. always building. not stopping.{" "}
        <button
          onClick={() => { setGamerOpen((v) => !v); setAcademicsOpen(false); }}
          className="underline decoration-white/35 underline-offset-4 transition hover:text-white hover:decoration-white text-white/72 font-semibold cursor-pointer"
        >
          gamer
        </button>
        .{" "}
        <button
          onClick={() => { setAcademicsOpen((v) => !v); setGamerOpen(false); }}
          className="underline decoration-white/35 underline-offset-4 transition hover:text-white hover:decoration-white text-white/72 font-semibold cursor-pointer"
        >
          academics
        </button>
        .
        {gamerOpen && (
          <span className="block mt-1 text-white/50 text-[0.88rem]">
            ↳ chess 1700 elo &nbsp;·&nbsp; elite master ff — top 1% (2022)
          </span>
        )}
        {academicsOpen && (
          <span className="block mt-1 text-white/50 text-[0.88rem]">
            ↳ 94.2% in boards — school topper, before i knew what actually mattered.
          </span>
        )}
      </p>
    </div>
  );
}
