"use client";

import type { Contract } from "../types";

type VendorContractStatsCardsProps = {
  contracts: Contract[];
};

export function VendorContractStatsCards({ contracts }: VendorContractStatsCardsProps) {
  return (
    <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article className="min-h-[90px] min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-[#ffffff]/50 dark:bg-[#1D1A4180]/50 sm:h-[107px]">
        <div className="mb-2 flex items-start justify-between">
          <p className="text-sm font-normal dark:text-[#FFFFFF] sm:text-[20px]">
            Active Contracts
          </p>
          <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#19D463]" />
        </div>
        <p className="text-2xl font-normal text-slate-900 sm:text-[34px] dark:text-white">
          {contracts.filter((c) => c.status === "Active").length}
        </p>
      </article>
      <article className="min-h-[90px] min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-[#ffffff]/50 dark:bg-[#1D1A4180]/50 sm:h-[107px]">
        <div className="mb-2 flex items-start justify-between">
          <p className="text-sm font-normal dark:text-[#ffffff] sm:text-[20px]">
            Expiring Soon
          </p>
          <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-amber-500 dark:bg-[#FFB21C]" />
        </div>
        <p className="text-2xl font-normal text-slate-900 sm:text-[34px] dark:text-white">
          {contracts.filter((c) => c.status === "Expiring soon").length}
        </p>
      </article>
    </section>
  );
}
