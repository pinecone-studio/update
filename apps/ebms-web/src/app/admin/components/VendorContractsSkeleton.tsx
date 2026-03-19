/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function VendorContractsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards - matches VendorContractStatsCards / ContractStatsCards */}
      <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <article
            key={i}
            className="h-[107px] min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-[rgba(38,38,38,1)] dark:bg-[rgba(13,94,85,0.1)]"
          >
            <div className="mb-2 flex items-start justify-between">
              <Skeleton className="h-5 w-28 rounded bg-slate-200 dark:bg-white/10" />
              <Skeleton className="h-3 w-3 shrink-0 rounded-full bg-slate-200 dark:bg-white/10" />
            </div>
            <Skeleton className="h-9 w-12 rounded bg-slate-200 dark:bg-white/10" />
          </article>
        ))}
      </section>

      {/* Table section - matches VendorContractTableSection / ContractTableSection */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)] dark:border-[rgba(38,38,38,1)] dark:bg-[rgba(13,94,85,0.1)] dark:shadow-none">
        <div className="flex flex-col gap-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative min-w-0 flex-1">
              <Skeleton className="h-11 w-[368px] rounded-lg bg-slate-200 dark:bg-white/10" />
            </div>
            <Skeleton className="h-11 min-w-[170px] rounded-xl bg-slate-200 dark:bg-white/10" />
          </div>

          <table className="min-w-full">
            <thead>
              <tr>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className="px-5 py-4 text-left">
                    <Skeleton className="h-4 w-20 rounded bg-slate-200 dark:bg-white/10" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <td key={j} className="px-5 py-5">
                      <Skeleton className="h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
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
