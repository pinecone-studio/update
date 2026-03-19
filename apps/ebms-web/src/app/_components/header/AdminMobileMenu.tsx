"use client";

import Link from "next/link";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBell,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { navItems } from "./admin-header-constants";
import type { AdminNotification } from "./admin-header-constants";
import type { SwitchUserOption } from "@/app/_lib/activeUser";

type AdminMobileMenuProps = {
  open: boolean;
  pathname: string;
  selectedUser: { id: string };
  userOptions: SwitchUserOption[];
  notifications: AdminNotification[];
  unreadCount: number;
  unclosedFeedbackCount?: number;
  notificationOpen: boolean;
  onClose: () => void;
  onSelectUser: (id: string) => void;
  onNotificationToggle: () => void;
};

export function AdminMobileMenu({
  open,
  pathname,
  selectedUser,
  userOptions,
  notifications,
  unreadCount,
  unclosedFeedbackCount = 0,
  notificationOpen,
  onClose,
  onSelectUser,
  onNotificationToggle,
}: AdminMobileMenuProps) {
  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/admin" && pathname.startsWith(href));

  if (!open) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-50 w-full border-t border-slate-200 bg-white shadow-lg md:hidden">
      <nav className="flex flex-col gap-1 p-3 text-sm text-slate-600">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 transition ${
              isActive(item.href)
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-100 hover:text-black"
            }`}
          >
            <span className="scale-90">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <div className="my-2 h-px bg-slate-200" />
        <Link
          href="/employee"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 transition hover:bg-slate-100 hover:text-black"
        >
          <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
          Employee руу шилжих
        </Link>
        <Link
          href="/admin/feedback"
          onClick={onClose}
          className="inline-flex items-center justify-between gap-2 rounded-lg px-4 py-2 transition hover:bg-slate-100 hover:text-black"
        >
          <span className="inline-flex items-center gap-2">
            <HiOutlineChatBubbleLeftRight className="h-4 w-4" />
            Employee Feedback
          </span>
          {unclosedFeedbackCount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
              {unclosedFeedbackCount > 9 ? "9+" : unclosedFeedbackCount}
            </span>
          )}
        </Link>
        <div className="my-2 h-px bg-slate-200" />
        <label className="inline-flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600">
          <span>User</span>
          <select
            value={selectedUser.id}
            onChange={(e) => onSelectUser(e.target.value)}
            className="ml-3 bg-transparent text-xs text-black outline-none"
            aria-label="Select active test user"
          >
            {userOptions.map((opt) => (
              <option key={opt.id} value={opt.id} className="text-black">
                {opt.name} ({opt.id})
              </option>
            ))}
          </select>
        </label>
        <div className="my-2 h-px bg-slate-200" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNotificationToggle}
              className="relative grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-transparent transition hover:ring-blue-300 hover:bg-slate-200"
              aria-label="Notifications"
            >
              <HiOutlineBell className="text-sm" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-[0_0_0_2px_rgba(10,18,27,0.95)] animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            <Link
              href="/admin/profile"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                AD
              </div>
              <span className="text-xs text-slate-600">
                Account
              </span>
            </Link>
          </div>
          {notificationOpen && (
            <div className="max-h-[300px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold text-black">
                Notifications
              </p>
              <p className="mt-2 text-xs text-slate-600">
                {notifications.length === 0
                  ? "No notifications."
                  : `${unreadCount} unread`}
              </p>
              <Link
                href="/admin/admin-notification"
                onClick={onClose}
                className="mt-2 block text-xs text-blue-600"
              >
                View all →
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
