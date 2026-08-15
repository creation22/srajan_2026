"use client";

import Image from "next/image";
import meImage from "@/assets/me.png";

export default function ProtectedImage() {
  return (
    <div
      className="relative mx-auto w-full h-[22rem] sm:h-full overflow-hidden rounded-[6px] bg-white/5 md:mx-0"
      onContextMenu={(event) => event.preventDefault()}
    >
      <Image
        src={meImage}
        alt="wireframe chess king with math formulas"
        priority
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        fill
        sizes="(min-width: 1280px) 22rem, (min-width: 1024px) 30vw, 100vw"
        className="select-none object-cover object-center opacity-90"
      />
      <div className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
