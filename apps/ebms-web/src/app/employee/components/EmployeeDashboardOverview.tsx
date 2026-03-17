/** @format */

"use client";

import type { ReactNode } from "react";

export type EmployeeStatusFilter =
  | "ACTIVE"
  | "ELIGIBLE"
  | "PENDING"
  | "LOCKED"
  | "ALL";

type FilterItem = {
  key: Exclude<EmployeeStatusFilter, "ALL">;
  count: number;
  icon: ReactNode;
};

const FILTER_PILL_STYLES = {
  ACTIVE: {
    label: "Active",
    tone: "text-[#EAF1FF]",
    countTone: "text-[#AAB4D7]",
    iconWrap:
      "bg-[linear-gradient(180deg,rgba(63,175,143,0.72),rgba(39,122,104,0.72))] text-[#A5FFE7] border border-[#66d9bf66]",
    idle: "border-[0.6px] border-[#AAB4D766] bg-[linear-gradient(90deg,#2C2647_0%,#0F1421_100%)]",
    active:
      "border border-[#5FE7C780] bg-[linear-gradient(90deg,#2C2647_0%,#0F1421_100%)] shadow-[0_0_0_1px_rgba(95,231,199,0.25),0_0_24px_rgba(31,183,145,0.35)]",
  },
  ELIGIBLE: {
    label: "Eligible",
    tone: "text-[#EAF1FF]",
    countTone: "text-[#AAB4D7]",
    iconWrap:
      "bg-[linear-gradient(180deg,rgba(83,140,214,0.72),rgba(44,90,157,0.72))] text-[#A9CCFF] border border-[#79AAFF66]",
    idle: "border-[0.6px] border-[#AAB4D766] bg-[linear-gradient(90deg,#0F1421_0%,#2C2647_100%)]",
    active:
      "border border-[#7AB6FF80] bg-[linear-gradient(90deg,#0F1421_0%,#2C2647_100%)] shadow-[0_0_0_1px_rgba(122,182,255,0.25),0_0_24px_rgba(81,141,230,0.35)]",
  },
  PENDING: {
    label: "Pending",
    tone: "text-[#EAF1FF]",
    countTone: "text-[#AAB4D7]",
    iconWrap:
      "bg-[linear-gradient(180deg,rgba(167,107,49,0.72),rgba(119,74,33,0.72))] text-[#FF9D33] border border-[#FFB16B66]",
    idle: "border-[0.6px] border-[#AAB4D766] bg-[linear-gradient(90deg,#2C2647_0%,#0F1421_100%)]",
    active:
      "border border-[#FFBF6B80] bg-[linear-gradient(90deg,#2C2647_0%,#0F1421_100%)] shadow-[0_0_0_1px_rgba(255,191,107,0.25),0_0_24px_rgba(255,157,51,0.32)]",
  },
  LOCKED: {
    label: "Locked",
    tone: "text-[#EAF1FF]",
    countTone: "text-[#AAB4D7]",
    iconWrap:
      "bg-[linear-gradient(180deg,rgba(177,89,108,0.72),rgba(122,56,72,0.72))] text-[#FF6D88] border border-[#FF96A866]",
    idle: "border-[0.6px] border-[#AAB4D766] bg-[linear-gradient(90deg,#0F1421_0%,#2C2647_100%)]",
    active:
      "border border-[#FF9AB180] bg-[linear-gradient(90deg,#0F1421_0%,#2C2647_100%)] shadow-[0_0_0_1px_rgba(255,154,177,0.22),0_0_24px_rgba(255,109,136,0.3)]",
  },
} as const;

interface EmployeeDashboardOverviewProps {
  meName?: string;
  error?: string | null;
  activeCount: number;
  pendingCount: number;
  statusFilter: EmployeeStatusFilter;
  filterItems: FilterItem[];
  onToggleStatus: (key: Exclude<EmployeeStatusFilter, "ALL">) => void;
}

export function EmployeeDashboardOverview({
  meName,
  error,
  activeCount,
  pendingCount,
  statusFilter,
  filterItems,
  onToggleStatus,
}: EmployeeDashboardOverviewProps) {
  return (
    <section className="grid w-full min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_356px] lg:items-start lg:gap-8">
      <div className="min-w-0 max-w-[780px]">
        <div className="mb-8 flex flex-col sm:mb-10">
          <h1 className="text-[20px] font-semibold leading-[1.02] tracking-[-1.8px] text-white sm:text-[35px] sm:tracking-[-2.6px] letter-spacing-[-1px]">
            Welcome back, {meName ?? "..."}
          </h1>
          <p className="mt-3 max-w-[640px] text-[17px] font-normal leading-7 tracking-[-0.3px] text-white/62 sm:text-[20px] sm:tracking-[-0.45px]">
            You have {activeCount} active benefits and {pendingCount} pending
            requests
          </p>
          {error ? (
            <p className="mt-3 text-sm text-red-400">Error: {error}</p>
          ) : null}
        </div>

        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:overflow-visible">
          {filterItems.map((item) => {
            const styles = FILTER_PILL_STYLES[item.key];
            const isActive = statusFilter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onToggleStatus(item.key)}
                className={`inline-flex h-[38px] w-[160px] shrink-0 cursor-pointer items-center gap-[10px] rounded-[13px] border px-[8px] py-[6px] text-left transition-all duration-200 ${
                  isActive ? styles.active : styles.idle
                }`}
              >
                <span
                  className={`grid h-[26px] w-[26px] place-items-center rounded-[8px] ${styles.iconWrap}`}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[14px] leading-none font-medium tracking-[-0.2px] ${styles.tone}`}
                >
                  {styles.label}
                  <span className={`${styles.countTone} ml-2`}>
                    {item.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mr-[100px] mt-[24px] w-full">
        <div className="relative flex h-[220px] w-full overflow-hidden rounded-[24px] border border-white/30 p-6 shadow-[0_25px_50px_rgba(0,0,0,0.28)] sm:h-[260px] lg:h-[242px] lg:w-[356px]">
          <div className="z-10 flex flex-1 flex-col items-start justify-center text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 text-white/80">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-semibold tracking-[-0.2px]">
                Season 3 • Episode 1
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-[32px] font-semibold leading-[0.95] tracking-[-1.2px] text-white/95">
                PineQuest
              </h3>
              <p className="mt-2 text-[15px] font-semibold text-white/65">
                The dream chapter: Eternity
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center justify-start rounded-[15px] bg-white/6 pl-2 pr-6 py-2.5 text-left text-[18px] font-semibold text-white/95 transition hover:bg-white/12"
              >
                Update team
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute right-[-15px] bottom-[-14px] opacity-70">
            <img
              src="/Pinecone.png"
              alt="Pinecone shape"
              className="h-[150px] w-auto object-contain sm:h-[185px] lg:h-[172px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
