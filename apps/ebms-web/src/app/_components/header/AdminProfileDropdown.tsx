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
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-white"
        aria-label="Profile"
      >
        <ProfileIcon />
        {unclosedFeedbackCount > 0 && (
          <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-xl border border-white/10 bg-[#0E1622] shadow-[0_28px_70px_-40px_rgba(0,0,0,0.85)]"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-white">
                <ProfileIcon />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {selectedUser.name || selectedUser.id}
                </p>
                <p className="mt-1 text-xs text-white/50">{selectedUser.id}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <Link
              href="/employee"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-white/5 hover:text-white"
              onClick={onClose}
            >
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
              Employee
            </Link>
            <Link
              href="/admin/feedback"
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-white/5 hover:text-white"
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
            <div className="my-2 h-px bg-white/10" />
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
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
