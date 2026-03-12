"use client";

import { useEffect, useState } from "react";
import { TablePageSkeleton } from "../components/TablePageSkeleton";

type Contract = {
  vendor: string;
  benefit: string;
  contractId: string;
  value: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expiring soon";
  renewal?: "Auto-renew";
  reviewed: string;
};

const contracts: Contract[] = [
  {
    vendor: "BlueCross Health Network",
    benefit: "Health Insurance",
    contractId: "CNT-001",
    value: "$2,450,000/year",
    startDate: "January 1, 2024",
    endDate: "December 31, 2026",
    status: "Active",
    renewal: "Auto-renew",
    reviewed: "January 15, 2026",
  },
  {
    vendor: "Vanguard Retirement Services",
    benefit: "401(k) Management",
    contractId: "CNT-002",
    value: "$125,000/year",
    startDate: "March 1, 2025",
    endDate: "May 31, 2026",
    status: "Expiring soon",
    reviewed: "February 2, 2026",
  },
];

export default function VendorContractsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <TablePageSkeleton statCardCount={4} tableRowCount={2} tableColCount={4} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5 font-semibold text-slate-900 dark:text-white">
          Vendor Contract Management
        </h1>
        <p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
          Manage vendor contracts and track lifecycle status
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-[#2C4264] dark:bg-[#1E293B]">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-slate-600 dark:text-[#A7B6D3]">Active Contracts</p>
            <span className="mt-1 h-4 w-4 rounded-full bg-[#19D463]" />
          </div>
          <p className="text-5 font-semibold text-slate-900 dark:text-white">2</p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-[#2C4264] dark:bg-[#1E293B]">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-slate-600 dark:text-[#A7B6D3]">Expiring Soon</p>
            <span className="mt-1 h-4 w-4 rounded-full bg-[#FFB21C]" />
          </div>
          <p className="text-5 font-semibold text-slate-900 dark:text-white">1</p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-[#2C4264] dark:bg-[#1E293B]">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-slate-600 dark:text-[#A7B6D3]">Pending Renewal</p>
            <span className="mt-1 h-4 w-4 rounded-full bg-[#3E82F7]" />
          </div>
          <p className="text-5 font-semibold text-slate-900 dark:text-white">1</p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-[#2C4264] dark:bg-[#1E293B]">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-slate-600 dark:text-[#A7B6D3]">Total Contract Value</p>
          </div>
          <p className="text-5 font-semibold text-slate-900 dark:text-white">$3.19M/yr</p>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8FA3C5]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by vendor name, benefit, or contract ID..."
            className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 pl-14 pr-4 text-l text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8595B6] dark:focus:border-[#4B6FA8]"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
        <h2 className="text-5 font-semibold text-slate-900 dark:text-white">
          All Vendor Contracts
        </h2>

        <div className="mt-5 space-y-5">
          {contracts.map((contract) => (
            <article
              key={contract.contractId}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-[#324A70] dark:bg-[#23324C]"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[#3E82F7]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-7 w-7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M8 3h8l4 4v14H4V3h4Z" />
                    <path d="M16 3v5h5" />
                    <path d="M8 12h8M8 16h8" />
                  </svg>
                </span>
                <h3 className="text-5 font-semibold text-slate-900 dark:text-white">
                  {contract.vendor}
                </h3>
                <span
                  className={`rounded-xl border px-3 py-1 text-5 font-medium ${
                    contract.status === "Active"
                      ? "border-[#166534] bg-[#052E25] text-[#34D399]"
                      : "border-[#B45309] bg-[#3B2A12] text-[#FBBF24]"
                  }`}
                >
                  {contract.status}
                </span>
                {contract.renewal && (
                  <span className="rounded-xl border border-[#5F6D89] bg-[#3A4560] px-3 py-1 text-5 font-medium text-[#C8D2E8]">
                    {contract.renewal}
                  </span>
                )}
              </div>

              <p className="mt-3 text-5 text-[#A7B6D3]">
                Benefit: {contract.benefit}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl bg-slate-100 p-4 md:grid-cols-4 dark:bg-[#2A3555]">
                <div>
                  <p className="text-5 text-slate-500 dark:text-[#95A7C6]">Contract ID</p>
                  <p className="mt-1 text-5 text-slate-900 dark:text-white">
                    {contract.contractId}
                  </p>
                </div>
                <div>
                  <p className="text-5 text-slate-500 dark:text-[#95A7C6]">Contract Value</p>
                  <p className="mt-1 text-5 text-slate-900 dark:text-white">{contract.value}</p>
                </div>
                <div>
                  <p className="text-5 text-slate-500 dark:text-[#95A7C6]">Start Date</p>
                  <p className="mt-1 text-5 text-slate-900 dark:text-white">{contract.startDate}</p>
                </div>
                <div>
                  <p className="text-5 text-slate-500 dark:text-[#95A7C6]">End Date</p>
                  <p className="mt-1 text-5 text-slate-900 dark:text-white">{contract.endDate}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-5 text-[#8192B3]">
                  Last reviewed: {contract.reviewed}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-xl border border-[#4B5D83] bg-[#334160] px-5 py-2 text-5 text-[#D4DEEF] transition hover:bg-[#3A4A6C]"
                  >
                    Update Status
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-[#2F66E8] bg-[#1A2D59] px-5 py-2 text-5 text-[#4F86FF] transition hover:bg-[#213872]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
