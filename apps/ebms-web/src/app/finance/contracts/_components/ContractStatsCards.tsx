"use client";

import type { Contract } from "../types";

type ContractStatsCardsProps = {
  contracts: Contract[];
};

const STAT_CARDS = [
  {
    label: "Active Contracts",
    dotClass: "bg-[#19D463]",
    getValue: (c: Contract[]) => c.filter((x) => x.status === "Active").length,
  },
  {
    label: "Expiring Soon",
    dotClass: "bg-amber-500 dark:bg-[#FFB21C]",
    getValue: (c: Contract[]) =>
      c.filter((x) => x.status === "Expiring soon").length,
  },
  {
    label: "Pending Renewal",
    dotClass: "bg-[#3E82F7]",
    getValue: (c: Contract[]) =>
      c.filter((x) => x.status === "Expiring soon").length,
  },
  {
    label: "Total Contracts",
    dotClass: "bg-[#ffffff]",
    getValue: (c: Contract[]) => c.length,
  },
];

export function ContractStatsCards({ contracts }: ContractStatsCardsProps) {
  return (
    <section className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
      {STAT_CARDS.map((card) => (
        <article
          key={card.label}
          className="min-h-[78px] min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-[#ffffff]/50 dark:bg-[#1D1A4180]/50 sm:min-h-[90px] sm:h-[107px]"
        >
          <div className="mb-2 flex items-start justify-between">
            <p className="pr-2 text-[13px] font-normal leading-snug text-slate-700 dark:text-[#FFFFFF] sm:text-[20px]">
              {card.label}
            </p>
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full sm:h-3 sm:w-3 ${card.dotClass}`}
            />
          </div>
          <p className="text-[28px] font-normal leading-none text-slate-900 sm:text-[34px] dark:text-white">
            {card.getValue(contracts)}
          </p>
        </article>
      ))}
    </section>
  );
}
