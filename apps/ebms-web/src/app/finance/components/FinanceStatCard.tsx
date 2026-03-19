"use client";

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
      className="min-w-0 rounded-3xl border border-[rgba(149,137,199,0.42)] bg-[radial-gradient(circle_at_20%_118%,rgba(255,194,145,0.18),transparent_55%),radial-gradient(circle_at_88%_14%,rgba(161,174,255,0.14),transparent_48%),linear-gradient(160deg,rgba(255,255,255,0.52),rgba(237,231,252,0.44))] p-5 text-left backdrop-blur-[1px] transition hover:border-[rgba(118,150,211,0.58)] dark:border-[rgba(96,126,186,0.42)] dark:bg-[radial-gradient(circle_at_20%_118%,rgba(248,160,89,0.05),transparent_52%),radial-gradient(circle_at_88%_14%,rgba(86,124,255,0.03),transparent_46%),linear-gradient(160deg,rgba(62,34,111,0.28),rgba(37,30,98,0.24))] sm:p-5"
    >
      <div className="mb-3 flex justify-center sm:mb-4">
        <p className="text-lg font-bold leading-tight text-slate-900 sm:text-[22px] dark:text-[#E8F2FF]">
          {card.value}
        </p>
      </div>
      {isNoPending ? (
        <>
          <p className="mt-3 text-base font-semibold leading-tight text-slate-900 sm:text-[20px] dark:text-white">
            No Pending Requests
          </p>
          <p className="mt-3 text-[13px] leading-tight text-slate-600 dark:text-[#A7B6D3]">
            All requests are processed
          </p>
        </>
      ) : (
        <>
          <p className="whitespace-nowrap text-[14px] font-semibold leading-tight text-slate-900 dark:text-white sm:text-[16px]">
            {card.title}
          </p>
          <div className="mt-3 h-px bg-slate-300/70 dark:bg-[#2B405F]" />
          <p className="mt-3 text-[13px] leading-tight text-slate-600 dark:text-[#A7B6D3]">
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
