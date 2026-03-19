"use client";

import type { AddBenefitFormState } from "../_lib/types";

const cardClass =
  "rounded-xl border border-[rgba(185,189,255,0.24)] bg-[rgba(53,41,99,0.44)] p-6 backdrop-blur-[12px]";
const inputClass =
  "w-full rounded-lg border border-[rgba(185,189,255,0.24)] bg-[rgba(31,22,57,0.7)] px-3 py-2 text-white placeholder:text-[#B7A9D9] outline-none focus:border-[#B18CFF]";
const labelClass = "block text-sm text-[#A7B6D3] mb-1";

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
