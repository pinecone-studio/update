"use client";

import { useCallback } from "react";
import { openAdminContractByRequestId } from "../../_lib/api";
import type { AuditEntry } from "../_lib/types";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "border-emerald-400 bg-emerald-100 text-emerald-800 dark:border-emerald-500/50 dark:bg-emerald-500/20 dark:text-emerald-300",
  ELIGIBLE: "border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-500/50 dark:bg-sky-500/20 dark:text-sky-300",
  PENDING: "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-500/50 dark:bg-amber-500/20 dark:text-amber-300",
  LOCKED: "border-slate-400 bg-slate-100 text-slate-900 dark:border-slate-500/50 dark:bg-slate-500/20 dark:text-slate-300",
  REJECTED: "border-red-400 bg-red-100 text-red-800 dark:border-red-500/50 dark:bg-red-500/20 dark:text-red-300",
  CANCELLED: "border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-500/50 dark:bg-slate-500/20 dark:text-slate-400",
};

function getStatusStyle(status: string) {
  return (
    STATUS_COLORS[status] ??
    "border-slate-400 bg-slate-100 text-slate-900 dark:border-slate-500/50 dark:bg-slate-500/20 dark:text-slate-300"
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

type AuditLogTableProps = {
  entries: AuditEntry[];
};

export function AuditLogTable({ entries }: AuditLogTableProps) {
  const handleViewContract = useCallback(
    async (requestId: string) => {
      try {
        await openAdminContractByRequestId(requestId);
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to open contract");
      }
    },
    [],
  );
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[var(--shadow-card)] dark:border-[rgba(38,38,38,1)] dark:bg-[rgba(13,94,85,0.1)] dark:shadow-none">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-5">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-white/10 dark:text-white/70">
            <tr>
              <th className="px-4 py-4 font-medium sm:px-6">№</th>
              <th className="px-4 py-4 font-medium sm:px-6">Time</th>
              <th className="px-4 py-4 font-medium sm:px-6">User</th>
              <th className="px-4 py-4 font-medium sm:px-6">Action</th>
              <th className="px-4 py-4 font-medium sm:px-6">Benefit</th>
              <th className="px-4 py-4 font-medium sm:px-6">Result</th>
              <th className="px-4 py-4 font-medium sm:px-6">Contract</th>
              <th className="px-4 py-4 font-medium sm:px-6">Log ID</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => {
              let oldStatus = (entry.oldStatus ?? "").toUpperCase().trim();
              if (!oldStatus) {
                if (entry.status === "ACTIVE") oldStatus = "ELIGIBLE";
                else if (entry.status === "ELIGIBLE") oldStatus = "PENDING";
                else if (entry.status === "REJECTED") oldStatus = "PENDING";
                else oldStatus = "LOCKED";
              }
              const newStatus = entry.status;
              return (
                <tr
                  key={entry.id}
                  className="border-b border-slate-200 last:border-b-0 dark:border-white/10"
                >
                  <td className="px-4 py-5 font-semibold text-slate-900 sm:px-6 dark:text-white">
                    {idx + 1}
                  </td>
                  <td className="whitespace-nowrap px-4 py-5 text-slate-900 sm:px-6 dark:text-white">
                    {formatDateTime(entry.timestamp)}
                  </td>
                  <td className="px-4 py-5 sm:px-6">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {entry.employee}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-white/70">
                      {entry.employeeId}
                    </p>
                  </td>
                  <td className="px-4 py-5 font-medium text-slate-900 sm:px-6 dark:text-white">
                    {entry.action}
                  </td>
                  <td className="px-4 py-5 text-slate-900 sm:px-6 dark:text-white">
                    {entry.benefit}
                  </td>
                  <td className="px-4 py-5 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-xl border px-3 py-1 text-xs font-medium ${getStatusStyle(oldStatus)}`}
                      >
                        {oldStatus}
                      </span>
                      <span className="text-slate-400 dark:text-white/50">
                        →
                      </span>
                      <span
                        className={`inline-flex rounded-xl border px-3 py-1 text-xs font-medium ${getStatusStyle(newStatus)}`}
                      >
                        {newStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 sm:px-6">
                    {entry.uploadedContractRequestId ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleViewContract(entry.uploadedContractRequestId!)
                        }
                        className="rounded-lg border border-sky-400 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-100 dark:border-sky-500/50 dark:bg-sky-500/20 dark:text-sky-300 dark:hover:bg-sky-500/30"
                      >
                        View contract
                      </button>
                    ) : (
                      <span className="text-slate-400 dark:text-white/50">—</span>
                    )}
                  </td>
                  <td className="px-4 py-5 font-mono text-xs text-slate-500 sm:px-6 dark:text-white/70">
                    {entry.id.slice(0, 8)}…
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {entries.length === 0 && (
        <p className="border-t border-slate-200 px-4 py-3 text-5 text-slate-500 sm:px-6 dark:border-white/10 dark:text-white/70">
          Таны сонгосон хайлт/шүүлтүүрт тохирох audit log олдсонгүй.
        </p>
      )}
    </section>
  );
}
