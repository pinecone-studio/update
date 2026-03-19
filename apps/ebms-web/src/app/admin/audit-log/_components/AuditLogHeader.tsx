"use client";

import { useEffect, useRef, useState } from "react";

export function AuditLogHeader() {
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
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl lg:text-[28px] dark:text-white">
          System Audit Log
        </h1>
        <p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
          Searchable audit trail for all system actions
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <button
          type="button"
          onClick={() => {
            setExporting(true);
            setExportNotice("Export started. Preparing file...");
            if (timerRef.current) window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(
              () => {
                setExportNotice(null);
                setExporting(false);
              },
              2400,
            );
          }}
          disabled={exporting}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#2F66E8] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3E82F7] disabled:opacity-70 sm:gap-3 sm:px-6 sm:py-3 sm:text-base"
        >
          {exporting ? (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 animate-spin"
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
                className="h-6 w-6"
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
