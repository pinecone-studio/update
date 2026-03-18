/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function AddBenefitSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex h-[267px] flex-col rounded-xl border-t border-white/40 bg-[#1A2037] p-4 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]"
        >
          <div className="flex flex-1 min-h-0 flex-col gap-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
            <div className="mt-3 flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-14 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
              <div>
                <Skeleton className="h-3 w-12 rounded" />
                <Skeleton className="mt-1 h-px w-full rounded" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-5">
              <Skeleton className="h-11 flex-1 max-w-[180px] rounded-xl" />
              <Skeleton className="h-11 flex-1 max-w-[180px] rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
