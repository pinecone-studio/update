"use client";

import Link from "next/link";
import {
  HiOutlineBell,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineArrowTopRightOnSquare,
  HiXMark,
} from "react-icons/hi2";
import type { AdminNotification } from "./admin-header-constants";

type AdminNotificationDropdownProps = {
  open: boolean;
  notifications: AdminNotification[];
  unreadCount: number;
  onClose: () => void;
  onMarkAllRead: () => void;
};

export function AdminNotificationDropdown({
  open,
  notifications,
  unreadCount,
  onClose,
  onMarkAllRead,
}: AdminNotificationDropdownProps) {
  if (!open) return null;

  return (
    <div className="absolute right-0 top-full z-50 mt-2 flex max-h-[420px] w-[380px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#24395C] dark:bg-[#1A2333]">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-[#24395C]">
        <div className="flex items-center gap-2">
          <HiOutlineBell className="text-base text-slate-600 dark:text-[#D1DBEF]" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-500/80 px-2 py-0.5 text-xs font-medium text-white">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#9FB0D4] dark:hover:bg-[#24364F] dark:hover:text-white"
        >
          <HiXMark className="text-lg" />
        </button>
      </div>
      <Link
        href="/admin/admin-notification"
        className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        onClick={() => {
          onMarkAllRead();
          onClose();
        }}
      >
        Mark all as read
      </Link>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {notifications.map((n) => {
          const iconClass =
            n.tone === "success"
              ? "text-green-400 bg-green-500/20"
              : n.tone === "info"
                ? "text-blue-400 bg-blue-500/20"
                : "text-slate-400 bg-slate-500/20";
          return (
            <div
              key={n.id}
              className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-slate-300 dark:border-[#24395C] dark:bg-[#1f2a40] dark:hover:border-slate-600"
            >
              <div
                className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg ${iconClass}`}
              >
                {n.tone === "success" ? (
                  <HiOutlineCheckCircle className="text-lg" />
                ) : n.tone === "info" ? (
                  <HiOutlineChartBar className="text-lg" />
                ) : (
                  <HiOutlineInformationCircle className="text-lg" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {n.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                  {n.body}
                </p>
                <Link
                  href="/admin/admin-notification"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={onClose}
                >
                  View Details
                  <HiOutlineArrowTopRightOnSquare className="text-xs" />
                </Link>
                <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  {n.time}
                </p>
              </div>
              {n.unread && (
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
              )}
            </div>
          );
        })}
      </div>
      <div className="border-t border-slate-200 p-3 dark:border-[#24395C]">
        <Link
          href="/admin/admin-notification"
          onClick={onClose}
          className="block w-full rounded-lg bg-slate-800 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-[#2F66E8] dark:hover:bg-[#2A5ED4]"
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );
}
