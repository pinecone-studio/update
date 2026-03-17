/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function AddBenefitSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#334155] dark:bg-[#0F172A]"
        >
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full mt-2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full flex-shrink-0" />
          </div>
          <div className="mt-4 space-y-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-lg mt-4" />
        </div>
      ))}
    </div>
  );
}
