"use client";

import { useEffect, useState } from "react";
import { FinancePageSkeleton } from "../components/FinancePageSkeleton";
import {
  fetchBenefitRequests,
  fetchBenefits,
  getApiErrorMessage,
  getFinanceClient,
} from "../_lib/api";

type PaymentRow = {
  vendor: string;
  benefit: string;
  amount: string;
  status: "Pending" | "Paid";
};

export default function VendorPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorPayments, setVendorPayments] = useState<PaymentRow[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const client = getFinanceClient();
        const [requests, benefits] = await Promise.all([
          fetchBenefitRequests(client),
          fetchBenefits(client),
        ]);
        const benefitMap = Object.fromEntries(benefits.map((b) => [b.id, b]));
        const rows: PaymentRow[] = requests
          .filter((r) => r.status === "APPROVED" || r.status === "PENDING")
          .map((r) => {
            const benefit = benefitMap[r.benefitId];
            const status = r.status === "APPROVED" ? "Paid" : "Pending";
            return {
              vendor: benefit?.vendorName || benefit?.name || "—",
              benefit: r.benefitName || benefit?.name || r.benefitId,
              amount:
                benefit?.subsidyPercent != null
                  ? `${benefit.subsidyPercent}%`
                  : "—",
              status,
            };
          });
        if (!cancelled) {
          setVendorPayments(rows);
          setRecentPayments(
            rows.filter((r) => r.status === "Paid").slice(0, 5),
          );
        }
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
    return <FinancePageSkeleton statCardCount={1} tableRowCount={3} />;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-5 font-semibold text-slate-900 dark:text-white">
          Vendor Payments
        </h1>
        <p className="mt-2 text-5 text-slate-600 dark:text-slate-400">
          Manage payments to benefit providers and vendors
        </p>
      </header>
      {error && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-[#1E3258] dark:bg-[#0D1B3A]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl dark:bg-[#3A2A16] bg-white text-5 text-[#FF9D33] border border-slate-200 dark:border-none">
            $
          </div>
          <p className="text-5 text-slate-600 dark:text-slate-300">
            Total Pending Payments
          </p>
        </div>
        <p className="mt-3 text-5 font-bold text-slate-900 dark:text-white">
          {vendorPayments.filter((p) => p.status === "Pending").length}
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#1E3258] dark:bg-[#0D1B3A]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-[#1E3258] dark:text-[#A7B6D3]">
              <tr>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">
                  Vendor
                </th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">
                  Benefit
                </th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">
                  Amount
                </th>
                <th className="px-4 py-3 font-medium sm:px-6 sm:py-5">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {vendorPayments.map((item) => (
                <tr
                  key={`${item.vendor}-${item.benefit}`}
                  className="border-b border-slate-200 last:border-b-0 dark:border-[#182A4A]"
                >
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white sm:px-6 sm:py-6">
                    {item.vendor}
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300 sm:px-6 sm:py-6">
                    {item.benefit}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white sm:px-6 sm:py-6">
                    {item.amount}
                  </td>
                  <td className="px-4 py-4 sm:px-6 sm:py-6">
                    <span
                      className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-5 sm:px-4 sm:py-2 ${
                        item.status === "Paid"
                          ? "border-[#0E6B4F] bg-[#15342B] text-[#00E08B]"
                          : "border-[#7D4B21] bg-[#3A2A16] text-[#FF9D33]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {vendorPayments.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-5 text-slate-500 dark:text-slate-300 sm:px-6"
                  >
                    Vendor payment data алга байна.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-[#1E3258] dark:bg-[#0D1B3A]">
        <h2 className="text-5 font-semibold text-slate-900 dark:text-white">
          Recent Vendor Payments
        </h2>
        <div className="mt-5 space-y-4">
          {recentPayments.map((item) => (
            <div
              key={`${item.vendor}-${item.amount}`}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 dark:border-[#1E3258] dark:bg-[#07132B]"
            >
              <p className="text-5 text-slate-700 dark:text-slate-200">
                {item.vendor}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <p className="text-5 font-semibold text-slate-900 dark:text-white">
                  {item.amount}
                </p>
                <span className="inline-flex items-center rounded-xl border border-[#0E6B4F] bg-[#15342B] px-4 py-2 text-5 text-[#00E08B]">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
          {recentPayments.length === 0 && (
            <p className="text-5 text-slate-500 dark:text-slate-300">
              Сүүлд хийгдсэн payment алга байна.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
