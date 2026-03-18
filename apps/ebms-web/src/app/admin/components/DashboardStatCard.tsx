"use client";

import type { ReactNode } from "react";

type DashboardStatCardProps = {
  keyType: "employees" | "benefits";
  title: string;
  value: string;
  icon: ReactNode;
};

export function DashboardStatCard({
  keyType,
  title,
  value,
  icon,
}: DashboardStatCardProps) {
  const bgStyle =
    keyType === "employees"
      ? "rgba(225, 42, 251, 0.1)"
      : "rgba(1, 116, 138, 0.1)";

  return (
    <article
      className="flex w-full min-h-[240px] flex-col rounded-2xl px-6 py-6 text-left shadow-lg ring-1 ring-white/10 sm:min-h-[280px] sm:px-8 sm:py-8 lg:h-[320px] lg:w-[454px] lg:px-[54px] lg:py-[48px]"
      style={{ background: bgStyle }}
    >
      <div className="flex flex-1 flex-col justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-4 sm:gap-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/50 text-white sm:h-[64px] sm:w-[64px]">
            {icon}
          </div>
          <p className="text-lg font-semibold text-[#FAFBFB] sm:text-[24px]">{title}</p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[154px] font-normal leading-none text-[#EDF6FF]">{value}</p>
        </div>
      </div>
    </article>
  );
}
