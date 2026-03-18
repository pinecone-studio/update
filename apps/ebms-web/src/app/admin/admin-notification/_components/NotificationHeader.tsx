"use client";

import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi2";

export function NotificationHeader() {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white mb-4"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
          Admin Notifications
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Monitor employee benefit activity and system events
        </p>
      </div>
    </header>
  );
}
