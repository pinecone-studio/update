/** @format */

"use client";

import { useRef } from "react";
import { IoDiceOutline } from "react-icons/io5";
import { TAGLINES } from "./constants";

type TaglineBannerProps = {
	currentIndex: number;
	onRandom: () => void;
};

export function TaglineBanner({ currentIndex, onRandom }: TaglineBannerProps) {
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
			{ duration: 320, easing: "ease-in-out" },
		);
		onRandom();
	};

	return (
		<div className="relative flex w-full min-w-0 max-w-[650px] items-center gap-3">
			<div className="flex h-10 min-w-0 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white/60 dark:border-white/10 dark:bg-transparent">
				<p className="truncate whitespace-pre px-12 text-center text-[16px] font-light tracking-[-0.2px] text-slate-600 lg:px-16 lg:text-[18px] dark:text-[#CFD6D8]">
					{TAGLINES[currentIndex]}
				</p>
			</div>
			<button
				ref={diceButtonRef}
				onClick={handleRandomTagline}
				className="group absolute right-0 top-1/2 inline-flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-[18px] border border-slate-200 bg-slate-100 shadow transition hover:border-slate-300 hover:bg-slate-200 active:scale-[0.98] dark:border-white/10 dark:bg-[#06080f] dark:shadow-[0_10px_24px_rgba(0,0,0,0.45)] dark:hover:border-white/20 dark:hover:bg-[#0d1320]"
				title="Шинэ уриа үг"
				aria-label="Change tagline"
			>
				<IoDiceOutline className="h-5 w-5 text-slate-600 transition group-hover:text-slate-800 dark:text-white/80 dark:group-hover:text-white" />
			</button>
		</div>
	);
}
