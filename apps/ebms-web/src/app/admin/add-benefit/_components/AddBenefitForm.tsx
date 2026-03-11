'use client';

import type { AddBenefitFormState } from '../_lib/types';

const sectionClass = 'mt-8 rounded-xl border border-[#334155] bg-[#0F172A] p-6';
const inputClass = 'w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2 text-white';
const labelClass = 'block text-sm text-[#94A3B8] mb-1';

type Props = {
  form: AddBenefitFormState;
  onChange: (next: AddBenefitFormState) => void;
  onSubmit: () => void;
  creating: boolean;
  error: string | null;
  message: string | null;
};

export function AddBenefitForm({ form, onChange, onSubmit, creating, error, message }: Props) {
  return (
    <section className={sectionClass}>
      <h2 className="text-xl font-medium text-white">1. Benefit нэмэх (зөвхөн D1)</h2>
      <p className="mt-1 text-sm text-[#94A3B8]">
        Нэр, ангилал, хөнгөлөлт, гэрээ шаардлагатай гэх мэтийг оруулаад D1 руу нэмнэ. Дүрмийг дараагийн хэсэгт тохируулна.
      </p>

      {error && (
        <div className="mt-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="mt-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-2 text-sm">
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
          <label htmlFor="s1-requires-contract" className="text-sm text-[#94A3B8]">
            Гэрээ шаардлагатай
          </label>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={creating}
          className="rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white px-4 py-2 font-medium"
        >
          {creating ? 'D1 руу хадгалаж байна...' : 'D1 руу нэмэх'}
        </button>
      </div>
    </section>
  );
}
