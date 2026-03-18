"use client";

import { getInitials } from "../_lib/utils";
import type { BenefitRequest, EmployeeLite } from "../_lib/api";

const STATUS_OPTIONS = [
  { value: "ADMIN_APPROVED" as const, label: "Awaiting Finance" },
  { value: "APPROVED" as const, label: "Approved" },
  { value: "REJECTED" as const, label: "Rejected" },
  { value: undefined, label: "All" },
] as const;

type FinanceRequestsSectionProps = {
  requests: BenefitRequest[];
  statusFilter:
    | "PENDING"
    | "ADMIN_APPROVED"
    | "APPROVED"
    | "REJECTED"
    | undefined;
  onStatusFilterChange: (
    value: "PENDING" | "ADMIN_APPROVED" | "APPROVED" | "REJECTED" | undefined,
  ) => void;
  employees: Record<string, EmployeeLite>;
  benefitSubsidyMap: Record<string, number>;
  submittingRequestId: string | null;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onViewTemplate: (requestId: string) => void;
};

export function FinanceRequestsSection({
  requests,
  statusFilter,
  onStatusFilterChange,
  employees,
  benefitSubsidyMap,
  submittingRequestId,
  onApprove,
  onReject,
  onViewTemplate,
}: FinanceRequestsSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#2C4264] dark:bg-[#1E293B]">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 sm:py-5 dark:border-[#2B405F]">
        <div>
          <h2 className="text-5 font-semibold text-slate-900 dark:text-white">
            Financial Benefit Requests
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value ?? "all"}
              type="button"
              onClick={() => onStatusFilterChange(value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                statusFilter === value
                  ? "bg-blue-600 text-white dark:bg-[#2A8BFF]"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-[#2C4264] dark:text-[#A7B6D3] dark:hover:bg-[#24364F]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-10 text-center dark:from-[#0B1117] dark:to-[#111827] dark:border-[#2C4264]">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600 text-2xl font-semibold text-white">
                0
              </div>
            </div>
            <h3 className="mb-2 text-4xl font-semibold text-slate-900 dark:text-white">
              No Pending Requests
            </h3>
            <p className="text-5 text-slate-600 dark:text-[#A7B6D3]">
              🎉 All requests are processed
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-200 uppercase tracking-wide text-slate-600 dark:border-[#2B405F] dark:text-[#A7B6D3]">
              <tr>
                <th className="px-4 py-3 sm:px-6 sm:py-4">№</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Employee</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Benefit Type</th>
                <th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
                  Requested Amount
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Department</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Date</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Contract</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => {
                const isPending =
                  (request.status || "PENDING").toUpperCase() === "PENDING" ||
                  (request.status || "").toUpperCase() === "ADMIN_APPROVED";
                const needsSignature =
                  (request.status || "PENDING").toUpperCase() === "APPROVED" &&
                  request.requiresContract &&
                  !request.contractTemplateUrl;

                return (
                  <tr
                    key={request.id}
                    className="border-b border-slate-200 dark:border-[#2B405F]"
                  >
                    <td className="px-4 py-4 text-5 font-semibold text-slate-900 dark:text-white sm:px-6 sm:py-5">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-5">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-5 font-semibold text-blue-700 dark:bg-[#2A8BFF]/30 dark:text-white sm:h-10 sm:w-10">
                          {getInitials(
                            request.employeeName || request.employeeId,
                          )}
                        </div>
                        <span className="min-w-0 truncate text-5 text-slate-900 dark:text-white">
                          {request.employeeName || request.employeeId}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-5 text-slate-600 dark:text-[#A7B6D3] sm:px-6 sm:py-5">
                      {request.benefitName || request.benefitId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-5 font-semibold text-slate-900 dark:text-white sm:px-6 sm:py-5">
                      {benefitSubsidyMap[request.benefitId] != null
                        ? `${benefitSubsidyMap[request.benefitId]}%`
                        : "—"}
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-5">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-5 text-slate-600 dark:bg-[#24364F] dark:text-[#A7B6D3] sm:px-3">
                        {employees[request.employeeId]?.role || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-5 text-slate-500 dark:text-[#8FA3C5] sm:px-6 sm:py-5">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleString("mn-MN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-6 sm:py-5">
                      {request.requiresContract ? (
                        <div className="flex flex-col gap-1">
                          <span
                            className={`text-xs font-medium ${needsSignature ? "text-amber-500" : "text-emerald-500"}`}
                          >
                            {needsSignature ? "Not signed" : "Signed"}
                          </span>
                          {request.contractTemplateUrl ? (
                            <button
                              type="button"
                              onClick={() => void onViewTemplate(request.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-300"
                            >
                              View template
                            </button>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void onApprove(request.id)}
                          disabled={
                            submittingRequestId === request.id || !isPending
                          }
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-5 font-medium text-white hover:bg-green-700 disabled:opacity-60 sm:rounded-xl sm:px-4 sm:py-2 dark:bg-[#00C95F] dark:hover:bg-[#00B355]"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(request.id)}
                          disabled={
                            submittingRequestId === request.id || !isPending
                          }
                          className="rounded-lg bg-red-500/90 px-3 py-1.5 text-5 font-medium text-white hover:bg-red-500 sm:rounded-xl sm:px-4 sm:py-2"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
