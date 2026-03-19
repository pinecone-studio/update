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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          History
        </h1>
        <p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
          Track and investigate all system actions in one place
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-400">Error: {error}</p>
        )}
      </div>
    </div>
  );
}
