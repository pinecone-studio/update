"use client";

import type { BenefitRequestStatus } from "../../_lib/api";

type FinanceHistoryFiltersProps = {
  searchTerm: string;
  onSearchTermChange: (v: string) => void;
  requestIdFilter: string;
  onRequestIdFilterChange: (v: string) => void;
  benefitFilter: string;
  onBenefitFilterChange: (v: string) => void;
  statusFilter: "ALL" | BenefitRequestStatus;
  onStatusFilterChange: (v: "ALL" | BenefitRequestStatus) => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  benefitOptions: string[];
  onClearAll: () => void;
};

const SelectChevron = () => (
  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8595B6]">
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

export function FinanceHistoryFilters({
  searchTerm,
  onSearchTermChange,
  requestIdFilter,
  onRequestIdFilterChange,
  benefitFilter,
  onBenefitFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  benefitOptions,
  onClearAll,
}: FinanceHistoryFiltersProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-sm font-semibold text-slate-900 dark:text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
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
          className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-[#4B5D83] dark:bg-[#334160] dark:text-[#D4DEEF] dark:hover:bg-[#3A4A6C]"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 md:col-span-2 lg:col-span-1">
          <label className="text-sm font-medium text-slate-900 dark:text-white">
            Search
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8FA3C5]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
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
              className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8595B6] dark:focus:border-[#4B6FA8]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 dark:text-white">
            Benefit Type
          </label>
          <div className="relative">
            <select
              value={benefitFilter}
              onChange={(e) => onBenefitFilterChange(e.target.value)}
              className="h-12 w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50 px-4 pr-12 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
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
          <label className="text-sm font-medium text-slate-900 dark:text-white">
            Status
          </label>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(
                  e.target.value as "ALL" | BenefitRequestStatus,
                )
              }
              className="h-12 w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50 px-4 pr-12 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
            >
              <option value="ALL">All Status</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 dark:text-white">
            Log ID
          </label>
          <input
            type="text"
            value={requestIdFilter}
            onChange={(e) => onRequestIdFilterChange(e.target.value)}
            placeholder="LOG-1001"
            className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8595B6] dark:focus:border-[#4B6FA8]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900 dark:text-white">
            Date Range
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
