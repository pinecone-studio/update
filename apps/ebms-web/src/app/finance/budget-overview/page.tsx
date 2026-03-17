"use client";

import { useEffect, useState } from "react";
import { FinancePageSkeleton } from "../components/FinancePageSkeleton";

const statCards = [
  {
    title: "Total Budget",
    value: "$100,000",
    icon: "◫",
    tone: "text-[#4EA2FF] dark:bg-[#11284D] border border-slate-200 dark:border-[#1F345C] bg-white dark:bg-[#0D1B3A]",
  },
  {
    title: "Used Budget",
    value: "$63,500",
    icon: "↗",
    tone: "text-[#B878FF] dark:bg-[#2B2149] border border-slate-200 dark:border-[#1F345C] bg-white dark:bg-[#0D1B3A]",
  },
  {
    title: "Remaining Budget",
    value: "$36,500",
    icon: "$",
    tone: "text-[#00E08B] dark:bg-[#15342B] border border-slate-200 dark:border-[#1F345C] bg-white dark:bg-[#0D1B3A]",
  },
  {
    title: "Pending Requests",
    value: "$18,200",
    icon: "◔",
    tone: "text-[#FF9D33]  dark:bg-[#3A2A16] border border-slate-200 dark:border-[#1F345C] bg-white dark:bg-[#0D1B3A]",
  },
];

const topSpending = [
  { name: "Down Payment Assistance", value: "$32,000" },
  { name: "OKR Bonus", value: "$18,000" },
  { name: "Travel Subsidy", value: "$9,500" },
];

const monthlySpending = [
  5.2, 6.7, 4.5, 7.1, 8.9, 6.2, 5.8, 7.5, 6.9, 8.2, 7.6, 4.5,
];

export default function BudgetOverviewPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <FinancePageSkeleton statCardCount={4} tableRowCount={3} />;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-5 font-semibold text-slate-900 dark:text-white">
          Budget Overview
        </h1>
        <p className="mt-2 text-5 text-slate-600 dark:text-slate-400">
          Track budget allocation and spending across departments
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <article
            key={card.title}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[inset_0_0_30px_rgba(46,94,204,0.08)] dark:border-[#1F345C] dark:bg-[#0D1B3A]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-5 ${card.tone}`}
              >
                {card.icon}
              </div>
              <p className="text-5 text-slate-600 dark:text-slate-300">
                {card.title}
              </p>
            </div>
            <p className="text-5 font-bold text-slate-900 dark:text-white">
              {card.value}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#1E3258] dark:bg-[#0D1B3A]">
        <h2 className="text-5 font-semibold text-slate-900 dark:text-white">
          Top Spending Benefits
        </h2>
        <div className="mt-5 space-y-4">
          {topSpending.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 dark:border-[#1E3258] dark:bg-[#07132B]"
            >
              <p className="text-5 text-slate-700 dark:text-slate-200">
                {item.name}
              </p>
              <p className="text-5 font-semibold text-slate-900 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 pb-10 dark:border-[#1E3258] dark:bg-[#0D1B3A]">
        <h2 className="text-5 font-semibold text-slate-900 dark:text-white">
          Monthly Spending Chart
        </h2>
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 select-none dark:border-[#1E3258] dark:bg-[#0A1630]">
          <div className="flex h-[200px] min-w-[280px] items-end gap-1 sm:h-[300px] sm:gap-2 lg:h-[450px]">
            {monthlySpending.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className="flex-1 bg-transparent hover:bg-transparent"
              >
                <div
                  className="w-full rounded-t-lg bg-[#3E7BE0] hover:bg-[#4F8EF7] focus:bg-[#3E7BE0]"
                  style={{ height: `${(value / 10) * 300}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-5 text-slate-500 dark:text-slate-500">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
          </div>
        </div>
      </section>
    </div>
  );
}
