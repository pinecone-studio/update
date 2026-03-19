"use client";

import type { AuditEntry } from "../_lib/types";

type AuditLogFiltersProps = {
  searchTerm: string;
  onSearchTermChange: (v: string) => void;
  logIdFilter: string;
  onLogIdFilterChange: (v: string) => void;
  benefitFilter: string;
  onBenefitFilterChange: (v: string) => void;
  statusFilter: "ALL" | AuditEntry["status"];
  onStatusFilterChange: (v: "ALL" | AuditEntry["status"]) => void;
  actionFilter: string;
  onActionFilterChange: (v: string) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  benefitOptions: string[];
  actionOptions: string[];
  onClearAll: () => void;
};

const SelectChevron = () => (
  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/50">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </span>
);

export function AuditLogFilters({
  searchTerm,
  onSearchTermChange,
  logIdFilter,
  onLogIdFilterChange,
  benefitFilter,
  onBenefitFilterChange,
  statusFilter,
  onStatusFilterChange,
  actionFilter,
  onActionFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  benefitOptions,
  actionOptions,
  onClearAll,
}: AuditLogFiltersProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)] dark:border-[rgba(38,38,38,1)] dark:bg-[rgba(13,94,85,0.1)] dark:shadow-none">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-5 font-semibold text-slate-900 dark:text-[var(--text-primary)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" />
          </svg>
          Filters
        </h2>
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-5 text-slate-900 transition hover:bg-slate-200 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label className="text-5 font-medium text-slate-900 dark:text-[var(--text-primary)]">
            Search
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="User, ID, benefit, action, status..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-4 text-l text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50 dark:focus:border-[#2A9BFF]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-5 font-medium text-slate-900 dark:text-[var(--text-primary)]">
            Benefit Type
          </label>
          <div className="relative">
            <select
              value={benefitFilter}
              onChange={(e) => onBenefitFilterChange(e.target.value)}
              className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-l text-slate-900 outline-none focus:border-blue-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-[#2A9BFF]"
            >
              <option value="ALL">All Benefits</option>
              {benefitOptions.map((benefit) => (
                <option key={benefit} value={benefit}>
                  {benefit}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-5 font-medium text-slate-900 dark:text-[var(--text-primary)]">
            Status
          </label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(
                  e.target.value as "ALL" | AuditEntry["status"],
                )
              }
              className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-l text-slate-900 outline-none focus:border-blue-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-[#2A9BFF]"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ELIGIBLE">ELIGIBLE</option>
              <option value="PENDING">PENDING</option>
              <option value="LOCKED">LOCKED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <SelectChevron />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-5 font-medium text-slate-900 dark:text-[var(--text-primary)]">
            Date Range
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-l text-slate-900 outline-none focus:border-blue-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-[#2A9BFF] [color-scheme:dark]"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-l text-slate-900 outline-none focus:border-blue-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-[#2A9BFF] [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-5 font-medium text-slate-900 dark:text-[var(--text-primary)]">
            Action 
          </label>
          <div className="relative">
            <select
              value={actionFilter}
              onChange={(e) => onActionFilterChange(e.target.value)}
              className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-l text-slate-900 outline-none focus:border-blue-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-[#2A9BFF]"
            >
              <option value="ALL">All Actions</option>
              {actionOptions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>
       <div className="space-y-2">
          <label className="text-5 font-medium text-slate-900 dark:text-[var(--text-primary)]">
            Log ID
          </label>
          <input
            type="text"
            value={logIdFilter}
            onChange={(e) => onLogIdFilterChange(e.target.value)}
            placeholder="LOG-1001"
            className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-l text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50 dark:focus:border-[#2A9BFF]"
          />
        </div>
      </div>
    </section>
  );
}
