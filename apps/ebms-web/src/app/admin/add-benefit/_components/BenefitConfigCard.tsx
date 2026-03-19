"use client";

import type { AddBenefitFormState } from "../_lib/types";

const cardClass =
  "rounded-xl border border-[rgba(185,189,255,0.24)] bg-[rgba(53,41,99,0.44)] p-4 backdrop-blur-[12px] sm:p-6";
const inputBase =
  "rounded-lg border border-[rgba(185,189,255,0.24)] bg-[rgba(31,22,57,0.7)] px-2 py-1.5 text-sm text-white placeholder:text-[#B7A9D9] outline-none focus:border-[#B18CFF]";
const labelClass = "block text-sm text-[#A7B6D3] mb-1";

const CATEGORY_OPTIONS = [
  { value: "wellness", label: "Wellness" },
  { value: "health", label: "Health" },
  { value: "equipment", label: "Equipment" },
  { value: "financial", label: "Financial" },
  { value: "career development", label: "Career Development" },
  { value: "flexibility", label: "Flexibility" },
];

const ACTIVE_PERIOD_UNITS: { value: "day" | "month" | "year"; label: string }[] = [
  { value: "day", label: "day" },
  { value: "month", label: "month" },
  { value: "year", label: "year" },
];

const EMPLOYEE_USAGE_PERIODS: { value: "7days" | "month" | "year" | ""; label: string }[] = [
  { value: "", label: "— No limit" },
  { value: "7days", label: "7 days" },
  { value: "month", label: "month" },
  { value: "year", label: "year" },
];

type Props = {
  form: AddBenefitFormState;
  onChange: (next: AddBenefitFormState) => void;
};

export function BenefitConfigCard({ form, onChange }: Props) {
  const subsidy = form.subsidyPercent ?? 0;

  return (
    <section className={cardClass}>
      <h2 className="text-base font-medium text-slate-900 dark:text-white sm:text-lg">
        Benefit Configuration
      </h2>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:gap-6">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="w-full max-w-[220px]">
            <label className={labelClass}>Category</label>
            <select
              value={(form.category ?? "").trim().toLowerCase() || "wellness"}
              onChange={(e) => onChange({ ...form, category: e.target.value })}
              className={`${inputBase} w-full`}
            >
              {CATEGORY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full min-w-0 max-w-[220px]">
            <h3 className="text-sm font-medium text-[#A7B6D3] mb-1.5">
              Financial Settings
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                value={subsidy}
                onChange={(e) =>
                  onChange({
                    ...form,
                    subsidyPercent: Number(e.target.value),
                  })
                }
                className="flex-1 h-2 min-w-0 cursor-pointer rounded-lg bg-[rgba(31,22,57,0.8)] accent-blue-500"
              />
              <div className="w-11 shrink-0 rounded border border-[rgba(185,189,255,0.24)] bg-[rgba(31,22,57,0.7)] px-2 py-1 text-center text-xs font-medium text-white">
                {subsidy}%
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex min-w-0 flex-col gap-1">
              <label className={labelClass}>
                Request Deadline
              </label>
              <input
                type="date"
                value={form.requestDeadline ?? ""}
                onChange={(e) =>
                  onChange({ ...form, requestDeadline: e.target.value || undefined })
                }
                className={`${inputBase} w-full min-w-0 sm:w-40`}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <label className={labelClass}>Active Period</label>
              <div className="flex min-w-0 items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={form.expiryDuration ?? 1}
                  onChange={(e) =>
                    onChange({
                      ...form,
                      expiryDuration: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  className={`${inputBase} w-16 shrink-0`}
                />
                <select
                  value={form.expiryUnit ?? "year"}
                  onChange={(e) =>
                    onChange({
                      ...form,
                      expiryUnit: e.target.value as "day" | "month" | "year",
                    })
                  }
                  className={`${inputBase} min-w-0 flex-1 sm:w-24`}
                >
                  {ACTIVE_PERIOD_UNITS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
              <label className={labelClass}>Employee Usage</label>
              <div className="flex min-w-0 items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={form.usageLimitCount ?? 1}
                  onChange={(e) =>
                    onChange({
                      ...form,
                      usageLimitCount: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  disabled={!form.usageLimitPeriod}
                  className={`${inputBase} w-16 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                <span className="shrink-0 text-sm text-[#A7B6D3]">per</span>
                <select
                  value={form.usageLimitPeriod ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...form,
                      usageLimitPeriod: (e.target.value || "") as "7days" | "month" | "year" | "",
                    })
                  }
                  className={`${inputBase} min-w-0 flex-1 sm:w-24`}
                >
                  {EMPLOYEE_USAGE_PERIODS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div> 
      </div>
    </section>
  );
}
