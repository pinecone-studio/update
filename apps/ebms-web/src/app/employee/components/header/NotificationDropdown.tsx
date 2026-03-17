/** @format */

"use client";

import Link from "next/link";
import {
  HiOutlineBell,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiXMark,
} from "react-icons/hi2";
import type { EmployeeNotification } from "./headerData";

interface NotificationDropdownProps {
  open: boolean;
  unreadCount: number;
  notifications: EmployeeNotification[];
  onToggle: () => void;
  onClose: () => void;
}

export function NotificationDropdown({
  open,
  unreadCount,
  notifications,
  onToggle,
  onClose,
}: NotificationDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="relative h-10 w-10 rounded-full border border-slate-200 grid place-items-center ring-1 ring-transparent hover:bg-slate-200 transition"
        aria-label="Notifications"
      >
        <HiOutlineBell className="text-sm w-5 h-5" />
        {unreadCount > 0 ? (
          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500" />
        ) : null}
      </button>

      {open ? (
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
            {notifications.slice(0, 5).map((n) => {
              const iconClass =
                n.tone === "success"
                  ? "text-emerald-300 bg-emerald-500/15"
                  : n.tone === "info"
                    ? "text-blue-300 bg-blue-500/15"
                    : "text-slate-300 bg-slate-500/15";

              return (
                <button
                  key={n.id}
                  className="flex w-full gap-3 rounded-xl border border-transparent bg-white/5 p-3 text-left transition hover:border-white/10 hover:bg-white/10"
                >
                  <div
                    className={`flex-shrink-0 h-9 w-9 rounded-lg grid place-items-center ${iconClass}`}
                  >
                    {n.tone === "success" ? (
                      <HiOutlineCheckCircle className="text-lg" />
                    ) : n.tone === "info" ? (
                      <HiOutlineChartBar className="text-lg" />
                    ) : (
                      <HiOutlineInformationCircle className="text-lg" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-white/60">{n.body}</p>
                    <p className="mt-2 text-[11px] text-white/40">{n.time}</p>
                  </div>
                  {n.unread ? (
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                  ) : null}
                </button>
              );
            })}
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
      ) : null}
    </div>
  );
}
