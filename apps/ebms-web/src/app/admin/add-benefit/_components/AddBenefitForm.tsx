"use client";

import { useEffect, useRef } from "react";
import type { AddBenefitFormState } from "../_lib/types";
import { BENEFIT_SUGGESTIONS } from "../_lib/constants";

const sectionClass =
  "mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-[#334155] dark:bg-[#0F172A]";
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
  const objectUrlRef = useRef<string | null>(null);
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
        <div className="md:col-span-2">
          <label className={labelClass}>Тайлбар *</label>
          <textarea
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
            className={inputClass}
            rows={3}
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
            className={inputClass}
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
              className={`${inputClass} mt-2`}
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
            className={inputClass}
          />
        </div>
        <div className="flex flex-wrap gap-4 ">
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
              className="rounded border-[#334155]"
            />
            <label
              className="text-sm text-slate-600 dark:text-[#94A3B8]"
            >
              Manager Pre-Approval
            </label>
          </div>
        </div>
      </div>

      {/* {form.requiresContract && (
        <div className="mt-4 rounded-lg border border-slate-300 bg-white p-4 dark:border-[#334155] dark:bg-[#1E293B]">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            Гэрээний мэдээлэл
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Гэрээний дугаар *</label>
              <input
                type="text"
                value={form.contractNumber}
                onChange={(e) =>
                  onChange({ ...form, contractNumber: e.target.value })
                }
                className={inputClass}
                placeholder="жишээ: CNT-2026-001"
              />
            </div>
            <div>
              <label className={labelClass}>Гэрээний нэр *</label>
              <input
                type="text"
                value={form.contractName}
                onChange={(e) =>
                  onChange({ ...form, contractName: e.target.value })
                }
                className={inputClass}
                placeholder="жишээ: PineFit Vendor Contract"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>Гэрээ upload *</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (objectUrlRef.current) {
                  URL.revokeObjectURL(objectUrlRef.current);
                }
                const nextUrl = URL.createObjectURL(file);
                objectUrlRef.current = nextUrl;
                onChange({
                  ...form,
                  contractFileName: file.name,
                  contractUrl: nextUrl,
                });
              }}
              className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-blue-700 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-200"
            />
          </div>

          {form.contractUrl ? (
            <div className="mt-3 rounded-lg border border-green-300 bg-green-50 p-3 text-sm dark:border-green-700/50 dark:bg-green-900/20">
              <p className="text-green-700 dark:text-green-300">
                Uploaded:{" "}
                <span className="font-medium">
                  {form.contractFileName || "Contract file"}
                </span>
              </p>
              <a
                href={form.contractUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block break-all text-blue-700 underline dark:text-blue-300"
              >
                {form.contractUrl}
              </a>
            </div> 
          ) : null}
        </div>
      )} */}

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
    </section>
  );
}
