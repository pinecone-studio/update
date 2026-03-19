/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

interface NotificationSkeletonProps {
  /** Number of stat cards (3 for employee, 4 for admin/finance) */
  statCardCount?: number;
}

export function NotificationSkeleton({
  statCardCount = 3,
}: NotificationSkeletonProps) {
  const statGridClass =
    statCardCount === 4
      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
      : "grid-cols-1 md:grid-cols-3";

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 sm:gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-40 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
      </div>

      <section className={`grid gap-4 ${statGridClass}`}>
        {Array.from({ length: statCardCount }, (_, i) => i + 1).map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 shadow-sm dark:border-white/20"
          >
            <div>
              <Skeleton className="h-3 w-16 rounded-md" />
              <Skeleton className="mt-2 h-6 w-8 rounded-md" />
            </div>
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3 md:gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-[#2d3a4d] dark:bg-[#1E293B]">
        <Skeleton className="h-5 w-5 shrink-0 rounded" />
        <Skeleton className="h-4 flex-1 rounded-md" />
        <Skeleton className="h-8 w-28 shrink-0 rounded-full" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-[#2d3a4d] dark:bg-[#1E293B]"
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-4 w-24 shrink-0 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
