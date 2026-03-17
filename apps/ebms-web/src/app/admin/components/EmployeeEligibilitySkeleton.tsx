/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function EmployeeEligibilitySkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96 mt-3" />
      </div>

      {/* Search bar section */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
        <div className="relative">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </section>

      {/* Employee list section */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-[#324A70] dark:bg-[#0F172A]"
            >
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
