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
  affiliation: _affiliation,
  actionLoadingId,
  onApprove,
  onReject,
}: BenefitRequestRowProps) {
  const status = (request.status || "PENDING").toUpperCase();
  const isLoading = actionLoadingId === request.id;
  const employeeName = request.employeeName ?? request.employeeId ?? "";
  const benefitText = request.benefitName ?? request.benefitId ?? "Benefit request";

  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-3">
      <div className="flex min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(160deg,#6f65ff,#8b2fff)] text-[20px] font-semibold text-white">
            {getInitials(employeeName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-x-4 gap-y-0">
              <p className="text-base font-semibold leading-none text-white sm:text-[20px]">
                {employeeName}
              </p>
            </div>
            <span className="mt-0 block text-[15px] leading-none text-slate-400 dark:text-[#94A3B8]">
              {formatRelativeTime(request.createdAt)}
            </span>
            <p className="mt-0.5 truncate text-[15px] leading-none text-white/85 dark:text-[#E2E8F0]">
              {benefitText}
            </p>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
        {status === "PENDING" && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              disabled
              className="h-10 min-w-[80px] rounded-xl border border-[#f0d58a]/85 bg-transparent px-3 py-2 text-[13px] font-medium text-[#f7de9d] transition disabled:cursor-not-allowed disabled:opacity-90 hover:bg-[rgba(240,213,138,0.14)] hover:text-white sm:h-[48px] sm:min-w-[118px] sm:px-4 sm:text-[14px]"
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => onApprove(request.id)}
              disabled={isLoading}
              className="h-10 min-w-[80px] rounded-xl border border-[#2ba17e]/80 bg-transparent px-3 py-2 text-[13px] font-medium text-[#7fe3be] transition hover:bg-[rgba(43,161,126,0.16)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-[48px] sm:min-w-[118px] sm:px-4 sm:text-[14px]"
            >
              {isLoading ? "..." : "Approve"}
            </button>
            <button
              type="button"
              onClick={() => onReject(request.id)}
              disabled={isLoading}
              className="h-10 min-w-[80px] rounded-xl border border-[#c23c46]/80 bg-transparent px-3 py-2 text-[13px] font-medium text-[#f39aa1] transition hover:bg-[rgba(194,60,70,0.16)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-[48px] sm:min-w-[118px] sm:px-4 sm:text-[14px]"
            >
              Reject
            </button>
          </div>
        )}
        {status === "APPROVED" && (
          <button
            type="button"
            disabled={isLoading}
            className="flex h-[28px] min-w-[80px] items-center justify-center rounded-lg bg-[#0f5540] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[84px]"
          >
            Approved
          </button>
        )}
        {status === "REJECTED" && (
          <button
            type="button"
            disabled={isLoading}
            className="flex h-[28px] min-w-[80px] items-center justify-center rounded-lg bg-[#851618] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[84px] sm:text-base"
          >
            Reject
          </button>
        )}
      </div>
    </div>
  );
}
