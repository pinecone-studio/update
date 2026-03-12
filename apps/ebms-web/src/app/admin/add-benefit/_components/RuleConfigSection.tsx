'use client';

import type { BenefitFromCatalog, BenefitConfig, Rule } from '../_lib/types';
import { OPERATORS } from '../_lib/constants';

const sectionClass = 'mt-8 rounded-xl border border-[#334155] bg-[#0F172A] p-6';
const inputSm = 'rounded border border-[#334155] bg-[#0F172A] px-2 py-1.5 text-white text-sm';
const selectClass = 'w-full max-w-md rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2 text-white';
const EMPLOYMENT_STATUS_VALUES = ['active', 'leave', 'terminated', 'probation'] as const;
const RESPONSIBILITY_LEVEL_VALUES = [1, 2, 3] as const;
const OKR_SUBMITTED_VALUES = ['true', 'false'] as const;

type Props = {
  catalogBenefits: BenefitFromCatalog[];
  selectedBenefitId: string | null;
  onSelectBenefitId: (id: string | null) => void;
  rulesForSelected: BenefitConfig | null;
  attributes: string[];
  onUpdateRule: (ruleIndex: number, field: keyof Rule, value: string | number | boolean) => void;
  onAddRule: () => void;
  onRemoveRule: (ruleIndex: number) => void;
  onSave: () => void;
  loadingCatalog: boolean;
  loadingConfig: boolean;
  saving: boolean;
  error: string | null;
  message: string | null;
};

export function RuleConfigSection({
  catalogBenefits,
  selectedBenefitId,
  onSelectBenefitId,
  rulesForSelected,
  attributes,
  onUpdateRule,
  onAddRule,
  onRemoveRule,
  onSave,
  loadingCatalog,
  loadingConfig,
  saving,
  error,
  message,
}: Props) {
  return (
    <section className={sectionClass}>
      <h2 className="text-xl font-medium text-white">2. Дүрэм тохируулах</h2>
      <p className="mt-1 text-sm text-[#94A3B8]">
        D1-д байгаа benefit-ээс сонгоод eligibility дүрмээ нэмж, засна.
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

      <div className="mt-4">
        <label className="block text-sm text-[#94A3B8] mb-2">Benefit сонгох (D1-ээс)</label>
        {loadingCatalog ? (
          <p className="text-[#94A3B8] text-sm">Жагсаалт татаж байна...</p>
        ) : (
          <select
            value={selectedBenefitId ?? ''}
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

      {selectedBenefitId && rulesForSelected && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-[#94A3B8] mb-2">
            «{rulesForSelected.name || selectedBenefitId}» — eligibility дүрмүүд
          </h3>
          {(rulesForSelected.rules ?? []).map((rule, ri) => (
            <div key={ri} className="flex flex-wrap items-center gap-2 mb-2 p-2 rounded bg-[#1E293B]">
              <select
                value={rule.type}
                onChange={(e) => onUpdateRule(ri, 'type', e.target.value)}
                className={inputSm}
              >
                {attributes.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <select
                value={rule.operator}
                onChange={(e) => onUpdateRule(ri, 'operator', e.target.value)}
                className={inputSm}
              >
                {OPERATORS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {rule.type === 'employment_status' ? (
                <select
                  value={String(rule.value ?? 'active').toLowerCase()}
                  onChange={(e) => onUpdateRule(ri, 'value', e.target.value)}
                  className={`${inputSm} w-40`}
                >
                  {EMPLOYMENT_STATUS_VALUES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ) : rule.type === 'responsibility_level' || rule.type === 'attendance' ? (
                <select
                  value={Number(rule.value ?? 1)}
                  onChange={(e) => onUpdateRule(ri, 'value', Number(e.target.value))}
                  className={`${inputSm} w-24`}
                >
                  {RESPONSIBILITY_LEVEL_VALUES.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              ) : rule.type === 'okr_submitted' ? (
                <select
                  value={String(rule.value ?? 'false')}
                  onChange={(e) => onUpdateRule(ri, 'value', e.target.value === 'true')}
                  className={`${inputSm} w-28`}
                >
                  {OKR_SUBMITTED_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Утга"
                  value={typeof rule.value === 'boolean' ? (rule.value ? 'true' : 'false') : String(rule.value ?? '')}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === 'true') onUpdateRule(ri, 'value', true);
                    else if (v === 'false') onUpdateRule(ri, 'value', false);
                    else if (/^\d+$/.test(v)) onUpdateRule(ri, 'value', Number(v));
                    else onUpdateRule(ri, 'value', v);
                  }}
                  className={`${inputSm} w-24`}
                />
              )}
              <input
                type="text"
                placeholder="Алдааны мессеж (дүрэм давцаагүй үед)"
                value={rule.errorMessage ?? ''}
                onChange={(e) => onUpdateRule(ri, 'errorMessage', e.target.value)}
                className={`${inputSm} flex-1 min-w-[180px]`}
              />
              <button type="button" onClick={() => onRemoveRule(ri)} className="text-red-400 hover:text-red-300 text-sm">
                Устгах
              </button>
            </div>
          ))}
          <button type="button" onClick={onAddRule} className="mt-2 text-sm text-blue-400 hover:text-blue-300">
            + Дүрэм нэмэх
          </button>
          <div className="mt-4">
            <button
              type="button"
              onClick={onSave}
              disabled={saving || loadingConfig}
              className="rounded-lg bg-[#0E6B4F] hover:bg-[#0d5f45] disabled:opacity-50 text-white px-4 py-2 font-medium"
            >
              {saving ? 'Хадгалаж байна...' : 'Дүрмүүдийг хадгалах'}
            </button>
          </div>
        </div>
      )}

      {selectedBenefitId && !rulesForSelected && loadingConfig && (
        <p className="mt-4 text-sm text-[#94A3B8]">Дүрмийн config уншиж байна...</p>
      )}
    </section>
  );
}
