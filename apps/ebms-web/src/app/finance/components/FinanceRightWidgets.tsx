"use client";

import React from "react";

export function FinanceRightWidgets() {
  return (
    <aside className="flex w-full flex-col gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#2C4264] dark:bg-[#0F1724]">
        <h3 className="text-5 font-semibold text-slate-900 dark:text-white">
          Recent Activity
        </h3>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              ✓
            </div>
            <div className="flex-1">
              <p className="text-5 font-medium text-slate-900 dark:text-white">
                Bat approved Gym benefit — ₹200K
              </p>
              <p className="text-4 text-slate-500 dark:text-[#8FA3C5]">1 day ago</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-violet-600 text-white flex items-center justify-center">
              ↗
            </div>
            <div className="flex-1">
              <p className="text-5 font-medium text-slate-900 dark:text-white">
                Sara requested Laptop — Pending
              </p>
              <p className="text-4 text-slate-500 dark:text-[#8FA3C5]">2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#2C4264] dark:bg-[#0F1724]">
        <h3 className="text-5 font-semibold text-slate-900 dark:text-white">
          Budget Usage Trend
        </h3>
        <div className="mt-3 flex flex-col gap-3">
          <div className="h-36 w-full rounded-lg bg-gradient-to-b from-slate-100 to-slate-50 dark:from-[#12202D] dark:to-[#0B1722]">
            {/* placeholder for chart */}
            <div className="flex h-full items-end justify-around px-4 py-3">
              <div className="h-2/3 w-6 rounded bg-blue-500/80"></div>
              <div className="h-1/2 w-6 rounded bg-blue-500/60"></div>
              <div className="h-3/4 w-6 rounded bg-blue-500/70"></div>
              <div className="h-5/6 w-6 rounded bg-blue-400/90"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default FinanceRightWidgets;
