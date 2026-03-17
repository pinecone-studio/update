/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton - matches mb-8 sm:mb-10 */}
      <div className="mb-8 sm:mb-10">
        <Skeleton className="h-9 w-48 rounded-md sm:h-10 sm:w-56" />
        <Skeleton className="mt-2 h-5 w-80 max-w-md rounded-md sm:mt-3 sm:w-96" />
      </div>

      {/* Stat cards skeleton - matches grid grid-cols-1 gap-4 lg:grid-cols-2 > grid grid-cols-2 gap-2 lg:col-span-1 */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-2 lg:col-span-1">
          {[1, 2].map((i) => (
            <article
              key={i}
              className="min-w-0 h-[128px] rounded-xl border border-slate-200 bg-white p-3 dark:border-[#2C4264] dark:bg-[#1E293B]"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="mt-2 h-6 w-12 rounded-md" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Employee Benefit Requests section skeleton */}
      <article className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 dark:border-[#2C4264] dark:bg-[#1E293B]">
        <div className="mb-4 sm:mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Skeleton className="h-6 w-52 rounded-md" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-200 dark:border-[#2B405F]">
              <tr>
                <th className="px-3 py-3 sm:px-4 sm:py-4">
                  <Skeleton className="h-4 w-28 rounded-md" />
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4">
                  <Skeleton className="h-4 w-20 rounded-md" />
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4">
                  <Skeleton className="h-4 w-16 rounded-md" />
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4">
                  <Skeleton className="h-4 w-16 rounded-md" />
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4">
                  <Skeleton className="h-4 w-14 rounded-md" />
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4">
                  <Skeleton className="h-4 w-14 rounded-md" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr
                  key={i}
                  className="border-b border-slate-200 last:border-b-0 dark:border-[#2B405F]"
                >
                  <td className="px-3 py-3 sm:px-4 sm:py-4">
                    <Skeleton className="h-4 w-36 rounded-md" />
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4">
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4">
                    <Skeleton className="h-6 w-16 rounded-xl" />
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4">
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4">
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20 rounded-lg" />
                      <Skeleton className="h-9 w-20 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
