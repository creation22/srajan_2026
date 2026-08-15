"use client";

import Image from "next/image";
import meImage from "@/assets/me.png";

export default function ProtectedImage() {
  return (
    <div
      className="relative mx-auto w-full max-w-[28rem] md:mx-0 flex justify-center items-center"
      onContextMenu={(event) => event.preventDefault()}
    >
      <Image
        src={meImage}
        alt="wireframe chess king with math formulas"
        priority
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        sizes="(min-width: 1280px) 28rem, (min-width: 1024px) 40vw, 100vw"
        className="h-auto max-h-[36rem] w-full select-none object-contain opacity-95 rounded-[6px]"
      />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" />
    </div>
  );
}
