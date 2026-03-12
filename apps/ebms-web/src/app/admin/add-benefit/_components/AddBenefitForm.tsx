'use client';

import type { AddBenefitFormState } from '../_lib/types';
import { BENEFIT_SUGGESTIONS } from '../_lib/constants';

const sectionClass = 'mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-[#334155] dark:bg-[#0F172A]';
const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-[#334155] dark:bg-[#1E293B] dark:text-white';
const labelClass = 'block text-sm text-slate-600 mb-1 dark:text-[#94A3B8]';

type Props = {
  form: AddBenefitFormState;
  onChange: (next: AddBenefitFormState) => void;
  onSubmit: () => void;
  creating: boolean;
  error: string | null;
  message: string | null;
  isEditMode?: boolean;
  hideSubmitButton?: boolean;
};

export function AddBenefitForm({
  form,
  onChange,
  onSubmit,
  creating,
  error,
  message,
  isEditMode = false,
  hideSubmitButton = false,
}: Props) {
  return (
    <section className={sectionClass}>
      <h2 className="text-xl font-medium text-slate-900 dark:text-white">
        {isEditMode ? "1. Benefit засварлах" : "1. Benefit нэмэх (зөвхөн D1)"}
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-[#94A3B8]">
        {isEditMode
          ? "Нэр, ангилал, хөнгөлөлтийн хувийг засварлаад хадгална."
          : "Нэр, ангилал, хөнгөлөлт, гэрээ шаардлагатай гэх мэтийг оруулаад D1 руу нэмнэ. Дүрмийг дараагийн хэсэгт тохируулна."}
      </p>

      {error && (
        <div className="mt-3 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-500/20 dark:border-red-500/50 dark:text-red-200">
          {error}
        </div>
      )}
      {message && (
        <div className="mt-3 rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-700 dark:bg-green-500/20 dark:border-green-500/50 dark:text-green-200">
          {message}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Нэр *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder="жишээ: Gym Pinefit"
          />
        </div>
        <div>
          <label className={labelClass}>Ангилал *</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            className={inputClass}
            placeholder="жишээ: wellness"
          />
        </div>
        <div>
          <label className={labelClass}>Хөнгөлөлтийн хувь (0–100)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.subsidyPercent ?? ''}
            onChange={(e) => onChange({ ...form, subsidyPercent: e.target.value ? Number(e.target.value) : 0 })}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="s1-requires-contract"
            checked={!!form.requiresContract}
            onChange={(e) => onChange({ ...form, requiresContract: e.target.checked })}
            className="rounded border-[#334155]"
          />
          <label htmlFor="s1-requires-contract" className="text-sm text-slate-600 dark:text-[#94A3B8]">
            Гэрээ шаардлагатай
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!hideSubmitButton && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={creating}
            className="rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white px-4 py-2 font-medium"
          >
            {creating
              ? "Хадгалж байна..."
              : isEditMode
                ? "Save"
                : "D1 руу нэмэх"}
          </button>
        )}
        {!isEditMode && (
          <button
            type="button"
            onClick={() => {
              const suggestion =
                BENEFIT_SUGGESTIONS[Math.floor(Math.random() * BENEFIT_SUGGESTIONS.length)];
              onChange({ ...form, ...suggestion });
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-300 dark:hover:bg-[#24364F]"
          >
            Suggest (field-үүдийг бөглөх)
          </button>
        )}
      </div>
    </section>
  );
}
