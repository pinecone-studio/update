"use client";

import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi2";

export function NotificationHeader() {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link
          href="/employee"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Notifications
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
          Stay updated on your benefits and eligibility
        </p>
      </div>
    </header>
  );
}
