"use client";

import Link from "next/link";
import {
  HiOutlineCheckCircle,
  HiOutlineChartBar,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiXMark,
} from "react-icons/hi2";

export type HeaderNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: "success" | "info" | "warning";
  unread: boolean;
};

type NotificationDropdownProps = {
  open: boolean;
  notifications: HeaderNotification[];
  unreadCount: number;
  onClose: () => void;
};

export function NotificationDropdown({
  open,
  notifications,
  unreadCount,
  onClose,
}: NotificationDropdownProps) {
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
          <HiXMark className="text-base" />
        </button>
      </div>
      <div className="max-h-[280px] space-y-2 overflow-y-auto px-3 py-3">
        {notifications.length === 0 ? (
          <p className="py-4 text-center text-xs text-white/50">
            No notifications
          </p>
        ) : (
          notifications.slice(0, 5).map((n) => {
            const iconClass =
              n.tone === "success"
                ? "text-emerald-300 bg-emerald-500/15"
                : n.tone === "warning"
                  ? "text-amber-300 bg-amber-500/15"
                  : n.tone === "info"
                    ? "text-blue-300 bg-blue-500/15"
                    : "text-slate-300 bg-slate-500/15";
            return (
              <Link
                key={n.id}
                href="/employee/notification"
                onClick={onClose}
                className="flex w-full gap-3 rounded-xl border border-transparent bg-white/5 p-3 text-left transition hover:border-white/10 hover:bg-white/10"
              >
                <div
                  className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg ${iconClass}`}
                >
                  {n.tone === "success" ? (
                    <HiOutlineCheckCircle className="text-lg" />
                  ) : n.tone === "warning" ? (
                    <HiOutlineExclamationTriangle className="text-lg" />
                  ) : n.tone === "info" ? (
                    <HiOutlineChartBar className="text-lg" />
                  ) : (
                    <HiOutlineInformationCircle className="text-lg" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{n.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-white/60">
                    {n.body}
                  </p>
                  <p className="mt-2 text-[11px] text-white/40">{n.time}</p>
                </div>
                {n.unread && (
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                )}
              </Link>
            );
          })
        )}
      </div>
      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/employee/notification"
          onClick={onClose}
          className="block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center text-xs font-semibold text-white/80 transition hover:border-white/20 hover:text-white"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}
