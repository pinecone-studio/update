"use client";

import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";

type FinanceHistoryHeaderProps = {
  error?: string | null;
};

export function FinanceHistoryHeader({ error }: FinanceHistoryHeaderProps) {
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
      <div className="min-w-0">
        <Link
          href="/finance"
          className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          History
        </h1>
        <p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
          Approved and rejected benefit requests
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-400">Error: {error}</p>
        )}
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <button
          type="button"
          onClick={() => {
            setExporting(true);
            setExportNotice("Export started. Preparing file...");
            if (timerRef.current) window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
              setExportNotice(null);
              setExporting(false);
            }, 2400);
          }}
          disabled={exporting}
          className="flex items-center gap-3 rounded-2xl bg-[#2F66E8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3E82F7] disabled:opacity-70"
        >
          {exporting ? (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 animate-spin"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                />
                <path d="M21 12a9 9 0 0 1-9 9" />
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
              </svg>
              Export Logs
            </>
          )}
        </button>
        {exportNotice ? (
          <div className="rounded-full border border-[#2B3B55] bg-[#111A2A] px-3 py-1 text-[12px] font-medium text-slate-200 shadow-sm">
            {exportNotice}
          </div>
        ) : null}
      </div>
    </div>
  );
}
