"use client";

import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi2";

type FinanceHistoryHeaderProps = {
  error?: string | null;
};

export function FinanceHistoryHeader({ error }: FinanceHistoryHeaderProps) {
  return (
    <>
      <Link
        href="/finance"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Finance History
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Баталгаажсан, татгалзсан хүслүүдийн түүх
      </p>
      {error && (
        <p className="mt-2 text-sm text-red-400">Error: {error}</p>
      )}
    </>
  );
}
