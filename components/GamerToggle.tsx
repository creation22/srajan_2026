"use client";

import { useState } from "react";

export default function GamerToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid min-w-0 gap-2 home-detail-row">
      <p className="text-[0.95rem] leading-none font-semibold text-white">
        about/
      </p>
      <p className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white/72">
        actively learning. always building. not stopping.{" "}
        <button
          onClick={() => setOpen((v) => !v)}
          className="underline decoration-white/35 underline-offset-4 transition hover:text-white hover:decoration-white text-white/72 font-semibold cursor-pointer"
        >
          gamer
        </button>
        {open && (
          <span className="block mt-1 text-white/50 text-[0.88rem]">
            ↳ chess 1700 elo &nbsp;·&nbsp; elite master ff — top 1% (2022)
          </span>
        )}
      </p>
    </div>
  );
}
