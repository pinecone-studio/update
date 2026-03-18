"use client";

import { toneClass, getIconSymbol } from "../_lib/utils";
import type { StatCard } from "../_lib/dashboard-types";

type FinanceStatCardProps = {
  card: StatCard;
  onClick: () => void;
};

export function FinanceStatCard({ card, onClick }: FinanceStatCardProps) {
  const isPendingCard = card.key === "pending";
  const isNoPending = isPendingCard && card.value === "0";
  const noteMatch = card.note.match(/(\d+%)(.*)/);

  return (
    <button
      type="button"
      onClick={onClick}
      className="min-w-0 rounded-3xl border border-[rgba(96,126,186,0.52)] bg-[radial-gradient(circle_at_20%_118%,rgba(248,160,89,0.08),transparent_52%),radial-gradient(circle_at_88%_14%,rgba(86,124,255,0.04),transparent_46%),linear-gradient(160deg,rgba(62,34,111,0.42),rgba(37,30,98,0.38))] p-5 text-left backdrop-blur-[2px] transition hover:border-[rgba(118,150,211,0.65)] sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] ${toneClass(card.tone)}`}
        >
          {isPendingCard ? card.value : getIconSymbol(card.icon)}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(56,86,131,0.6)] text-2xl text-[#2A8BFF]">
          ›
        </span>
      </div>
      {isNoPending ? (
        <>
          <p className="text-[20px] font-bold leading-tight text-[#E8F2FF]">{card.value}</p>
          <p className="mt-3 text-[20px] font-semibold leading-tight text-white">
            No Pending Requests
          </p>
          <p className="mt-3 text-[15px] leading-tight text-[#A7B6D3]">
            🎉 All requests are processed
          </p>
        </>
      ) : (
        <>
          <p className="text-[20px] font-bold leading-tight text-[#E8F2FF]">{card.value}</p>
          <p className="mt-3 text-[20px] font-semibold leading-tight text-white">{card.title}</p>
          <div className="mt-4 h-px bg-[#2B405F]" />
          <p className="mt-3 text-[15px] leading-tight text-[#A7B6D3]">
            {noteMatch ? (
              <>
                <span className="text-[#00C95F]">{noteMatch[1]}</span>
                <span>{noteMatch[2]}</span>
              </>
            ) : (
              card.note
            )}
          </p>
        </>
      )}
    </button>
  );
}
