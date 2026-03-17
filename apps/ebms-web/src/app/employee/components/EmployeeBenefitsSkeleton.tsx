/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function EmployeeBenefitsSkeleton() {
  return (
    <>
      {/* Category filter pills skeleton */}
      <div className="flex w-full flex-wrap justify-center gap-3 md:gap-6 mt-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      {/* Benefit cards grid - matches BenefitPortfolio layout */}
      <div className="w-full max-w-[1500px] flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full min-w-0 rounded-xl bg-[#1A2536] border border-[#2d3a4d] overflow-hidden"
              >
                <div className="p-5 pt-4 flex flex-col">
                  <div className="flex items-start gap-4 mb-5">
                    <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="w-16 h-6 rounded-full flex-shrink-0" />
                  </div>
                  <div className="space-y-3 mb-5 pb-5 border-b border-[#2d3a4d]">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex justify-between gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
