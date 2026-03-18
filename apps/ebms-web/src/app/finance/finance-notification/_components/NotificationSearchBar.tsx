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
    <section className="rounded-2xl border border-slate-200 p-3 shadow-sm dark:border-white/20">
      <div className="flex flex-wrap items-center gap-3">
        <HiOutlineMagnifyingGlass className="text-slate-500 dark:text-white" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-w-[180px] flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
          placeholder="Search notifications..."
        />
        <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10">
          Mark All as Read
        </button>
      </div>
    </section>
  );
}
