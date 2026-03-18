/** @format */

"use client";

import Link from "next/link";
import {
  HiOutlineArrowPath,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBell,
} from "react-icons/hi2";
import type { SwitchUserOption } from "@/app/_lib/activeUser";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/finance", icon: <HiOutlineArrowPath className="h-5 w-5" /> },
];

interface FinanceMobileHeaderMenuProps {
  open: boolean;
  pathname: string;
  selectedUserId: string;
  userOptions: SwitchUserOption[];
  initials: string;
  unreadNotificationCount?: number;
  onClose: () => void;
  onSelectUser: (id: string) => void;
}

export function FinanceMobileHeaderMenu({
  open,
  pathname,
  selectedUserId,
  userOptions,
  initials,
  unreadNotificationCount = 0,
  onClose,
  onSelectUser,
}: FinanceMobileHeaderMenuProps) {
  if (!open) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== "/finance" && pathname.startsWith(href));

  return (
    <div className="md:hidden absolute left-0 top-[72px] w-full bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <nav className="flex flex-col gap-1 p-3 text-slate-600 dark:text-slate-300 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ring-1 ring-transparent transition ${
              isActive(item.href)
                ? "bg-blue-600 text-white dark:bg-[#2F66E8]"
                : "text-slate-600 hover:ring-blue-300 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:ring-blue-300 dark:hover:text-white dark:hover:bg-slate-800"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

        <Link
          href="/employee"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 ring-1 ring-transparent hover:ring-blue-300 hover:text-slate-900 hover:bg-slate-100 transition dark:text-slate-300 dark:hover:ring-blue-300 dark:hover:text-white dark:hover:bg-slate-800"
        >
          <HiOutlineArrowTopRightOnSquare className="text-base" />
          Employee руу шилжих
        </Link>

        <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

        <label className="inline-flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 dark:border-[#334155] dark:text-[#A7B6D3]">
          <span>User</span>
          <select
            value={selectedUserId}
            onChange={(e) => onSelectUser(e.target.value)}
            className="ml-3 bg-transparent text-xs text-slate-700 outline-none dark:text-[#D1DBEF]"
            aria-label="Select active user"
          >
            {userOptions.map((opt) => (
              <option key={opt.id} value={opt.id} className="text-slate-900">
                {opt.name} ({opt.id})
              </option>
            ))}
          </select>
        </label>

        <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

        <div className="flex items-center gap-2">
          <Link
            href="/finance/finance-notification"
            onClick={onClose}
            className="relative h-8 w-8 rounded-full bg-slate-100 text-slate-600 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Notifications"
          >
            <HiOutlineBell className="text-sm" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-[0_0_0_2px_rgba(10,18,27,0.95)] animate-pulse">
                {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
              </span>
            )}
          </Link>
          <Link
            href="/finance/profile"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center">
              {initials}
            </div>
            <span className="text-slate-600 text-xs dark:text-slate-300">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
