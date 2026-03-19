"use client";

import Link from "next/link";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { ProfileIcon } from "@/app/icons/profile";

type AdminProfileDropdownProps = {
  open: boolean;
  selectedUser: { name?: string; id: string };
  onClose: () => void;
  onToggle: () => void;
  unclosedFeedbackCount?: number;
};

export function AdminProfileDropdown({
  open,
  selectedUser,
  onClose,
  onToggle,
  unclosedFeedbackCount = 0,
}: AdminProfileDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[var(--text-secondary)] transition hover:bg-slate-100 hover:text-[var(--text-primary)] dark:border-white/10 dark:text-white dark:hover:bg-white/10"
        aria-label="Profile"
      >
        <ProfileIcon />
        {unclosedFeedbackCount > 0 && (
          <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/20 dark:bg-[#1e293b] dark:shadow-2xl">
          <div className="border-b border-slate-200 p-4 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-white">
                <ProfileIcon />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {selectedUser.name || selectedUser.id}
                </p>
                <p className="mt-1 text-4 text-slate-500 dark:text-white/70">
                  {selectedUser.id}
                </p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <Link
              href="/employee"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
              onClick={onClose}
            >
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
              Employee
            </Link>
            <Link
              href="/admin/feedback"
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
              onClick={onClose}
            >
              <span className="flex items-center gap-2">
                <HiOutlineChatBubbleLeftRight className="h-4 w-4" />
                Employee Feedback
              </span>
              {unclosedFeedbackCount > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                  {unclosedFeedbackCount > 9 ? "9+" : unclosedFeedbackCount}
                </span>
              )}
            </Link>
            <div className="my-2 h-px bg-slate-200 dark:bg-white/10" />
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
