"use client";

import Link from "next/link";
import { useState } from "react";

type FinanceNotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

type FinanceNotificationDropdownProps = {
  open: boolean;
  notifications: FinanceNotificationItem[];
  unreadCount: number;
  onClose: () => void;
  onMarkAllRead?: () => void;
};

function NotificationDot({ item }: { item: FinanceNotificationItem }) {
  const dotClass = item.unread ? "bg-red-500" : "bg-slate-400";
  return (
    <span
      className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotClass}`}
    />
  );
}

export function FinanceNotificationDropdown({
  open,
  notifications,
  unreadCount,
  onClose,
  onMarkAllRead,
}: FinanceNotificationDropdownProps) {
  const [filter, setFilter] = useState<"unread" | "all">("unread");
  const filtered =
    filter === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications;

  if (!open) return null;

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#0E1622] dark:shadow-[0_28px_70px_-40px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`text-xs font-medium transition ${
              filter === "unread"
                ? "text-slate-900 underline underline-offset-2 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white"
            }`}
          >
            Unread
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`text-xs font-medium transition ${
              filter === "all"
                ? "text-slate-900 underline underline-offset-2 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-white/60 dark:hover:text-white"
            }`}
          >
            All
          </button>
        </div>
      </div>
      <div className="max-h-[280px] space-y-2 overflow-y-auto px-3 py-3">
        {filtered.length === 0 ? (
          <p className="px-3 py-4 text-xs text-slate-500 dark:text-white/50">No notifications.</p>
        ) : (
          filtered.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              href="/finance/finance-notification"
              onClick={onClose}
              className="flex w-full gap-3 rounded-xl border border-transparent bg-slate-50 p-3 text-left transition hover:bg-slate-100 dark:border-transparent dark:bg-white/5 dark:hover:border-white/10 dark:hover:bg-white/10"
            >
              <span
                className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                  item.unread ? "bg-red-500" : "bg-slate-400 dark:bg-slate-500"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-white/60">
                  {item.body}
                </p>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-white/40">{item.time}</p>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-3 py-3 dark:border-white/10">
        <Link
          href="/finance/finance-notification"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View all →
        </Link>
        {unreadCount > 0 && onMarkAllRead && (
          <button
            type="button"
            onClick={() => {
              onMarkAllRead();
              onClose();
            }}
            className="text-xs font-medium text-slate-500 transition hover:text-slate-900 dark:text-white/60 dark:hover:text-white"
          >
            Mark all as read
          </button>
        )}
      </div>
    </div>
  );
}
