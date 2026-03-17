/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

interface ProfileSkeletonProps {
  variant?: "admin" | "employee";
}

export function ProfileSkeleton({
  variant = "employee",
}: ProfileSkeletonProps) {
  const isAdmin = variant === "admin";
  const maxWidthClass = isAdmin ? "max-w-[921px]" : "max-w-[1500px]";
  const tabBorderClass = isAdmin
    ? "border-slate-700/60"
    : "border-slate-200 dark:border-slate-700/60";
  const sectionClass = isAdmin
    ? "bg-white border border-slate-200 rounded-xl p-6 dark:bg-[#1A2333] dark:border-[#243041]"
    : "bg-white border border-slate-200 rounded-xl p-6 dark:bg-[#1A2333] dark:border-[#243041]";

  return (
    <div className={`${maxWidthClass} mx-auto`}>
      <div className="mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-80 mt-2" />
      </div>

      {/* Profile summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
        <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 mt-8 border-b ${tabBorderClass}`}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-36 mt-1" />
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6 space-y-6">
        <section className={sectionClass}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-56 mt-1" />
            </div>
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <div>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-28 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
