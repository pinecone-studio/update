"use client";

import type { AddBenefitFormState, ExpiryUnit } from "../_lib/types";

const cardClass =
  "rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-[#334155] dark:bg-[#0F172A]";
const inputBase =
  "rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 dark:border-[#334155] dark:bg-[#1E293B] dark:text-white";
const labelClass = "block text-sm text-slate-600 mb-1 dark:text-[#94A3B8]";

const CATEGORY_OPTIONS = [
  { value: "wellness", label: "Wellness" },
  { value: "health", label: "Health" },
  { value: "equipment", label: "Equipment" },
  { value: "financial", label: "Financial" },
  { value: "career development", label: "Career Development" },
  { value: "flexibility", label: "Flexibility" },
];

const EXPIRY_UNIT_OPTIONS: { value: ExpiryUnit; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
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
      <div className="mt-3 flex flex-row gap-12">
        <div className="flex flex-col gap-6">
          <div className="max-w-[180px]">
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
          <div className="max-w-[220px]">
            <h3 className="text-sm font-medium text-slate-600 dark:text-[#94A3B8] mb-1.5">
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
              className="flex-1 h-2 min-w-0 cursor-pointer rounded-lg bg-slate-200 dark:bg-[#1E293B] accent-blue-600"
            />
            <div className="w-11 shrink-0 rounded border border-slate-300 bg-slate-100 px-2 py-1 text-center text-xs font-medium text-slate-700 dark:border-[#334155] dark:bg-[#1E293B] dark:text-white">
              {subsidy}%
            </div>
          </div>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-4">
            <label className="min-w-[120px] text-sm text-slate-600 dark:text-[#94A3B8]">
              Validity Period
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={999}
                value={form.expiryDuration ?? 0}
                onChange={(e) =>
                  onChange({
                    ...form,
                    expiryDuration: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                placeholder="1"
                className={`${inputBase} w-14`}
              />
              <select
                value={form.expiryUnit ?? "month"}
                onChange={(e) =>
                  onChange({
                    ...form,
                    expiryUnit: e.target.value as ExpiryUnit,
                  })
                }
                className={`${inputBase} w-20`}
              >
                {EXPIRY_UNIT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="min-w-[120px] text-sm text-slate-600 dark:text-[#94A3B8]">
              Usage Frequency
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={999}
                value={form.usagePeriod ?? 1}
                onChange={(e) =>
                  onChange({
                    ...form,
                    usagePeriod: Math.max(1, Number(e.target.value) || 1),
                  })
                }
                placeholder="7"
                className={`${inputBase} w-14`}
              />
              <select
                value={form.usagePeriodUnit ?? "day"}
                onChange={(e) =>
                  onChange({
                    ...form,
                    usagePeriodUnit: e.target.value as ExpiryUnit,
                  })
                }
                className={`${inputBase} w-20`}
              >
                {EXPIRY_UNIT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500 dark:text-[#94A3B8]">per</span>
              <input
                type="number"
                min={1}
                max={999}
                value={form.usageLimit ?? 1}
                onChange={(e) =>
                  onChange({
                    ...form,
                    usageLimit: Math.max(1, Number(e.target.value) || 1),
                  })
                }
                placeholder="1"
                className={`${inputBase} w-14`}
              />
              <span className="text-xs text-slate-500 dark:text-[#94A3B8]">times</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
