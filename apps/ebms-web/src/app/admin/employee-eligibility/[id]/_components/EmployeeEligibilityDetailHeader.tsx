"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "@/app/icons/back";

type EmployeeEligibilityDetailHeaderProps = {
  employeeName: string;
  employeeRole: string;
};

export function EmployeeEligibilityDetailHeader({
  employeeName,
  employeeRole,
}: EmployeeEligibilityDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-[42px] flex items-start justify-between gap-[22px]">
      <button
        type="button"
        onClick={() => router.push("/admin/employee-eligibility")}
        aria-label="Back"
        className="mt-[6px] inline-flex h-[74px] w-[74px] items-center justify-center rounded-[16px] border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-[#35527A] dark:bg-[#FFFFFF1A] dark:text-white/88 dark:hover:bg-[rgba(40,58,92,0.92)]"
      >
        <BackIcon />
      </button>

      <div className="flex flex-col justify-end">
        <h1 className="text-[58px] font-normal leading-[1.02] tracking-[-0.04em] text-slate-900 dark:text-white">
          {employeeName}
        </h1>
        <p className="mt-[12px] text-[27px] font-normal tracking-[-0.02em] text-slate-600 dark:text-white/48">
          Role <span className="text-slate-700 dark:text-[#9AA8AB]">: {employeeRole}</span>
        </p>
      </div>
    </div>
  );
}
