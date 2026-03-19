"use client";

import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi2";

type FinanceHistoryHeaderProps = {
  error?: string | null;
};

export function FinanceHistoryHeader({ error }: FinanceHistoryHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link
          href="/finance"
          className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-[28px] font-semibold text-slate-900 dark:text-white">
          System Activity Logs
        </h1>
        <p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
          Track and investigate all system actions in one place
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-400">Error: {error}</p>
        )}
      </div>

      <button
        type="button"
        className="inline-flex h-11 min-w-[170px] flex-[0_0_auto] items-center justify-center gap-2 rounded-xl bg-[#0057ADCC]/80 px-4 text-[18px] font-medium text-white transition hover:bg-[#3E82F7]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
        </svg>
        Export Logs
      </button>
    </div>
  );
}
