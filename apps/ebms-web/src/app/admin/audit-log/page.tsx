"use client";

import { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { AuditLogSkeleton } from "../components/AuditLogSkeleton";
import { getAdminClient, getApiErrorMessage } from "../_lib/api";

type AuditEntry = {
  id: string;
  timestamp: string;
  action: string;
  status: "ACTIVE" | "ELIGIBLE" | "PENDING" | "LOCKED" | "REJECTED" | "CANCELLED";
  employee: string;
  employeeId: string;
  benefit: string;
  performedBy: string;
  details: string;
  reason: string;
  contractStartDate: string;
  contractEndDate: string;
};

const AUDIT_LOG_QUERY = gql`
  query AuditLogForAdmin {
    auditLog(filters: {}) {
      id
      employeeId
      benefitId
      oldStatus
      newStatus
      computedAt
      triggeredBy
      createdAt
    }
  }
`;

const EMPLOYEES_QUERY = gql`
  query AuditEmployees {
    employees {
      id
      name
    }
  }
`;

const BENEFITS_QUERY = gql`
  query AuditBenefits {
    benefits {
      id
      name
    }
  }
`;

export default function AuditLogPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [logIdFilter, setLogIdFilter] = useState("");
  const [benefitFilter, setBenefitFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AuditEntry["status"]>("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const client = getAdminClient();
        const [auditRes, employeesRes, benefitsRes] = await Promise.all([
          client.request<{
            auditLog: Array<{
              id: string;
              employeeId: string;
              benefitId: string;
              oldStatus?: string | null;
              newStatus: string;
              computedAt: string;
              triggeredBy?: string | null;
              createdAt?: string | null;
            }>;
          }>(AUDIT_LOG_QUERY),
          client.request<{ employees: Array<{ id: string; name?: string | null }> }>(EMPLOYEES_QUERY),
          client.request<{ benefits: Array<{ id: string; name: string }> }>(BENEFITS_QUERY),
        ]);

        if (cancelled) return;

        const employeeNameById = new Map(
          (employeesRes.employees ?? []).map((e) => [e.id, e.name?.trim() || e.id]),
        );
        const benefitNameById = new Map(
          (benefitsRes.benefits ?? []).map((b) => [b.id, b.name]),
        );

        const mapped: AuditEntry[] = (auditRes.auditLog ?? []).map((item) => {
          const nextStatus = (item.newStatus ?? "LOCKED").toUpperCase() as AuditEntry["status"];
          const prev = (item.oldStatus ?? "").toUpperCase().trim();
          const action = prev
            ? `Status ${prev} -> ${nextStatus}`
            : "Override Granted";
          return {
            id: item.id,
            timestamp: item.computedAt || item.createdAt || "",
            action,
            status: nextStatus,
            employee: employeeNameById.get(item.employeeId) ?? item.employeeId,
            employeeId: item.employeeId,
            benefit: benefitNameById.get(item.benefitId) ?? item.benefitId,
            performedBy: item.triggeredBy ?? "system",
            details: prev
              ? "Eligibility status updated."
              : "Manual eligibility override recorded.",
            reason: "",
            contractStartDate: "—",
            contractEndDate: "—",
          };
        });

        setEntries(mapped);
      } catch (e) {
        if (!cancelled) {
          setEntries([]);
          setError(getApiErrorMessage(e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <AuditLogSkeleton />;
  }

  const benefitOptions = Array.from(new Set(entries.map((entry) => entry.benefit)));
  const actionOptions = Array.from(new Set(entries.map((entry) => entry.action)));

  const filteredEntries = entries.filter((entry) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedLogId = logIdFilter.trim().toLowerCase();
    if (
      normalizedSearch &&
      !(
        entry.employee.toLowerCase().includes(normalizedSearch) ||
        entry.employeeId.toLowerCase().includes(normalizedSearch) ||
        entry.benefit.toLowerCase().includes(normalizedSearch) ||
        entry.action.toLowerCase().includes(normalizedSearch) ||
        entry.status.toLowerCase().includes(normalizedSearch) ||
        entry.id.toLowerCase().includes(normalizedSearch) ||
        entry.performedBy.toLowerCase().includes(normalizedSearch)
      )
    ) {
      return false;
    }

    if (benefitFilter !== "ALL" && entry.benefit !== benefitFilter) return false;
    if (normalizedLogId && !entry.id.toLowerCase().includes(normalizedLogId)) return false;
    if (actionFilter !== "ALL" && entry.action !== actionFilter) return false;
    if (statusFilter !== "ALL" && entry.status !== statusFilter) return false;

    if (!dateFrom && !dateTo) return true;
    const entryDate = new Date(entry.timestamp);
    if (Number.isNaN(entryDate.getTime())) return false;

    if (dateFrom) {
      const from = new Date(`${dateFrom}T00:00:00`);
      if (entryDate < from) return false;
    }
    if (dateTo) {
      const to = new Date(`${dateTo}T23:59:59`);
      if (entryDate > to) return false;
    }
    return true;
  });

  const formatTime = (raw: string) => {
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const activeFilters = [
    searchTerm.trim() ? `Search: ${searchTerm.trim()}` : null,
    logIdFilter.trim() ? `Log ID: ${logIdFilter.trim()}` : null,
    benefitFilter !== "ALL" ? `Benefit: ${benefitFilter}` : null,
    actionFilter !== "ALL" ? `Action: ${actionFilter}` : null,
    statusFilter !== "ALL" ? `Status: ${statusFilter}` : null,
    dateFrom ? `From: ${dateFrom}` : null,
    dateTo ? `To: ${dateTo}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-5 font-semibold text-slate-900 dark:text-white">Audit Log Explorer</h1>
          <p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">Searchable audit trail for all system actions</p>
        </div>

        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl bg-[#2F66E8] px-6 py-3 text-5 font-medium text-white transition hover:bg-[#3E82F7]"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
          </svg>
          Export Logs
        </button>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-5 font-semibold text-slate-900 dark:text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" />
            </svg>
            Filters
          </h2>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setLogIdFilter("");
              setBenefitFilter("ALL");
              setActionFilter("ALL");
              setStatusFilter("ALL");
              setDateFrom("");
              setDateTo("");
            }}
            className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-5 text-slate-700 transition hover:bg-slate-200 dark:border-[#4B5D83] dark:bg-[#334160] dark:text-[#D4DEEF] dark:hover:bg-[#3A4A6C]"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-5 font-medium text-slate-900 dark:text-white">Search</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8FA3C5]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="User, ID, benefit, action, status..."
                className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 pl-14 pr-4 text-l text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8595B6] dark:focus:border-[#4B6FA8]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-slate-900 dark:text-white">Benefit Type</label>
            <div className="relative">
              <select
                value={benefitFilter}
                onChange={(e) => setBenefitFilter(e.target.value)}
                className="h-14 w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50 px-4 pr-12 text-l text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
              >
                <option value="ALL">All Benefits</option>
                {benefitOptions.map((benefit) => (
                  <option key={benefit} value={benefit}>
                    {benefit}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8595B6]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-slate-900 dark:text-white">Log ID</label>
            <input
              type="text"
              value={logIdFilter}
              onChange={(e) => setLogIdFilter(e.target.value)}
              placeholder="LOG-1001"
              className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-l text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8595B6] dark:focus:border-[#4B6FA8]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-slate-900 dark:text-white">Date Range</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-l text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 text-l text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-slate-900 dark:text-white">Action Type</label>
            <div className="relative">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="h-14 w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50 px-4 pr-12 text-l text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
              >
                <option value="ALL">All Actions</option>
                {actionOptions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8595B6]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-slate-900 dark:text-white">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "ALL" | AuditEntry["status"]
                  )
                }
                className="h-14 w-full appearance-none rounded-2xl border border-slate-300 bg-slate-50 px-4 pr-12 text-l text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ELIGIBLE">ELIGIBLE</option>
                <option value="PENDING">PENDING</option>
                <option value="LOCKED">LOCKED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8595B6]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      <p className="text-5 text-slate-600 dark:text-[#A7B6D3]">
        Showing {filteredEntries.length} of {entries.length} entries
      </p>

      {error && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filterLabel) => (
            <span
              key={filterLabel}
              className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:border-[#4B5D83] dark:bg-[#334160] dark:text-[#D4DEEF]"
            >
              {filterLabel}
            </span>
          ))}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-[#2C4264] dark:bg-[#112349]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-[#2B405F] dark:text-[#A7B6D3]">
              <tr>
                <th className="px-4 py-4 font-medium sm:px-6">№</th>
                <th className="px-4 py-4 font-medium sm:px-6">Time</th>
                <th className="px-4 py-4 font-medium sm:px-6">User</th>
                <th className="px-4 py-4 font-medium sm:px-6">Action</th>
                <th className="px-4 py-4 font-medium sm:px-6">Benefit</th>
                <th className="px-4 py-4 font-medium sm:px-6">Contract Start</th>
                <th className="px-4 py-4 font-medium sm:px-6">Contract End</th>
                <th className="px-4 py-4 font-medium sm:px-6">Result</th>
                <th className="px-4 py-4 font-medium sm:px-6">Log ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className="border-b border-slate-200 last:border-b-0 dark:border-[#22395A]"
                >
                  <td className="px-4 py-5 font-semibold text-slate-900 dark:text-white sm:px-6">{idx + 1}</td>
                  <td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
                    {formatTime(entry.timestamp)}
                  </td>
                  <td className="px-4 py-5 sm:px-6">
                    <p className="font-semibold text-slate-900 dark:text-white">{entry.employee}</p>
                    <p className="text-sm text-slate-500 dark:text-[#8FA3C5]">{entry.employeeId}</p>
                  </td>
                  <td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">{entry.action}</td>
                  <td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">{entry.benefit}</td>
                  <td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">{entry.contractStartDate}</td>
                  <td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">{entry.contractEndDate}</td>
                  <td className="px-4 py-5 sm:px-6">
                    <span className="inline-flex rounded-xl border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:border-[#4B5D83] dark:bg-[#334160] dark:text-[#D4DEEF]">
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-slate-500 dark:text-[#8FA3C5] sm:px-6">{entry.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredEntries.length === 0 && (
          <p className="border-t border-slate-200 px-4 py-3 text-5 text-slate-500 dark:border-[#22395A] dark:text-[#A7B6D3] sm:px-6">
            Таны сонгосон хайлт/шүүлтүүрт тохирох audit log олдсонгүй.
          </p>
        )}
      </section>
    </div>
  );
}
