"use client";

import { useEffect, useState } from "react";
import { FinancePageSkeleton } from "../components/FinancePageSkeleton";

const auditEntries = [
  {
    time: "10:30",
    user: "John Carter",
    action: "Requested Benefit",
    benefit: "Gym",
    result: "Pending" as const,
  },
  {
    time: "11:05",
    user: "HR Admin",
    action: "Override Eligibility",
    benefit: "Gym",
    result: "Approved" as const,
  },
  {
    time: "11:15",
    user: "Finance Manager",
    action: "Payment Approved",
    benefit: "Gym",
    result: "Completed" as const,
  },
];

export default function AuditTrailPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <FinancePageSkeleton statCardCount={0} tableRowCount={3} />;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-5 font-semibold text-slate-900 dark:text-white">Audit Trail</h1>
        <p className="mt-2 text-5 text-slate-600 dark:text-slate-400">
          Complete history of all financial decisions and actions
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#1E3258] dark:bg-[#0D1B3A]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-[#1E3258] dark:text-[#A7B6D3]">
              <tr>
                <th className="px-6 py-5 font-medium">Time</th>
                <th className="px-6 py-5 font-medium">User</th>
                <th className="px-6 py-5 font-medium">Action</th>
                <th className="px-6 py-5 font-medium">Benefit</th>
                <th className="px-6 py-5 font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {auditEntries.map((entry) => (
                <tr key={`${entry.time}-${entry.user}`} className="border-b border-slate-200 last:border-b-0 dark:border-[#182A4A]">
                  <td className="px-6 py-6 text-slate-600 dark:text-slate-300">{entry.time}</td>
                  <td className="px-6 py-6 font-semibold text-slate-900 dark:text-white">{entry.user}</td>
                  <td className="px-6 py-6 text-slate-600 dark:text-slate-300">{entry.action}</td>
                  <td className="px-6 py-6 text-slate-700 dark:text-slate-200">{entry.benefit}</td>
                  <td className="px-6 py-6">
                    <span
                      className={`inline-flex items-center rounded-xl border px-4 py-2 text-5 ${
                        entry.result === "Completed"
                          ? "border-[#0E6B4F] bg-[#15342B] text-[#00E08B]"
                          : entry.result === "Approved"
                            ? "border-[#1B4F95] bg-[#122545] text-[#4EA2FF]"
                            : "border-[#7D4B21] bg-[#3A2A16] text-[#FF9D33]"
                      }`}
                    >
                      {entry.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
