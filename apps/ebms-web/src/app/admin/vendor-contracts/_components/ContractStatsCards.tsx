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
    dotClass: "bg-amber-500",
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
    dotClass: "bg-slate-400 dark:bg-white/80",
    getValue: (c: Contract[]) => c.length,
  },
];

export function ContractStatsCards({ contracts }: ContractStatsCardsProps) {
  return (
    <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARDS.map((card) => (
        <article
          key={card.label}
          className="h-[107px] min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-[rgba(38,38,38,1)] dark:bg-[rgba(13,94,85,0.1)]"
        >
          <div className="mb-2 flex items-start justify-between">
            <p className="text-[20px] font-normal text-slate-900 dark:text-[var(--text-primary)]">
              {card.label}
            </p>
            <span
              className={`mt-1 h-3 w-3 shrink-0 rounded-full ${card.dotClass}`}
            />
          </div>
          <p className="text-[34px] font-normal text-slate-900 dark:text-[var(--text-primary)]">
            {card.getValue(contracts)}
          </p>
        </article>
      ))}
    </section>
  );
}
