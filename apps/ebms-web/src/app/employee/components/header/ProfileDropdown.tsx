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
        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white border border-white/10"
        aria-label="Profile"
      >
        <ProfileIcon />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-xl border border-white/10 bg-[#0E1622] shadow-[0_28px_70px_-40px_rgba(0,0,0,0.85)] dark:border-white/10"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-white">
                <ProfileIcon />
              </div>
              <div>
                <p className="font-semibold text-white">{me?.name ?? "—"}</p>
                <p className="mt-1 text-xs text-white/50">{me?.id ?? "—"}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              href="/admin"
              onClick={(e) => onAdminNavigate(e)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-white/90 transition hover:bg-white/5 hover:text-white ${
                !isAdminOrHrUser ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
              Admin
            </Link>

            <Link
              href="/finance"
              onClick={(e) => onFinanceNavigate(e)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-white/90 transition hover:bg-white/5 hover:text-white ${
                !isFinanceManagerUser ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <HiOutlineChartBar className="h-4 w-4" />
              Finance
            </Link>

            <Link
              href="/employee/history"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/90 transition hover:bg-white/5 hover:text-white"
            >
              <HistoryIcon />
              History
            </Link>

            <div className="my-2 h-px bg-white/10" />
            <button
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-400 transition hover:bg-red-500/10"
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
