/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden">
      <section className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_1fr] gap-8 px-6 py-6 overflow-hidden lg:grid-cols-[auto_1fr] lg:grid-rows-1">
        {/* Stat cards skeleton - matches DashboardStatCard (320px h, 454px w) */}
        <div className="flex flex-col gap-8 lg:min-w-[454px]">
          {[1, 2].map((i) => (
            <article
              key={i}
              className="flex h-[320px] w-full max-w-[454px] flex-col rounded-2xl px-[54px] py-[48px] shadow-lg ring-1 ring-white/10"
            >
              <div className="flex flex-1 flex-col justify-between gap-6">
                <div className="flex items-center gap-10">
                  <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
                  <Skeleton className="h-6 w-32 rounded-md" />
                </div>
                <div className="flex items-center justify-between gap-10">
                  <Skeleton className="h-10 w-24 rounded-lg" />
                  <Skeleton className="h-[154px] w-24 rounded-md" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* BenefitRequestsSection skeleton */}
        <article className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-[rgba(38, 38, 38, 1)] bg-[rgba(13, 94, 85, 0.1)] dark:border-[#262626] sm:p-6">
          <div className="mb-4 flex shrink-0 flex-col gap-3 px-6 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <Skeleton className="h-7 w-56 rounded-md" />
            <div className="w-auto overflow-hidden rounded-2xl border border-white/30">
              <div className="flex h-[49px] w-[472px] gap-1.5 p-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-full flex-1 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 divide-y divide-white/30 px-8 pb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-36 rounded-md" />
                      <Skeleton className="h-3 w-24 rounded-md" />
                      <Skeleton className="h-3 w-48 rounded-md" />
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Skeleton className="h-[38px] w-[94px] rounded-lg" />
                  <Skeleton className="h-[38px] w-[94px] rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
