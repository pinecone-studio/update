/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

interface FinancePageSkeletonProps {
  statCardCount?: number;
  tableRowCount?: number;
}

export function FinancePageSkeleton({
  statCardCount = 4,
  tableRowCount = 4,
}: FinancePageSkeletonProps) {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80 mt-2" />
      </header>

      {statCardCount > 0 && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: statCardCount }).map((_, i) => (
            <article
              key={i}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-4 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </article>
          ))}
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-slate-200">
              <tr>
                {[1, 2, 3, 4].map((i) => (
                  <th key={i} className="px-6 py-5">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: tableRowCount }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  {[1, 2, 3, 4].map((j) => (
                    <td key={j} className="px-6 py-6">
                      <Skeleton className="h-4 w-24" />
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
