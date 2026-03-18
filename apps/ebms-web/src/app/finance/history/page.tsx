/** @format */
"use client";

import { FinanceHistoryHeader } from "./_components/FinanceHistoryHeader";
import { FinanceHistorySection } from "./_components/FinanceHistorySection";

export default function FinanceHistoryPage() {
  return (
    <div className="min-h-screen w-full px-4 py-6 text-slate-900 dark:text-white sm:px-6">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <FinanceHistoryHeader />
        <FinanceHistorySection />
      </div>
    </div>
  );
}
