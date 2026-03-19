/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

interface AuditLogSkeletonProps {
  /** Number of table rows to show (matches AuditLogTable) */
  rowCount?: number;
}

export function AuditLogSkeleton({ rowCount = 3 }: AuditLogSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header - matches AuditLogHeader */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="mt-3 h-4 w-80 rounded" />
        </div>
        <Skeleton className="h-12 w-36 rounded-2xl" />
      </div>

      {/* Filters - matches AuditLogFilters */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
        <div className="mb-5 flex items-center justify-between">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </section>

      {/* Table - matches AuditLogTable */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-[#2C4264] dark:bg-[#112349]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-200 dark:border-[#2B405F]">
              <tr>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <th key={i} className="px-4 py-4 sm:px-6">
                    <Skeleton className="h-4 w-16 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }, (_, i) => i + 1).map((i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 last:border-b-0 dark:border-[#22395A]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (
                    <td key={j} className="px-4 py-5 sm:px-6">
                      <Skeleton className="h-4 w-20 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
