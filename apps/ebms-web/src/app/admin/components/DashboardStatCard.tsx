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
      className="flex h-[320px] w-[454px] flex-col rounded-2xl px-[54px] py-[48px] text-left shadow-lg ring-1 ring-white/10"
      style={{ background: bgStyle }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-10">
          <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center">
            {icon}
          </div>
          <p className="text-[24px] font-semibold text-[#FAFBFB]">{title}</p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[154px] font-normal leading-none text-[#EDF6FF]">{value}</p>
        </div>
      </div>
    </article>
  );
}
