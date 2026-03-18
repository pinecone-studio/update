/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function EmployeeEligibilitySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header - matches EmployeeEligibilityHeader */}
      <div>
        <Skeleton className="h-[35px] w-80 rounded-md" />
        <Skeleton className="mt-3 h-5 w-96 max-w-md rounded-md" />
      </div>

      {/* Search bar - matches EmployeeSearchInput */}
      <section className="rounded-2xl bg-white p-6 dark:border-[#2C4264] dark:bg-[#20194D80]/50">
        <div className="relative">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </section>

      {/* Employee list - matches EmployeeListSection */}
      <section className="flex h-[450px] flex-col overflow-hidden rounded-3xl dark:bg-[#20194D80]/50">
        <div className="grid grid-cols-[40px_1fr_1fr_auto] items-center gap-4 border-b border-white/10 px-6 py-4 dark:border-[#2C4264] dark:bg-[#60587B4D]">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
        <div className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-6 pb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="-mx-6 grid grid-cols-[40px_1fr_1fr_auto] items-center gap-4 border-b border-white/5 px-6 py-3 last:border-b-0 dark:border-[#2C4264]/50"
            >
              <Skeleton className="h-4 w-4 rounded" />
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-9 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
