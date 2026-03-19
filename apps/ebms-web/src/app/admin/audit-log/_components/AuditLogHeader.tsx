"use client";

export function AuditLogHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-5 font-semibold text-slate-900 dark:text-[var(--text-primary)]">
          System Audit Log
        </h1>
        <p className="mt-3 text-5 text-slate-600 dark:text-[var(--text-secondary)]">
          Searchable audit trail for all system actions
        </p>
      </div>

      <button
        type="button"
        className="flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-3 text-5 font-medium text-white transition hover:bg-blue-700 dark:bg-[#2F66E8] dark:hover:bg-[#3E82F7]"
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
