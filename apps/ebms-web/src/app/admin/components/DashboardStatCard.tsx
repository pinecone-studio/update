"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const bgStyle =
    keyType === "employees"
      ? "rgba(225, 42, 251, 0.1)"
      : "rgba(1, 116, 138, 0.1)";
  const btnStyle =
    keyType === "employees"
      ? "rgba(79, 39, 84, 0.5)"
      : "rgba(1, 40, 36, 0.3)";
  const href =
    keyType === "employees"
      ? "/admin/employee-eligibility"
      : "/admin/add-benefit";

  return (
    <article
      className="flex h-[320px] w-[454px] flex-col rounded-2xl px-[54px] py-[48px] text-left shadow-lg ring-1 ring-white/10"
      style={{ background: bgStyle }}
    >
      <div className="flex flex-1 flex-col justify-between gap-6">
        <div className="flex items-center gap-10">
          <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-xl border border-white/50 text-white">
            {icon}
          </div>
          <p className="text-[24px] font-semibold text-[#FAFBFB]">{title}</p>
        </div>
        <div className="flex items-center justify-between gap-10">
          <button
            type="button"
            onClick={() => router.push(href)}
            className="shrink-0 rounded-lg border border-white/50 px-10 py-2.5 text-[24px] font-medium text-[#F2F3F3] transition hover:bg-[#4F2754]/70"
            style={{ background: btnStyle }}
          >
            Manage
          </button>
          <p className="text-[154px] font-normal leading-none text-[#EDF6FF]">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}
