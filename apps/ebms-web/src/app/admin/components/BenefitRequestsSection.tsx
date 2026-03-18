"use client";

import { BenefitRequestRow } from "./BenefitRequestRow";
import type { BenefitRequest } from "../_lib/dashboard-types";

const STATUS_OPTIONS = [
  { value: "PENDING" as const, label: "Pending" },
  { value: "APPROVED" as const, label: "Approved" },
  { value: "REJECTED" as const, label: "Rejected" },
  { value: undefined, label: "All" },
] as const;

type BenefitRequestsSectionProps = {
  requests: BenefitRequest[];
  statusFilter: string | undefined;
  onStatusFilterChange: (value: string | undefined) => void;
  error: string | null;
  actionLoadingId: string | null;
  employeeIdToDepartment: Record<string, string>;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
};

export function BenefitRequestsSection({
  requests,
  statusFilter,
  onStatusFilterChange,
  error,
  actionLoadingId,
  employeeIdToDepartment,
  onApprove,
  onReject,
}: BenefitRequestsSectionProps) {
  return (
    <article className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[rgba(38, 38, 38, 1)] bg-[rgba(13, 94, 85, 0.1)] p-4 sm:rounded-[24px] sm:p-6 dark:border-[#262626]">
      <div className="mb-4 flex shrink-0 flex-col gap-3 px-4 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 sm:pt-6">
        <h2 className="text-lg font-bold text-white sm:text-xl">
          Employee Benefit Requests
        </h2>
        <div className="w-full overflow-x-auto rounded-2xl border border-white/30 sm:w-auto">
          <div className="flex h-[49px] min-w-max gap-1.5 sm:w-[472px]">
            {STATUS_OPTIONS.map(({ value, label }) => (
              <button
                key={value ?? "all"}
                type="button"
                onClick={() => onStatusFilterChange(value)}
                className={`shrink-0 rounded-2xl px-[22px] py-2.5 text-[20px] font-medium transition ${
                  statusFilter === value
                    ? "bg-slate-200 text-slate-800 dark:bg-slate-200 dark:text-slate-800"
                    : "bg-transparent text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-4 mb-4 shrink-0 rounded-lg border border-red-500/50 px-4 py-2 text-red-200 sm:mx-8">
          {error}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {requests.length === 0 ? (
          <p className="px-4 py-8 text-center text-slate-400 sm:px-8 dark:text-[#A7B6D3]">
            No benefit requests found.
          </p>
        ) : (
          <div className="divide-y divide-white/30 px-4 pb-4 sm:px-8 sm:pb-8">
            {requests.map((req) => (
              <BenefitRequestRow
                key={req.id}
                request={req}
                affiliation={employeeIdToDepartment[req.employeeId] ?? ""}
                actionLoadingId={actionLoadingId}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
