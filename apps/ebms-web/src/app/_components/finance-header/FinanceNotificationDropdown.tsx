"use client";

import Link from "next/link";
import { HiOutlineXMark } from "react-icons/hi2";
import { FINANCE_NOTIFICATIONS } from "./constants";

type FinanceNotificationDropdownProps = {
  open: boolean;
  unreadCount: number;
  onClose: () => void;
};

export function FinanceNotificationDropdown({
  open,
  unreadCount,
  onClose,
}: FinanceNotificationDropdownProps) {
  const notifications = FINANCE_NOTIFICATIONS;
  if (!open) return null;

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#0E1622] shadow-[0_28px_70px_-40px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Notifications</p>
          <p className="text-xs text-white/60">{unreadCount} unread</p>
        </div>
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-white/20 hover:text-white"
        >
          <HiOutlineXMark className="text-base" />
        </button>
      </div>
      <div className="max-h-[280px] space-y-2 overflow-y-auto px-3 py-3">
        {notifications.slice(0, 5).map((item) => (
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
        ))}
      </div>
      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/finance/finance-notification"
          onClick={onClose}
          className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center text-xs font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}
