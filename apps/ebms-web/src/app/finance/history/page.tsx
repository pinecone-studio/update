/** @format */
"use client";

import { FinanceHistoryHeader } from "./_components/FinanceHistoryHeader";
import { FinanceHistorySection } from "./_components/FinanceHistorySection";

export default function FinanceHistoryPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0B1220]">
      <div className="w-full px-6 py-6 dark:bg-[#0F172A]">
        <div className="mx-auto max-w-[1500px]">
          <FinanceHistoryHeader />
          <div className="mt-8">
            <FinanceHistorySection />
          </div>
        </div>
      </div>
    </div>
  );
}
