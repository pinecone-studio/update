"use client";

import { useEffect, useState } from "react";
import { AuditLogSkeleton } from "../components/AuditLogSkeleton";

type AuditEntry = {
  id: string;
  timestamp: string;
  action: string;
  employee: string;
  employeeId: string;
  benefit: string;
  performedBy: string;
  details: string;
  reason: string;
};

const entries: AuditEntry[] = [
  {
    id: "LOG-1001",
    timestamp: "March 10, 2026 14:23:15",
    action: "Override Granted",
    employee: "Sarah Johnson",
    employeeId: "EMP-2847",
    benefit: "Stock Options",
    performedBy: "Admin User",
    details: "Manual eligibility override granted",
    reason: "Exceptional performance review and promotion to L4 effective immediately. VP approval obtained.",
  },
  {
    id: "LOG-1002",
    timestamp: "March 9, 2026 09:11:03",
    action: "Temporary Exception",
    employee: "Mike Chen",
    employeeId: "EMP-2914",
    benefit: "Medical Leave Coverage",
    performedBy: "Admin User",
    details: "Temporary exception created",
    reason: "Extended medical leave approved for 60 days based on submitted documentation.",
  },
];

export default function AuditLogPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <AuditLogSkeleton />;
  }

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
            className="rounded-xl border border-[#4B5D83] bg-[#334160] px-4 py-2 text-5 text-[#D4DEEF] transition hover:bg-[#3A4A6C]"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-5 font-medium text-white">Search</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8FA3C5]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Employee name, ID, benefit..."
                className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] pl-14 pr-4 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-white">Benefit Type</label>
            <div className="relative">
              <select className="h-14 w-full appearance-none rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 pr-12 text-l text-white outline-none focus:border-[#4B6FA8]">
                <option>All Benefits</option>
                <option>Health Insurance</option>
                <option>401(k)</option>
                <option>Stock Options</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8595B6]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-white">Action Type</label>
            <div className="relative">
              <select className="h-14 w-full appearance-none rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 pr-12 text-l text-white outline-none focus:border-[#4B6FA8]">
                <option>All Actions</option>
                <option>Override Granted</option>
                <option>Temporary Exception</option>
                <option>Rule Updated</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8595B6]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-white">Date Range</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Pick dates"
                className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] pl-14 pr-4 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#D8E1F2]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M8 2v4M16 2v4M3 9h18" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      <p className="text-5 text-[#A7B6D3]">Showing {entries.length} of {entries.length} entries</p>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
        <h2 className="text-5 font-semibold text-white">Audit Trail</h2>

        <div className="mt-5 space-y-5">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-3xl border border-[#324A70] bg-[#23324C] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-5 text-[#97A9C8]">{entry.timestamp}</p>
                  <span className="rounded-xl border border-[#2F66E8] bg-[#1A2D59] px-3 py-1 text-5 text-[#4F86FF]">
                    {entry.action}
                  </span>
                </div>
                <p className="text-5 text-[#8B9CBD]">{entry.id}</p>
              </div>

              <p className="mt-3 text-5 text-white">
                <span className="font-semibold">{entry.employee}</span> ({entry.employeeId})
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-[#2A3555] p-4">
                  <p className="text-5 text-[#95A7C6]">Benefit</p>
                  <p className="mt-1 text-5 text-white">{entry.benefit}</p>
                </div>
                <div className="rounded-2xl bg-[#2A3555] p-4">
                  <p className="text-5 text-[#95A7C6]">Performed By</p>
                  <p className="mt-1 text-5 text-white">{entry.performedBy}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[#2A3555] p-4">
                <p className="text-5 text-[#95A7C6]">Details</p>
                <p className="mt-1 text-5 text-white">{entry.details}</p>
              </div>

              <div className="mt-4 rounded-2xl border border-[#2F66E8] bg-[#1A2D59] p-4">
                <p className="text-5 text-[#9BB7EF]">Documented Reason</p>
                <p className="mt-1 text-5 text-[#E3ECFF]">{entry.reason}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
