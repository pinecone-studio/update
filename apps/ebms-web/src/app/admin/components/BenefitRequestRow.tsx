"use client";

import { formatRelativeTime, getInitials } from "../_lib/utils";
import type { BenefitRequest } from "../_lib/dashboard-types";

type BenefitRequestRowProps = {
  request: BenefitRequest;
  affiliation: string;
  actionLoadingId: string | null;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
};

export function BenefitRequestRow({
  request,
  affiliation,
  actionLoadingId,
  onApprove,
  onReject,
}: BenefitRequestRowProps) {
  const status = (request.status || "PENDING").toUpperCase();
  const isLoading = actionLoadingId === request.id;
  const employeeName = request.employeeName ?? request.employeeId ?? "";
  const benefitText = request.benefitName ?? request.benefitId ?? "Benefit request";

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <span className="text-xs text-slate-400 dark:text-[#94A3B8]">
          {formatRelativeTime(request.createdAt)}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
            {getInitials(employeeName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">{employeeName}</p>
            {affiliation ? (
              <p className="text-sm text-slate-400 dark:text-[#94A3B8]">
                {affiliation}
              </p>
            ) : null}
            <p className="mt-0.5 text-sm text-white dark:text-[#E2E8F0]">
              {benefitText}
            </p>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-3">
        {status === "PENDING" && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="h-[38px] w-[94px] rounded-lg bg-[#8A5212] px-3 py-1.5 text-base font-medium text-[#ffffff] transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => onApprove(request.id)}
              disabled={isLoading}
              className="h-[38px] w-[94px] rounded-lg bg-[#0f5540] px-3 py-1.5 text-base font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "..." : "Approve"}
            </button>
            <button
              type="button"
              onClick={() => onReject(request.id)}
              disabled={isLoading}
              className="h-[38px] w-[94px] rounded-lg bg-[#851618] px-3 py-1.5 text-base font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
        {status === "APPROVED" && (
          <button
            type="button"
            disabled={isLoading}
            className="flex h-[28px] w-[84px] items-center justify-center rounded-lg bg-[#0f5540] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Approved
          </button>
        )}
        {status === "REJECTED" && (
          <button
            type="button"
            disabled={isLoading}
            className="flex h-[28px] w-[84px] items-center justify-center rounded-lg bg-[#851618] px-3 py-1.5 text-base font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reject
          </button>
        )}
      </div>
    </div>
  );
}
