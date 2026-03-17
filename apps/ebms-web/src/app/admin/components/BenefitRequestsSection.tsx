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
    <article className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-[rgba(38, 38, 38, 1)] bg-[rgba(13, 94, 85, 0.1)] sm:p-6 dark:border-[#262626]">
      <div className="mb-4 flex shrink-0 flex-col gap-3 px-6 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-white">
          Employee Benefit Requests
        </h2>
        <div className="w-auto overflow-hidden rounded-2xl border border-white/30">
          <div className="flex h-[49px] w-[472px] gap-1.5">
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
        <div className="mx-8 mb-4 shrink-0 rounded-lg border border-red-500/50 px-4 py-2 text-red-200">
          {error}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {requests.length === 0 ? (
          <p className="px-8 py-8 text-center text-slate-400 dark:text-[#A7B6D3]">
            No benefit requests found.
          </p>
        ) : (
          <div className="divide-y divide-white/30 px-8 pb-8">
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
