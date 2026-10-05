"use client";

import { useEffect, useState } from "react";

const BIRTH_TIMESTAMP = new Date("2005-09-22T00:00:00+05:30").getTime();
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2425;
// whole years at load time, shown until the live counter starts
const AGE_AT_LOAD = Math.floor((Date.now() - BIRTH_TIMESTAMP) / MS_PER_YEAR);

export default function WhoAge() {
  const [ageStr, setAgeStr] = useState<string>("");

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
        who/
      </p>
      <p className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white/72">
        <span className="font-mono text-white/90" suppressHydrationWarning>
          {ageStr || AGE_AT_LOAD}
        </span>
        , m, india
      </p>
    </div>
  );
}
