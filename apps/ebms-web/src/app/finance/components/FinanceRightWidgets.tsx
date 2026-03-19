"use client";

import React from "react";
import Link from "next/link";
import { formatRelativeTime } from "../_lib/utils";
import type { BenefitRequest } from "../_lib/api";

type FinanceRightWidgetsProps = {
  requests: BenefitRequest[];
};

export function FinanceRightWidgets({ requests }: FinanceRightWidgetsProps) {
  const recentActivity = React.useMemo(
    () =>
      [...requests]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 2),
    [requests],
  );

  const getActivityText = (request: BenefitRequest) => {
    const employee = request.employeeName || request.employeeId;
    const benefit = request.benefitName || request.benefitId;
    const status = (request.status || "PENDING").toUpperCase();

    if (status === "APPROVED") return `${employee} approved ${benefit}`;
    if (status === "REJECTED") return `${employee} rejected ${benefit}`;
    return `${employee} requested ${benefit} — Pending`;
  };

  const getActivityTone = (request: BenefitRequest) => {
    const status = (request.status || "PENDING").toUpperCase();
    if (status === "APPROVED") return "bg-emerald-600";
    if (status === "REJECTED") return "bg-red-600";
    return "bg-violet-600";
  };

  const getActivityIcon = (request: BenefitRequest) => {
    const status = (request.status || "PENDING").toUpperCase();
    if (status === "APPROVED") return "✓";
    if (status === "REJECTED") return "✕";
    return "▣";
  };

  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-hidden">
      <div className="flex-1 rounded-3xl border border-[rgba(149,137,199,0.42)] bg-[radial-gradient(circle_at_90%_10%,rgba(162,174,255,0.12),transparent_52%),linear-gradient(160deg,rgba(255,255,255,0.52),rgba(237,231,252,0.46))] p-4 backdrop-blur-[1px] dark:border-[rgba(63,91,138,0.44)] dark:bg-[radial-gradient(circle_at_90%_10%,rgba(76,114,255,0.05),transparent_48%),linear-gradient(160deg,rgba(28,29,82,0.28),rgba(22,37,79,0.24))] sm:p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 sm:text-base dark:text-white">Recent Activity</h3>
          <Link
            href="/finance/history"
            className="text-5 text-slate-600 hover:text-slate-900 dark:text-[#A7B6D3] dark:hover:text-white"
          >
            View All ›
          </Link>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-[#8FA3C5]">No recent activity.</p>
          ) : (
            recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 ${
                  index < recentActivity.length - 1
                    ? "border-b border-slate-300/70 pb-3 dark:border-[#2B405F]"
                    : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${getActivityTone(
                    activity,
                  )}`}
                >
                  {getActivityIcon(activity)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-[#8FA3C5]">
                    {formatRelativeTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

export default FinanceRightWidgets;
