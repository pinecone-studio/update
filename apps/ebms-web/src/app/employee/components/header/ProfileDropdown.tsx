/** @format */

"use client";

import Link from "next/link";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineChartBar,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { ProfileIcon } from "@/app/icons/profile";
import { HistoryIcon } from "@/app/icons/history";

interface ProfileDropdownProps {
  open: boolean;
  me: { name: string; id: string } | null;
  isAdminOrHrUser: boolean;
  isFinanceManagerUser: boolean;
  onToggle: () => void;
  onClose: () => void;
  onAdminNavigate: (e: { preventDefault: () => void }) => void;
  onFinanceNavigate: (e: { preventDefault: () => void }) => void;
}

export function ProfileDropdown({
  open,
  me,
  isAdminOrHrUser,
  isFinanceManagerUser,
  onToggle,
  onClose,
  onAdminNavigate,
  onFinanceNavigate,
}: ProfileDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[var(--text-secondary)] transition hover:bg-slate-100 hover:text-[var(--text-primary)] dark:border-white/10 dark:text-white dark:hover:bg-white/10"
        aria-label="Profile"
      >
        <ProfileIcon />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/20 dark:bg-[#1e293b] dark:shadow-2xl">
          <div className="border-b border-slate-200 p-4 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-white">
                <ProfileIcon />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {me?.name ?? "—"}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-white/70">
                  {me?.id ?? "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              href="/admin"
              onClick={(e) => onAdminNavigate(e)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition hover:bg-slate-100 dark:text-white dark:hover:bg-white/10 ${
                !isAdminOrHrUser ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
              Admin
            </Link>

            <Link
              href="/finance"
              onClick={(e) => onFinanceNavigate(e)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition hover:bg-slate-100 dark:text-white dark:hover:bg-white/10 ${
                !isFinanceManagerUser ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <HiOutlineChartBar className="h-4 w-4" />
              Finance
            </Link>

            <Link
              href="/employee/history"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
            >
              <HistoryIcon  />
              History
            </Link>

            <div className="my-2 h-px bg-slate-200 dark:bg-white/10" />
            <button
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 transition hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <HiOutlineArrowRightOnRectangle className="text-lg" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
