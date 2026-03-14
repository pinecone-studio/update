"use client";

import { useEffect, useState } from "react";
import { FinancePageSkeleton } from "../components/FinancePageSkeleton";
import {
  fetchAuditLog,
  fetchBenefits,
  fetchEmployees,
  getApiErrorMessage,
  getFinanceClient,
} from "../_lib/api";

type AuditRow = {
  time: string;
  user: string;
  action: string;
  benefit: string;
  result: "Pending" | "Approved" | "Completed";
};

export default function AuditTrailPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditEntries, setAuditEntries] = useState<AuditRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const client = getFinanceClient();
        const [audits, employees, benefits] = await Promise.all([
          fetchAuditLog(client),
          fetchEmployees(client),
          fetchBenefits(client),
        ]);
        const employeeMap = Object.fromEntries(employees.map((e) => [e.id, e.name || e.id]));
        const benefitMap = Object.fromEntries(benefits.map((b) => [b.id, b.name]));
        const rows: AuditRow[] = audits.map((a) => {
          const resultLower = a.newStatus.toLowerCase();
          const result =
            resultLower === "active"
              ? "Completed"
              : resultLower === "pending"
                ? "Pending"
                : "Approved";
          return {
            time: a.computedAt ? new Date(a.computedAt).toLocaleTimeString() : "—",
            user: employeeMap[a.employeeId] || a.employeeId,
            action: "Eligibility Updated",
            benefit: benefitMap[a.benefitId] || a.benefitId,
            result,
          };
        });
        if (!cancelled) setAuditEntries(rows);
      } catch (e) {
        if (!cancelled) setError(getApiErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
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
      {error && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#1E3258] dark:bg-[#0D1B3A]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-[#1E3258] dark:text-[#A7B6D3]">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">Time</th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">User</th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">Action</th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">Benefit</th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">Result</th>
              </tr>
            </thead>
            <tbody>
              {auditEntries.map((entry) => (
                <tr key={`${entry.time}-${entry.user}`} className="border-b border-slate-200 last:border-b-0 dark:border-[#182A4A]">
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6 sm:py-6">{entry.time}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white sm:px-6 sm:py-6">{entry.user}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6 sm:py-6">{entry.action}</td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-200 sm:px-6 sm:py-6">{entry.benefit}</td>
                  <td className="px-4 py-4 sm:px-6 sm:py-6">
                    <span
                      className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-5 sm:px-4 sm:py-2 ${
                        entry.result === "Completed"
                          ? "border-[#0E6B4F] dark:bg-[#15342B] bg-white text-[#00E08B]"
                          : entry.result === "Approved"
                            ? "border-[#1B4F95] dark:bg-[#122545] bg-white text-[#4EA2FF]"
                            : "border-[#7D4B21] dark:bg-[#3A2A16] bg-white text-[#FF9D33]"
                      }`}
                    >
                      {entry.result}
                    </span>
                  </td>
                </tr>
              ))}
              {auditEntries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-5 text-slate-500 dark:text-slate-300 sm:px-6">
                    Audit өгөгдөл алга байна.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
