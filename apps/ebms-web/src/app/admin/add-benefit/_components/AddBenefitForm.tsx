"use client";

import { useEffect, useRef, useState } from "react";
import type { AddBenefitFormState } from "../_lib/types";
import { BENEFIT_SUGGESTIONS } from "../_lib/constants";

const sectionClass =
  "rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-[#334155] dark:bg-[#0F172A]";
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-[#334155] dark:bg-[#1E293B] dark:text-white";
const labelClass = "block text-sm text-slate-600 mb-1 dark:text-[#94A3B8]";
const CATEGORY_OPTIONS = [
  "wellness",
  "health",
  "equipment",
  "financial",
  "career development",
  "flexibility",
];

type Props = {
  form: AddBenefitFormState;
  onChange: (next: AddBenefitFormState) => void;
  onSubmit: () => void;
  creating: boolean;
  error: string | null;
  message: string | null;
  isEditMode?: boolean;
  hideSubmitButton?: boolean;
  className?: string;
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
  className = "",
}: Props) {
  const objectUrlRef = useRef<string | null>(null);
  const [useSuggestedDefaults, setUseSuggestedDefaults] = useState(false);
  const normalizedCategory = (form.category ?? "").trim().toLowerCase();
  const isPresetCategory = CATEGORY_OPTIONS.includes(normalizedCategory);
  const categorySelectValue = isPresetCategory ? normalizedCategory : "__other";

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isEditMode || !useSuggestedDefaults) return;
    const suggestion =
      BENEFIT_SUGGESTIONS[
        Math.floor(Math.random() * BENEFIT_SUGGESTIONS.length)
      ];
    onChange({
      ...form,
      ...suggestion,
      activeFromDate: form.activeFromDate,
    });
  }, [form, isEditMode, onChange, useSuggestedDefaults]);

  return (
    <section className={`${sectionClass} ${className}`.trim()}>
      <h2 className="text-base font-medium text-slate-900 dark:text-white sm:text-lg">
        {isEditMode ? "1. Benefit засварлах" : "1. Benefit нэмэх"}
      </h2>
      <p className="mt-1 text-xs text-slate-600 dark:text-[#94A3B8] sm:text-sm">
        {isEditMode
          ? "Нэр, ангилал, хөнгөлөлтийн хувийг засварлаад хадгална."
          : "Нэр, ангилал, хөнгөлөлтөө оруулаад доорх хэсэгт дүрмээ нэмнэ. Доорх Save товчоор benefit болон дүрмийг хамт хадгална."}
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

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>Нэр *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            className={`${inputClass} py-1.5`}
            placeholder="жишээ: Gym Pinefit"
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Тайлбар *</label>
          <textarea
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            className={`${inputClass} py-1.5`}
            rows={2}
            placeholder="Benefit-ийн дэлгэрэнгүй тайлбар"
          />
        </div>
        <div>
          <label className={labelClass}>Ангилал *</label>
          <select
            value={categorySelectValue}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "__other") {
                onChange({
                  ...form,
                  category: isPresetCategory ? "" : form.category,
                });
                return;
              }
              onChange({ ...form, category: value });
            }}
            className={`${inputClass} py-1.5`}
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            <option value="__other">Бусад...</option>
          </select>
          {!isPresetCategory && (
            <input
              type="text"
              value={form.category}
              onChange={(e) => onChange({ ...form, category: e.target.value })}
              className={`${inputClass} mt-2 py-1.5`}
              placeholder="Бусад ангилал бичнэ үү"
            />
          )}
        </div>
        <div>
          <label className={labelClass}>Хөнгөлөлтийн хувь (0–100)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.subsidyPercent ?? ""}
            onChange={(e) =>
              onChange({
                ...form,
                subsidyPercent: e.target.value ? Number(e.target.value) : 0,
              })
            }
            className={`${inputClass} py-1.5`}
          />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="s1-finance-check"
              checked={!!form.financeCheck}
              onChange={(e) =>
                onChange({ ...form, financeCheck: e.target.checked })
              }
              className="rounded border-[#334155]"
            />
            <label
              htmlFor="s1-finance-check"
              className="text-sm text-slate-600 dark:text-[#94A3B8]"
            >
              Finance Approval
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="s1-requires-contract"
              checked={!!form.requiresContract}
              onChange={(e) => {
                const checked = e.target.checked;
                if (!checked && objectUrlRef.current) {
                  URL.revokeObjectURL(objectUrlRef.current);
                  objectUrlRef.current = null;
                }
                onChange({
                  ...form,
                  requiresContract: checked,
                  contractNumber: checked ? form.contractNumber : "",
                  contractName: checked ? form.contractName : "",
                  contractFileName: checked ? form.contractFileName : "",
                  contractUrl: checked ? form.contractUrl : "",
                });
              }}
              className="rounded border-[#334155]"
            />
            <label
              htmlFor="s1-requires-contract"
              className="text-sm text-slate-600 dark:text-[#94A3B8]"
            >
              Requires Vendor Contract
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="s1-manager-approval"
              checked={!!form.managerApproval}
              onChange={(e) =>
                onChange({ ...form, managerApproval: e.target.checked })
              }
              className="rounded border-[#334155]"
            />
            <label
              htmlFor="s1-manager-approval"
              className="text-sm text-slate-600 dark:text-[#94A3B8]"
            >
              Manager Pre-Approval
            </label>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!hideSubmitButton && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={creating}
            className="rounded-lg bg-[#0057ADCC] px-4 py-2 font-medium text-white transition hover:bg-[#3E82F7] disabled:opacity-50"
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
                BENEFIT_SUGGESTIONS[
                  Math.floor(Math.random() * BENEFIT_SUGGESTIONS.length)
                ];
              onChange({ ...form, ...suggestion });
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-300 dark:hover:bg-[#24364F]"
          >
            Suggest (field-үүдийг бөглөх)
          </button>
        )}
      </div>
      {!isEditMode && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="checkbox"
            id="s1-use-suggested-defaults"
            checked={useSuggestedDefaults}
            onChange={(e) => setUseSuggestedDefaults(e.target.checked)}
            className="rounded border-[#334155]"
          />
          <label
            htmlFor="s1-use-suggested-defaults"
            className="text-sm text-slate-600 dark:text-[#94A3B8]"
          >
            Suggested default-уудыг автоматаар бөглөх
          </label>
        </div>
      )}
    </section>
  );
}
