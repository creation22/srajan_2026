"use client";

import { useEffect, useState } from "react";

const BIRTH_TIMESTAMP = new Date("2005-09-22T00:00:00+05:30").getTime();
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2425;

export default function AboutToggle() {
  const [ageStr, setAgeStr] = useState<string>("");
  const [gamerOpen, setGamerOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const updateAge = () => {
      const now = Date.now();
      const age = (now - BIRTH_TIMESTAMP) / MS_PER_YEAR;
      setAgeStr(age.toFixed(8));
      animationFrameId = requestAnimationFrame(updateAge);
    };

    updateAge();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="grid min-w-0 gap-2 home-detail-row">
      <p className="text-[0.95rem] leading-none font-semibold text-white">
        about/
      </p>
      <p className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white/72">
        <span className="font-mono text-white/90">{ageStr || "20"}</span>, m, india.{" "}
        <button
          onClick={() => {
            setGamerOpen((v) => !v);
            setAcademicsOpen(false);
          }}
          className="underline decoration-white/35 underline-offset-4 transition hover:text-white hover:decoration-white text-white/72 font-semibold cursor-pointer"
        >
          gamer
        </button>
        .{" "}
        <button
          onClick={() => {
            setAcademicsOpen((v) => !v);
            setGamerOpen(false);
          }}
          className="underline decoration-white/35 underline-offset-4 transition hover:text-white hover:decoration-white text-white/72 font-semibold cursor-pointer"
        >
          academics
        </button>
        .
        {gamerOpen && (
          <span className="block mt-1 text-white/50 text-[0.88rem]">
            ↳ chess 1700 elo &nbsp;·&nbsp; elite master free fire - top 1% (2022)
          </span>
        )}
        {academicsOpen && (
          <span className="block mt-1 text-white/50 text-[0.88rem]">
            ↳ 92.4% in 10th &nbsp;·&nbsp; 94.2% in 12th. loves math.
          </span>
        )}
      </p>
    </div>
  );
}
