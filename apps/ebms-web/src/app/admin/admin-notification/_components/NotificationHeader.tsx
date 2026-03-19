"use client";

import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi2";

export function NotificationHeader() {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link
          href="/admin"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
          Admin Notifications
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-white/70">
          Monitor employee benefit activity and system events
        </p>
      </div>
    </header>
  );
}
