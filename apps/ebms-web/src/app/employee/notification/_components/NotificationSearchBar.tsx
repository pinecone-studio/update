"use client";

import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

type NotificationSearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onMarkAllAsRead: () => void;
};

export function NotificationSearchBar({
  search,
  onSearchChange,
  onMarkAllAsRead,
}: NotificationSearchBarProps) {
  return (
    <section className="rounded-2xl border border-slate-200 p-3 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      <div className="flex flex-wrap items-center gap-3">
        <HiOutlineMagnifyingGlass className="text-slate-500 dark:text-white/50" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none dark:text-white dark:placeholder:text-white/40 sm:min-w-[180px]"
          placeholder="Search notifications..."
        />
        <button
          onClick={onMarkAllAsRead}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/10"
        >
            Mark All as Read
          </button>
      </div>
    </section>
  );
}
