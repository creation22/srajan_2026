"use client";

import Image from "next/image";
import meImage from "@/assets/me.png";

export default function ProtectedImage() {
  return (
    <div
      className="relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-[6px] bg-white/5 md:mx-0 flex justify-center items-center"
      onContextMenu={(event) => event.preventDefault()}
    >
      <Image
        src={meImage}
        alt="wireframe chess king with math formulas"
        priority
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        sizes="(min-width: 1280px) 22rem, (min-width: 1024px) 30vw, 100vw"
        className="h-auto max-h-[30rem] w-full select-none object-contain opacity-90 rounded-[6px]"
      />
      <div className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
