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

const USAGE_PERIOD_OPTIONS = [
  { value: "", label: "—" },
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
      <div className="mt-3 flex flex-col gap-6">
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
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-medium text-slate-600 dark:text-[#94A3B8]">
            Хугацаа ба ашиглалт (Backend)
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className={labelClass}>Хүсэлт илгээх хугацаа (энэ өдрөөс хойш LOCKED)</label>
              <input
                type="date"
                value={form.requestDeadline ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    requestDeadline: e.target.value ?? undefined,
                  })
                }
                className={`${inputBase} w-full`}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                Хоосон бол хязгааргүй
              </p>
            </div>
            <div>
              <label className={labelClass}>Хугацаанд хэдэн удаа ашиглах</label>
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
                className={`${inputBase} w-20`}
              />
            </div>
            <div>
              <label className={labelClass}>Хугацаа: month | year</label>
              <select
                value={form.usageLimitPeriod ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    usageLimitPeriod: (e.target.value || "") as "month" | "year" | "",
                  })
                }
                className={`${inputBase} w-28`}
              >
                {USAGE_PERIOD_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
                Хоосон бол хязгааргүй
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
