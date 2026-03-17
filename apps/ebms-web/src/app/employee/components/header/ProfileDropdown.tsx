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
        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
        aria-label="Profile"
      >
        <ProfileIcon />
      </button>

      {open ? (
        <div className="absolute right-0 top-full mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 dark:bg-[#1A2333] dark:border-[#243041]">
          <div className="p-4 border-b border-slate-200 dark:border-[#243041]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white">
                <ProfileIcon />
              </div>
              <div>
                <p className="text-slate-900 font-semibold dark:text-white">
                  {me?.name ?? "—"}
                </p>
                <p className="text-slate-500 text-xs mt-1 dark:text-slate-500">
                  {me?.id ?? "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              href="/admin"
              onClick={(e) => onAdminNavigate(e)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white ${
                !isAdminOrHrUser ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
              Admin
            </Link>

            <Link
              href="/finance"
              onClick={(e) => onFinanceNavigate(e)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white ${
                !isFinanceManagerUser ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <HiOutlineChartBar className="h-4 w-4" />
              Finance
            </Link>

            <Link
              href="/employee/myprofile"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <HiOutlineUserCircle className="text-lg" />
              Profile
            </Link>

            <div className="my-2 h-px bg-slate-200 dark:bg-[#243041]" />
            <button
              onClick={onClose}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
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
