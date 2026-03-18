"use client";

import type { AddBenefitFormState } from "../_lib/types";

const cardClass =
  "rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-[#334155] dark:bg-[#0F172A]";
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-[#334155] dark:bg-[#1E293B] dark:text-white";
const labelClass = "block text-sm text-slate-600 mb-1 dark:text-[#94A3B8]";

type Props = {
  form: AddBenefitFormState;
  onChange: (next: AddBenefitFormState) => void;
};

export function BasicInformationSection({ form, onChange }: Props) {
  return (
    <section className={cardClass}>
      <h2 className="text-base font-medium text-slate-900 dark:text-white sm:text-lg">
        Basic Information
      </h2>
      <div className="mt-3 space-y-3">
        <div>
          <label className={labelClass}>Name*</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            className={`${inputClass} py-1.5`}
            placeholder="Digital Wellness"
          />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            className={`${inputClass} py-1.5`}
            rows={2}
            placeholder="Core benefit. No performance gates. Available to all active employees regardless of OKR or attendance status."
          />
        </div>
      </div>
    </section>
  );
}
