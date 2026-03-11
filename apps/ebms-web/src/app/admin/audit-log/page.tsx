"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchAuditLog,
  getApiErrorMessage,
  type AuditFilters,
  type AuditEntry as ApiAuditEntry,
} from "../_lib/api";

export default function AuditLogPage() {
  const [entries, setEntries] = useState<ApiAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AuditFilters>({});
  const [searchInput, setSearchInput] = useState("");
  const [benefitIdFilter, setBenefitIdFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAuditLog({
        employeeId: searchInput.trim() || undefined,
        benefitId: benefitIdFilter || undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      });
      setEntries(res);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [searchInput, benefitIdFilter, dateFrom, dateTo]);

  useEffect(() => {
    load();
  }, [load]);

  const clearFilters = () => {
    setSearchInput("");
    setBenefitIdFilter("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-5 font-semibold text-white">Audit Log Explorer</h1>
          <p className="mt-3 text-5 text-[#A7B6D3]">Searchable audit trail for all system actions</p>
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

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-5 font-semibold text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" />
            </svg>
            Filters
          </h2>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-[#4B5D83] bg-[#334160] px-4 py-2 text-5 text-[#D4DEEF] transition hover:bg-[#3A4A6C]"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-5 font-medium text-white">Employee ID</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8FA3C5]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Employee ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] pl-14 pr-4 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-white">Benefit ID</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Benefit ID (optional)"
                value={benefitIdFilter}
                onChange={(e) => setBenefitIdFilter(e.target.value)}
                className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 pr-12 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-white">From date</label>
            <div className="relative">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] pl-4 pr-4 text-l text-white outline-none focus:border-[#4B6FA8]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-white">To date</label>
            <div className="relative">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] pl-4 pr-4 text-l text-white outline-none focus:border-[#4B6FA8]"
              />
            </div>
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-400">Error: {error}</p>}
      <p className="text-5 text-[#A7B6D3]">
        {loading ? "Loading..." : `Showing ${entries.length} entries`}
      </p>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
        <h2 className="text-5 font-semibold text-white">Audit Trail</h2>

        <div className="mt-5 space-y-5">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-3xl border border-[#324A70] bg-[#23324C] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-5 text-[#97A9C8]">{entry.createdAt || entry.computedAt}</p>
                  <span className="rounded-xl border border-[#2F66E8] bg-[#1A2D59] px-3 py-1 text-5 text-[#4F86FF]">
                    {entry.oldStatus ? `${entry.oldStatus} → ${entry.newStatus}` : entry.newStatus}
                  </span>
                </div>
                <p className="text-5 text-[#8B9CBD]">{entry.id}</p>
              </div>

              <p className="mt-3 text-5 text-white">
                <span className="font-semibold">Employee</span> ({entry.employeeId})
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-[#2A3555] p-4">
                  <p className="text-5 text-[#95A7C6]">Benefit ID</p>
                  <p className="mt-1 text-5 text-white">{entry.benefitId}</p>
                </div>
                <div className="rounded-2xl bg-[#2A3555] p-4">
                  <p className="text-5 text-[#95A7C6]">Triggered By</p>
                  <p className="mt-1 text-5 text-white">{entry.triggeredBy ?? "—"}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#2A3555] p-4">
                <p className="text-5 text-[#95A7C6]">Details</p>
                <p className="mt-1 text-5 text-white">
                  Status: {entry.oldStatus ?? "—"} → {entry.newStatus} (computed: {entry.computedAt})
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
