/** @format */
"use client";

import { FinanceHistoryHeader } from "./_components/FinanceHistoryHeader";
import { FinanceHistorySection } from "./_components/FinanceHistorySection";

export default function FinanceHistoryPage() {
  return (
    <div className="space-y-6">
      <FinanceHistoryHeader />
      <FinanceHistorySection />
    </div>
  );
}
