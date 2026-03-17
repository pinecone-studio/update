"use client";

import { useRef } from "react";
import { IoDiceOutline } from "react-icons/io5";
import { TAGLINES } from "./constants";

type TaglineBannerProps = {
  currentIndex: number;
  onRandom: () => void;
};

export function TaglineBanner({
  currentIndex,
  onRandom,
}: TaglineBannerProps) {
  const diceButtonRef = useRef<HTMLButtonElement>(null);

  const handleRandomTagline = () => {
    if (TAGLINES.length <= 1) return;
    diceButtonRef.current?.animate(
      [
        { transform: "translateY(-50%) rotate(0deg) scale(1)" },
        { transform: "translateY(-50%) rotate(-10deg) scale(0.96)" },
        { transform: "translateY(-50%) rotate(12deg) scale(1.03)" },
        { transform: "translateY(-50%) rotate(0deg) scale(1)" },
      ],
      { duration: 320, easing: "ease-in-out" }
    );
    onRandom();
  };

  return (
    <div className="relative flex w-full min-w-0 max-w-[650px] items-center gap-3">
      <div className="flex h-10 min-w-0 flex-1 items-center justify-center rounded-xl border border-white/10">
        <p className="truncate px-12 text-center text-[16px] font-medium tracking-[-0.2px] text-[#CFD6D8] lg:px-16 lg:text-[18px]">
          {TAGLINES[currentIndex]}
        </p>
      </div>
      <button
        ref={diceButtonRef}
        onClick={handleRandomTagline}
        className="group absolute right-0 top-1/2 inline-flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(0,0,0,0.35)] transition hover:border-white/20 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] active:scale-[0.98]"
        title="Шинэ уриа үг"
        aria-label="Change tagline"
      >
        <IoDiceOutline className="h-5 w-5 text-white/55 transition group-hover:text-white/85" />
      </button>
    </div>
  );
}
