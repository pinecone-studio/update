/** @format */
"use client";

import { FinanceHistoryHeader } from "./_components/FinanceHistoryHeader";
import { FinanceHistorySection } from "./_components/FinanceHistorySection";

export default function FinanceHistoryPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-6 py-6">
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
