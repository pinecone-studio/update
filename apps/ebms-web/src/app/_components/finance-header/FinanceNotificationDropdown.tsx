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
    <div className="absolute right-0 top-full z-50 mt-3 w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#0E1622] shadow-[0_28px_70px_-40px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold text-white">Notifications</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`text-xs font-medium transition ${
              filter === "unread"
                ? "text-white underline underline-offset-2"
                : "text-white/60 hover:text-white"
            }`}
          >
            Unread
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`text-xs font-medium transition ${
              filter === "all"
                ? "text-white underline underline-offset-2"
                : "text-white/60 hover:text-white"
            }`}
          >
            All
          </button>
        </div>
      </div>
      <div className="max-h-[280px] space-y-2 overflow-y-auto px-3 py-3">
        {filtered.length === 0 ? (
          <p className="px-3 py-4 text-xs text-white/50">No notifications.</p>
        ) : (
          filtered.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              href="/finance/finance-notification"
              onClick={onClose}
            className="flex w-full gap-3 rounded-xl border border-transparent bg-white/5 p-3 text-left transition hover:border-white/10 hover:bg-white/10"
          >
            <span
              className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                item.unread ? "bg-red-500" : "bg-slate-300"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-white/60">
                {item.body}
              </p>
              <p className="mt-2 text-[11px] text-white/40">{item.time}</p>
            </div>
          </Link>
          ))
        )}
      </div>
      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/finance/finance-notification"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 transition hover:text-blue-300"
        >
          View all →
        </Link>
      </div>
    </div>
  );
}
