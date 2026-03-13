"use client";

import { useEffect, useState } from "react";
import { FinancePageSkeleton } from "../components/FinancePageSkeleton";
import {
  fetchBenefitRequests,
  fetchBenefits,
  getApiErrorMessage,
  getFinanceClient,
} from "../_lib/api";

type RejectedRow = {
  employee: string;
  benefit: string;
  amount: string;
  reason: string;
  date: string;
};

export default function RejectedRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectedRequests, setRejectedRequests] = useState<RejectedRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const client = getFinanceClient();
        const [requests, benefits] = await Promise.all([
          fetchBenefitRequests(client, "REJECTED"),
          fetchBenefits(client),
        ]);
        const benefitMap = Object.fromEntries(benefits.map((b) => [b.id, b]));
        const rows: RejectedRow[] = requests.map((r) => ({
          employee: r.employeeName || r.employeeId,
          benefit: r.benefitName || r.benefitId,
          amount:
            benefitMap[r.benefitId]?.subsidyPercent != null
              ? `${benefitMap[r.benefitId].subsidyPercent}%`
              : "—",
          reason: r.rejectReason ?? "Rejected by reviewer",
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—",
        }));
        if (!cancelled) setRejectedRequests(rows);
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
    return <FinancePageSkeleton statCardCount={0} tableRowCount={2} />;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Rejected Requests</h1>
        <p className="mt-3 text-5 text-slate-600 dark:text-slate-400">
          History of rejected benefit requests with reasons
        </p>
      </header>
      {error && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#1E3258] dark:bg-[#0B1733]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-[#1E3258] dark:text-[#A7B6D3]">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">Employee</th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">Benefit</th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">Amount</th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">Reason</th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">Date</th>
              </tr>
            </thead>
            <tbody>
              {rejectedRequests.map((item) => (
                <tr
                  key={`${item.employee}-${item.date}`}
                  className="border-b border-slate-200 last:border-b-0 dark:border-[#182A4A]"
                >
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white sm:px-6 sm:py-6">
                    {item.employee}
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6 sm:py-6">{item.benefit}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white sm:px-6 sm:py-6">
                    {item.amount}
                  </td>
                  <td className="px-4 py-4 sm:px-6 sm:py-6">
                    <span className="inline-flex max-w-[200px] items-center rounded-xl border border-[#7B2940] bg-[#3B1A2A] px-3 py-1.5 text-5 text-[#F39AAF] sm:max-w-none sm:px-4 sm:py-2">
                      {item.reason}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6 sm:py-6">{item.date}</td>
                </tr>
              ))}
              {rejectedRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-5 text-slate-500 dark:text-slate-300 sm:px-6">
                    Rejected хүсэлт алга байна.
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
