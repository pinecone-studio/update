"use client";

import { toneClass, getIconSymbol } from "../_lib/utils";
import type { StatCard } from "../_lib/dashboard-types";

type FinanceStatCardProps = {
  card: StatCard;
  onClick: () => void;
};

export function FinanceStatCard({ card, onClick }: FinanceStatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 dark:border-[#2C4264] dark:bg-[#1E293B] dark:hover:border-[#2B405F]"
    >
      <div className="mb-6 flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-semibold ${toneClass(card.tone)}`}
        >
          {getIconSymbol(card.icon)}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-2xl text-blue-600 dark:bg-[#24364F] dark:text-[#2A8BFF]">
          ›
        </span>
      </div>
      <p className="text-5 font-bold text-slate-900 dark:text-white">
        {card.value}
      </p>
      <p className="mt-2 text-5 text-slate-600 dark:text-[#A7B6D3]">
        {card.title}
      </p>
      <div className="mt-4 h-px bg-slate-200 dark:bg-[#2B405F]" />
      <p
        className={`mt-4 text-5 ${card.tone === "green" ? "text-green-600 dark:text-[#00C95F]" : "text-slate-600 dark:text-[#A7B6D3]"}`}
      >
        {card.note}
      </p>
    </button>
  );
}
