/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function AddBenefitsBuilderSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-[#16142a]">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
      <Skeleton className="h-4 w-64 mt-3" />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-[#1e1a35]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
