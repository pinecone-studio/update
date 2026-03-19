"use client";

import { useCallback } from "react";
import {
  fetchBenefitRequestContractHtml,
  getFinanceClient,
} from "../../_lib/api";
import type { BenefitRequest } from "../../_lib/api";

const STATUS_COLORS: Record<string, string> = {
  PENDING:
    "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-300",
  ADMIN_APPROVED:
    "border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-300",
  ELIGIBLE:
    "border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-300",
  APPROVED:
    "border-emerald-400 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-300",
  ACTIVE:
    "border-emerald-400 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-300",
  REJECTED:
    "border-red-400 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/20 dark:text-red-300",
  CANCELLED:
    "border-slate-400 bg-slate-100 text-slate-800 dark:border-white/20 dark:bg-white/10 dark:text-white/80",
  LOCKED:
    "border-slate-400 bg-slate-100 text-slate-800 dark:border-white/20 dark:bg-white/10 dark:text-white/80",
};

function getStatusStyle(status: string) {
    return (
    STATUS_COLORS[status] ??
    "border-slate-400 bg-slate-100 text-slate-800 dark:border-white/20 dark:bg-white/10 dark:text-white/80"
  );
}

function formatDateTime(raw: string) {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

type FinanceHistoryTableProps = {
  entries: BenefitRequest[];
  onError?: (msg: string) => void;
};

export function FinanceHistoryTable({
  entries,
  onError,
}: FinanceHistoryTableProps) {
  const handleViewContract = useCallback(
    async (requestId: string) => {
      try {
        const html = await fetchBenefitRequestContractHtml(
          getFinanceClient(),
          requestId,
        );
        const popup = window.open("", "_blank", "noopener,noreferrer");
        if (popup) {
          popup.document.open();
          popup.document.write(html);
          popup.document.close();
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to open contract";
        onError?.(msg);
        if (!onError) alert(msg);
      }
    },
    [onError],
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-white/10 dark:text-white/60">
            <tr>
              <th className="px-4 py-4 font-medium sm:px-6">№</th>
              <th className="px-4 py-4 font-medium sm:px-6">Date & Time</th>
              <th className="px-4 py-4 font-medium sm:px-6">Employee</th>
              <th className="px-4 py-4 font-medium sm:px-6">Action</th>
              <th className="px-4 py-4 font-medium sm:px-6">Benefit</th>
              <th className="px-4 py-4 font-medium sm:px-6">Old → New Status</th>
              <th className="px-4 py-4 font-medium sm:px-6">Contract</th>
              <th className="px-4 py-4 font-medium sm:px-6">Log ID</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => {
              const oldStatus =
                entry.status === "APPROVED" || entry.status === "REJECTED"
                  ? "ADMIN_APPROVED"
                  : "PENDING";
              const newStatus = entry.status;
              const actionLabel =
                entry.status === "APPROVED" ? "Request Approved" : "Request Rejected";
              return (
                <tr
                  key={entry.id}
                  className="border-b border-slate-200 last:border-b-0 dark:border-white/10"
                >
                  <td className="px-4 py-5 font-semibold text-slate-900 dark:text-white sm:px-6">
                    {idx + 1}
                  </td>
                  <td className="whitespace-nowrap px-4 py-5 text-slate-900 dark:text-white sm:px-6">
                    {formatDateTime(entry.createdAt)}
                  </td>
                  <td className="px-4 py-5 sm:px-6">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {entry.employeeName ?? entry.employeeId}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-white/60">
                      {entry.employeeId}
                    </p>
                  </td>
                  <td className="px-4 py-5 font-medium text-slate-900 dark:text-white sm:px-6">
                    {actionLabel}
                  </td>
                  <td className="px-4 py-5 text-slate-900 dark:text-white sm:px-6">
                    {entry.benefitName ?? entry.benefitId}
                  </td>
                  <td className="px-4 py-5 sm:px-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 dark:text-white/60">
                          Old:
                        </span>
                        <span
                          className={`inline-flex rounded-xl border px-3 py-1 text-xs font-medium ${getStatusStyle(oldStatus)}`}
                        >
                          {oldStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 dark:text-white/60">
                          New:
                        </span>
                        <span
                          className={`inline-flex rounded-xl border px-3 py-1 text-xs font-medium ${getStatusStyle(newStatus)}`}
                        >
                          {newStatus}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 sm:px-6">
                    {entry.contractTemplateUrl || entry.requiresContract ? (
                      <button
                        type="button"
                        onClick={() => handleViewContract(entry.id)}
                        className="rounded-lg border border-sky-400 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-300 dark:hover:bg-sky-500/30"
                      >
                        View contract
                      </button>
                    ) : (
                      <span className="text-slate-400 dark:text-white/50">—</span>
                    )}
                  </td>
                  <td className="px-4 py-5 font-mono text-xs text-slate-500 dark:text-white/50 sm:px-6">
                    {entry.id.slice(0, 8)}…
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {entries.length === 0 && (
        <p className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-white/60 sm:px-6">
          Таны сонгосон хайлт/шүүлтүүрт тохирох бичлэг олдсонгүй.
        </p>
      )}
    </section>
  );
}
