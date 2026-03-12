"use client";

import { useEffect, useState } from "react";
import { FinancePageSkeleton } from "../components/FinancePageSkeleton";

const rejectedRequests = [
  {
    employee: "Sarah Kim",
    benefit: "Travel Subsidy",
    amount: "$1,200",
    reason: "Budget exceeded",
    date: "May 14",
  },
  {
    employee: "David Lee",
    benefit: "Down Payment",
    amount: "$15,000",
    reason: "Tenure requirement not met",
    date: "May 10",
  },
];

export default function RejectedRequestsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
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

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#1E3258] dark:bg-[#0B1733]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-[#1E3258] dark:text-[#A7B6D3]">
              <tr>
                <th className="px-6 py-5 font-medium">Employee</th>
                <th className="px-6 py-5 font-medium">Benefit</th>
                <th className="px-6 py-5 font-medium">Amount</th>
                <th className="px-6 py-5 font-medium">Reason</th>
                <th className="px-6 py-5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {rejectedRequests.map((item) => (
                <tr
                  key={`${item.employee}-${item.date}`}
                  className="border-b border-slate-200 last:border-b-0 dark:border-[#182A4A]"
                >
                  <td className="px-6 py-6 font-semibold text-slate-900 dark:text-white">
                    {item.employee}
                  </td>
                  <td className="px-6 py-6 text-slate-600 dark:text-slate-300">{item.benefit}</td>
                  <td className="px-6 py-6 font-semibold text-slate-900 dark:text-white">
                    {item.amount}
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center rounded-xl border border-[#7B2940] bg-[#3B1A2A] px-4 py-2 text-5 text-[#F39AAF]">
                      {item.reason}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-slate-600 dark:text-slate-300">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
