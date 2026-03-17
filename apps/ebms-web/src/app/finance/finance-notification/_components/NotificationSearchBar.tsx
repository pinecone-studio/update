"use client";

import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

type NotificationSearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function NotificationSearchBar({
  search,
  onSearchChange,
}: NotificationSearchBarProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-[#243041] dark:bg-[#1A2333]">
      <div className="flex flex-wrap items-center gap-3">
        <HiOutlineMagnifyingGlass className="text-slate-500 dark:text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-w-[180px] flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
          placeholder="Search notifications..."
        />
        <button className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-[#243041] dark:bg-[#111A2A] dark:text-slate-200 dark:hover:bg-[#1A2333]">
          Mark All as Read
        </button>
      </div>
    </section>
  );
}
