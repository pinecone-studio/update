"use client";

import type { BenefitFromCatalog, BenefitConfig, Rule } from "../_lib/types";
import {
  OPERATORS,
  OPERATORS_STRING,
  ROLE_VALUES,
  getDefaultValueForRuleType,
} from "../_lib/constants";

const sectionBaseClass =
  "rounded-xl border border-[rgba(185,189,255,0.24)] bg-[rgba(53,41,99,0.44)] p-6 backdrop-blur-[12px]";
const inputSm =
  "rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-900 text-sm dark:border-[#334155] dark:bg-[#0F172A] dark:text-white";
const selectClass =
  "w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-[#334155] dark:bg-[#1E293B] dark:text-white";
const EMPLOYMENT_STATUS_VALUES = [
  "active",
  "leave",
  "terminated",
  "probation",
] as const;
const RESPONSIBILITY_LEVEL_VALUES = [1, 2, 3] as const;
const LATE_ARRIVAL_COUNT_VALUES = [0, 1, 2, 3, 4, 5, 6] as const;
const OKR_SUBMITTED_VALUES = ["true", "false"] as const;
const DEFAULT_TENURE_DAYS = 180;

type Props = {
  catalogBenefits: BenefitFromCatalog[];
  selectedBenefitId: string | null;
  onSelectBenefitId: (id: string | null) => void;
  rulesForSelected: BenefitConfig | null;
  attributes: string[];
  onUpdateRule: (
    ruleIndex: number,
    field: keyof Rule,
    value: string | number | boolean,
  ) => void;
  onRuleTypeChange?: (ruleIndex: number, newType: string) => void;
  onAddRule: () => void;
  onRemoveRule: (ruleIndex: number) => void;
  onSave: () => void;
  loadingCatalog: boolean;
  loadingConfig: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
  hideSaveButton?: boolean;
  hideBenefitSelector?: boolean;
  saveButtonLabel?: string;
  showCancelButton?: boolean;
  onCancel?: () => void;
  noTopMargin?: boolean;
  className?: string;
};

export function RuleConfigSection({
  catalogBenefits,
  selectedBenefitId,
  onSelectBenefitId,
  rulesForSelected,
  attributes,
  onUpdateRule,
  onRuleTypeChange,
  onAddRule,
  onRemoveRule,
  onSave,
  loadingCatalog,
  loadingConfig,
  saving,
  error,
  message,
  hideSaveButton = false,
  hideBenefitSelector = false,
  saveButtonLabel = "Дүрмүүдийг хадгалах",
  showCancelButton = false,
  onCancel,
  noTopMargin = false,
  className = "",
}: Props) {
  const sectionClass = noTopMargin ? sectionBaseClass : `mt-8 ${sectionBaseClass}`;
  const normalizedAttributes = Array.from(
    new Set(
      attributes.map((a) => (a === "attendance" ? "late_arrival_count" : a)),
    ),
  );
  if (!normalizedAttributes.includes("tenure")) {
    normalizedAttributes.push("tenure");
  }

  return (
    <section className={`${sectionClass} ${className}`.trim()}>
      <h2 className="text-base font-medium text-slate-900 dark:text-white sm:text-lg">
        2. Дүрэм тохируулах
      </h2>
      <p className="mt-1 text-xs text-slate-600 dark:text-[#94A3B8] sm:text-sm">
        D1-д байгаа benefit-ээс сонгоод eligibility дүрмээ нэмж, засна.
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

      {!hideBenefitSelector && (
        <div className="mt-4">
          <label className="block text-sm text-slate-600 mb-2 dark:text-[#94A3B8]">
            Benefit сонгох (D1-ээс)
          </label>
          {loadingCatalog ? (
            <p className="text-slate-600 text-sm dark:text-[#94A3B8]">
              Жагсаалт татаж байна...
            </p>
          ) : (
            <select
              value={selectedBenefitId ?? ""}
              onChange={(e) => onSelectBenefitId(e.target.value || null)}
              className={selectClass}
            >
              <option value="">— Benefit сонгоно уу —</option>
              {catalogBenefits.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.category})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {selectedBenefitId && rulesForSelected && (
        <div className="mt-3">
          <h3 className="text-sm font-medium text-slate-600 mb-2 dark:text-[#94A3B8]">
            «{rulesForSelected.name || selectedBenefitId}» — eligibility дүрмүүд
          </h3>
          <div className="pr-1">
            {(rulesForSelected.rules ?? []).map((rule, ri) => (
              <div
                key={ri}
                className="mb-2 flex flex-wrap items-center gap-2 rounded bg-slate-100 px-2 py-1.5 dark:bg-[#1E293B]"
              >
                {/** Backward compatibility: existing `attendance` rules are treated as `late_arrival_count`. */}
                {(() => {
                  const ruleType =
                    rule.type === "attendance"
                      ? "late_arrival_count"
                      : rule.type;
                  return (
                    <>
                      <select
                        value={ruleType}
                        onChange={(e) => {
                          const newType = e.target.value;
                          if (onRuleTypeChange) {
                            onRuleTypeChange(ri, newType);
                          } else {
                            onUpdateRule(ri, "type", newType);
                          }
                        }}
                        className={inputSm}
                      >
                        {normalizedAttributes.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                      <select
                        value={rule.operator}
                        onChange={(e) =>
                          onUpdateRule(ri, "operator", e.target.value)
                        }
                        className={inputSm}
                      >
                        {(ruleType === "employment_status" ||
                        ruleType === "role"
                          ? OPERATORS_STRING
                          : OPERATORS
                        ).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      {ruleType === "employment_status" ? (
                        <select
                          value={String(rule.value ?? "active").toLowerCase()}
                          onChange={(e) =>
                            onUpdateRule(ri, "value", e.target.value)
                          }
                          className={`${inputSm} w-40`}
                        >
                          {EMPLOYMENT_STATUS_VALUES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : ruleType === "responsibility_level" ? (
                        <select
                          value={Number(rule.value ?? 1)}
                          onChange={(e) =>
                            onUpdateRule(ri, "value", Number(e.target.value))
                          }
                          className={`${inputSm} w-24`}
                        >
                          {RESPONSIBILITY_LEVEL_VALUES.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      ) : ruleType === "late_arrival_count" ? (
                        <select
                          value={Number(rule.value ?? 0)}
                          onChange={(e) =>
                            onUpdateRule(ri, "value", Number(e.target.value))
                          }
                          className={`${inputSm} w-24`}
                        >
                          {LATE_ARRIVAL_COUNT_VALUES.map((count) => (
                            <option key={count} value={count}>
                              {count}
                            </option>
                          ))}
                        </select>
                      ) : ruleType === "tenure" ? (
                        <input
                          type="number"
                          min={0}
                          placeholder="Хоног"
                          value={Math.max(
                            0,
                            Math.floor(Number(rule.value ?? DEFAULT_TENURE_DAYS) || 0),
                          )}
                          onChange={(e) => {
                            const v = Math.max(
                              0,
                              Math.floor(Number(e.target.value) || 0),
                            );
                            onUpdateRule(ri, "value", v);
                          }}
                          className={`${inputSm} w-24`}
                        />
                      ) : rule.type === "okr_submitted" ? (
                        <select
                          value={String(rule.value ?? "false")}
                          onChange={(e) =>
                            onUpdateRule(ri, "value", e.target.value === "true")
                          }
                          className={`${inputSm} w-28`}
                        >
                          {OKR_SUBMITTED_VALUES.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : ruleType === "role" ? (
                        <select
                          value={String(rule.value ?? "employee").toLowerCase()}
                          onChange={(e) =>
                            onUpdateRule(ri, "value", e.target.value)
                          }
                          className={`${inputSm} w-36`}
                        >
                          {ROLE_VALUES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="Утга"
                          value={
                            typeof rule.value === "boolean"
                              ? rule.value
                                ? "true"
                                : "false"
                              : String(rule.value ?? "")
                          }
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === "true") onUpdateRule(ri, "value", true);
                            else if (v === "false")
                              onUpdateRule(ri, "value", false);
                            else if (/^\d+$/.test(v))
                              onUpdateRule(ri, "value", Number(v));
                            else onUpdateRule(ri, "value", v);
                          }}
                          className={`${inputSm} w-24`}
                        />
                      )}
                      <input
                        type="text"
                        placeholder="Алдааны мессеж (дүрэм давцаагүй үед)"
                        value={rule.errorMessage ?? ""}
                        onChange={(e) =>
                          onUpdateRule(ri, "errorMessage", e.target.value)
                        }
                        className={`${inputSm} flex-1 min-w-[180px]`}
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveRule(ri)}
                        className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Устгах
                      </button>
                    </>
                  );
                })()}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onAddRule}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            + Дүрэм нэмэх
          </button>
          {!hideSaveButton && (
            <div className="mt-4 flex items-center gap-3">
              {showCancelButton && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#D1DBEF] dark:hover:bg-[#24364F]"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={onSave}
                disabled={saving || loadingConfig}
                className="rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white px-4 py-2 font-medium"
              >
                {saving ? "Хадгалж байна..." : saveButtonLabel}
              </button>
            </div>
          )}
        </div>
      )}

      {selectedBenefitId && !rulesForSelected && loadingConfig && (
        <p className="mt-4 text-sm text-slate-600 dark:text-[#94A3B8]">
          Дүрмийн config уншиж байна...
        </p>
      )}
    </section>
  );
}
