'use client';

import { useCallback, useEffect, useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

const GET_CONFIG = gql`
  query GetEligibilityRuleConfig {
    getEligibilityRuleConfig {
      config
    }
  }
`;

const GET_ATTRIBUTES = gql`
  query GetAvailableRuleAttributes {
    getAvailableRuleAttributes
  }
`;

const UPDATE_CONFIG = gql`
  mutation UpdateEligibilityRuleConfig($config: String!) {
    updateEligibilityRuleConfig(config: $config) {
      config
    }
  }
`;

const CREATE_BENEFIT = gql`
  mutation CreateBenefit($input: CreateBenefitInput!) {
    createBenefit(input: $input) {
      id
      name
      category
      subsidyPercent
      requiresContract
    }
  }
`;

type Rule = {
  type: string;
  operator: string;
  value: string | number | boolean;
  errorMessage?: string;
};

type BenefitConfig = {
  name: string;
  category: string;
  subsidyPercent?: number;
  requiresContract?: boolean;
  rules: Rule[];
};

type BenefitsConfig = Record<string, BenefitConfig>;

const OPERATORS = [
  { value: 'eq', label: 'Equals (eq)' },
  { value: 'lt', label: 'Less than (lt)' },
  { value: 'lte', label: 'Less or equal (lte)' },
  { value: 'gte', label: 'Greater or equal (gte)' },
  { value: 'gt', label: 'Greater than (gt)' },
];

const defaultNewBenefit = {
  name: '',
  category: 'wellness',
  subsidyPercent: 0,
  requiresContract: false,
  rules: [] as Rule[],
};

function getErrorMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'response' in e) {
    const res = (e as { response?: { errors?: Array<{ message?: string }> } }).response;
    const msg = res?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

export default function RulesConfigurationPage() {
  const [config, setConfig] = useState<BenefitsConfig>({});
  const [attributes, setAttributes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBenefit, setNewBenefit] = useState<typeof defaultNewBenefit>(defaultNewBenefit);

  const getClient = useCallback(() => {
    const client = new GraphQLClient(`${API_URL}/graphql`, {
      headers: {
        'x-employee-id': 'admin',
        'x-role': 'admin',
      },
    });
    return client;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = getClient();
      const [configRes, attrsRes] = await Promise.all([
        client.request<{ getEligibilityRuleConfig: { config: string } }>(GET_CONFIG),
        client.request<{ getAvailableRuleAttributes: string[] }>(GET_ATTRIBUTES),
      ]);
      const parsed = JSON.parse(configRes.getEligibilityRuleConfig.config || '{}');
      setConfig(parsed.benefits ?? {});
      setAttributes(attrsRes.getAvailableRuleAttributes ?? []);
    } catch (e) {
      setError(getErrorMessage(e));
      setConfig({});
      setAttributes(['employment_status', 'okr_submitted', 'attendance', 'responsibility_level']);
    } finally {
      setLoading(false);
    }
  }, [getClient]);

  useEffect(() => {
    load();
  }, [load]);

  const updateBenefit = (key: string, field: keyof BenefitConfig, value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] ?? { name: '', category: '', rules: [] }),
        [field]: value,
      },
    }));
  };

  const updateRule = (benefitKey: string, ruleIndex: number, field: keyof Rule, value: string | number | boolean) => {
    setConfig((prev) => {
      const benefit = prev[benefitKey] ?? { name: '', category: '', rules: [] };
      const rules = [...(benefit.rules ?? [])];
      rules[ruleIndex] = { ...rules[ruleIndex], [field]: value };
      return { ...prev, [benefitKey]: { ...benefit, rules } };
    });
  };

  const addRule = (benefitKey: string) => {
    setConfig((prev) => {
      const benefit = prev[benefitKey] ?? { name: '', category: '', rules: [] };
      const rules = [...(benefit.rules ?? []), { type: 'employment_status', operator: 'eq', value: 'active', errorMessage: '' }];
      return { ...prev, [benefitKey]: { ...benefit, rules } };
    });
  };

  const removeRule = (benefitKey: string, ruleIndex: number) => {
    setConfig((prev) => {
      const benefit = prev[benefitKey];
      if (!benefit?.rules?.length) return prev;
      const rules = benefit.rules.filter((_, i) => i !== ruleIndex);
      return { ...prev, [benefitKey]: { ...benefit, rules } };
    });
  };

  const openAddBenefitForm = () => {
    setShowAddForm(true);
    setNewBenefit({ ...defaultNewBenefit });
    setError(null);
    setMessage(null);
  };

  const closeAddBenefitForm = () => {
    setShowAddForm(false);
    setNewBenefit({ ...defaultNewBenefit });
  };

  const updateNewBenefitRule = (ruleIndex: number, field: keyof Rule, value: string | number | boolean) => {
    setNewBenefit((prev) => {
      const rules = [...(prev.rules ?? [])];
      rules[ruleIndex] = { ...rules[ruleIndex], [field]: value };
      return { ...prev, rules };
    });
  };

  const addNewBenefitRule = () => {
    setNewBenefit((prev) => ({
      ...prev,
      rules: [...(prev.rules ?? []), { type: 'employment_status', operator: 'eq', value: 'active', errorMessage: '' }],
    }));
  };

  const removeNewBenefitRule = (ruleIndex: number) => {
    setNewBenefit((prev) => ({
      ...prev,
      rules: (prev.rules ?? []).filter((_, i) => i !== ruleIndex),
    }));
  };

  const handleCreateBenefit = async () => {
    const name = newBenefit.name?.trim();
    const category = newBenefit.category?.trim();
    if (!name || !category) {
      setError('Name and category are required.');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const client = getClient();
      await client.request<{ createBenefit: { id: string } }>(CREATE_BENEFIT, {
        input: {
          name,
          category,
          subsidyPercent: newBenefit.subsidyPercent ?? 0,
          requiresContract: newBenefit.requiresContract ?? false,
          rules: (newBenefit.rules ?? []).map((r) => ({
            type: r.type,
            operator: r.operator,
            value: String(r.value),
            errorMessage: r.errorMessage || undefined,
          })),
        },
      });
      setMessage('Benefit created and added to rules config.');
      closeAddBenefitForm();
      await load();
    } catch (e) {
      setError(`Failed to create benefit: ${getErrorMessage(e)}`);
    } finally {
      setCreating(false);
    }
  };

  const removeBenefit = (key: string) => {
    setConfig((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const client = getClient();
      const payload = JSON.stringify({ benefits: config });
      await client.request<{ updateEligibilityRuleConfig: { config: string } }>(UPDATE_CONFIG, { config: payload });
      setMessage('Eligibility rules saved successfully.');
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-8">
        <h1 className="text-3xl font-semibold text-white">Rules Configuration</h1>
        <p className="mt-4 text-[#A7B6D3]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-8">
      <h1 className="text-3xl font-semibold text-white">Rules Configuration</h1>
      <p className="mt-3 text-[#A7B6D3]">
        Configure benefit eligibility rules. HR can update without code deployment.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2">
          {error}
        </div>
      )}
      {message && (
        <div className="mt-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-2">
          {message}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {showAddForm && (
          <div className="rounded-xl border-2 border-dashed border-[#475569] bg-[#0F172A] p-5">
            <h2 className="text-lg font-medium text-white mb-4">Create new benefit (catalog + rules)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-[#94A3B8] mb-1">Name *</label>
                <input
                  type="text"
                  value={newBenefit.name}
                  onChange={(e) => setNewBenefit((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2 text-white"
                  placeholder="e.g. Gym Pinefit"
                />
              </div>
              <div>
                <label className="block text-sm text-[#94A3B8] mb-1">Category *</label>
                <input
                  type="text"
                  value={newBenefit.category}
                  onChange={(e) => setNewBenefit((p) => ({ ...p, category: e.target.value }))}
                  className="w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2 text-white"
                  placeholder="e.g. wellness"
                />
              </div>
              <div>
                <label className="block text-sm text-[#94A3B8] mb-1">Subsidy %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newBenefit.subsidyPercent ?? ''}
                  onChange={(e) => setNewBenefit((p) => ({ ...p, subsidyPercent: e.target.value ? Number(e.target.value) : 0 }))}
                  className="w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2 text-white"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="new-requires-contract"
                  checked={!!newBenefit.requiresContract}
                  onChange={(e) => setNewBenefit((p) => ({ ...p, requiresContract: e.target.checked }))}
                  className="rounded border-[#334155]"
                />
                <label htmlFor="new-requires-contract" className="text-sm text-[#94A3B8]">Requires contract</label>
              </div>
            </div>
            <h3 className="text-sm font-medium text-[#94A3B8] mt-4 mb-2">Eligibility rules (optional)</h3>
            {(newBenefit.rules ?? []).map((rule, ri) => (
              <div key={ri} className="flex flex-wrap items-center gap-2 mb-2 p-2 rounded bg-[#1E293B]">
                <select
                  value={rule.type}
                  onChange={(e) => updateNewBenefitRule(ri, 'type', e.target.value)}
                  className="rounded border border-[#334155] bg-[#0F172A] px-2 py-1.5 text-white text-sm"
                >
                  {attributes.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <select
                  value={rule.operator}
                  onChange={(e) => updateNewBenefitRule(ri, 'operator', e.target.value)}
                  className="rounded border border-[#334155] bg-[#0F172A] px-2 py-1.5 text-white text-sm"
                >
                  {OPERATORS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Value"
                  value={typeof rule.value === 'boolean' ? (rule.value ? 'true' : 'false') : String(rule.value ?? '')}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === 'true') updateNewBenefitRule(ri, 'value', true);
                    else if (v === 'false') updateNewBenefitRule(ri, 'value', false);
                    else if (/^\d+$/.test(v)) updateNewBenefitRule(ri, 'value', Number(v));
                    else updateNewBenefitRule(ri, 'value', v);
                  }}
                  className="rounded border border-[#334155] bg-[#0F172A] px-2 py-1.5 text-white text-sm w-24"
                />
                <input
                  type="text"
                  placeholder="Error message"
                  value={rule.errorMessage ?? ''}
                  onChange={(e) => updateNewBenefitRule(ri, 'errorMessage', e.target.value)}
                  className="flex-1 min-w-[160px] rounded border border-[#334155] bg-[#0F172A] px-2 py-1.5 text-white text-sm"
                />
                <button type="button" onClick={() => removeNewBenefitRule(ri)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addNewBenefitRule} className="mt-2 text-sm text-blue-400 hover:text-blue-300">+ Add rule</button>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleCreateBenefit}
                disabled={creating}
                className="rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white px-4 py-2 font-medium"
              >
                {creating ? 'Creating...' : 'Create benefit'}
              </button>
              <button
                type="button"
                onClick={closeAddBenefitForm}
                className="rounded-lg border border-[#334155] text-[#94A3B8] hover:text-white px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {Object.keys(config).length === 0 && !showAddForm && (
          <div className="rounded-xl border border-[#334155] bg-[#0F172A] p-6 text-center text-[#94A3B8]">
            No benefits in rules config yet. Click &quot;+ Add benefit&quot; to create one (adds to catalog and rules).
          </div>
        )}

        {Object.entries(config).map(([benefitKey, benefit]) => (
          <div
            key={benefitKey}
            className="rounded-xl border border-[#334155] bg-[#0F172A] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-white">{benefit.name || benefitKey}</h2>
              <button
                type="button"
                onClick={() => removeBenefit(benefitKey)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Remove benefit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-[#94A3B8] mb-1">Name</label>
                <input
                  type="text"
                  value={benefit.name ?? ''}
                  onChange={(e) => updateBenefit(benefitKey, 'name', e.target.value)}
                  className="w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-[#94A3B8] mb-1">Category</label>
                <input
                  type="text"
                  value={benefit.category ?? ''}
                  onChange={(e) => updateBenefit(benefitKey, 'category', e.target.value)}
                  className="w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-[#94A3B8] mb-1">Subsidy %</label>
                <input
                  type="number"
                  value={benefit.subsidyPercent ?? ''}
                  onChange={(e) => updateBenefit(benefitKey, 'subsidyPercent', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full rounded-lg border border-[#334155] bg-[#1E293B] px-3 py-2 text-white"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id={`contract-${benefitKey}`}
                  checked={!!benefit.requiresContract}
                  onChange={(e) => updateBenefit(benefitKey, 'requiresContract', e.target.checked)}
                  className="rounded border-[#334155]"
                />
                <label htmlFor={`contract-${benefitKey}`} className="text-sm text-[#94A3B8]">
                  Requires contract
                </label>
              </div>
            </div>

            <h3 className="text-sm font-medium text-[#94A3B8] mt-4 mb-2">Rules</h3>
            {(benefit.rules ?? []).map((rule, ri) => (
              <div key={ri} className="flex flex-wrap items-center gap-2 mb-2 p-2 rounded bg-[#1E293B]">
                <select
                  value={rule.type}
                  onChange={(e) => updateRule(benefitKey, ri, 'type', e.target.value)}
                  className="rounded border border-[#334155] bg-[#0F172A] px-2 py-1.5 text-white text-sm"
                >
                  {attributes.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <select
                  value={rule.operator}
                  onChange={(e) => updateRule(benefitKey, ri, 'operator', e.target.value)}
                  className="rounded border border-[#334155] bg-[#0F172A] px-2 py-1.5 text-white text-sm"
                >
                  {OPERATORS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Value"
                  value={typeof rule.value === 'boolean' ? (rule.value ? 'true' : 'false') : String(rule.value ?? '')}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === 'true') updateRule(benefitKey, ri, 'value', true);
                    else if (v === 'false') updateRule(benefitKey, ri, 'value', false);
                    else if (/^\d+$/.test(v)) updateRule(benefitKey, ri, 'value', Number(v));
                    else updateRule(benefitKey, ri, 'value', v);
                  }}
                  className="rounded border border-[#334155] bg-[#0F172A] px-2 py-1.5 text-white text-sm w-24"
                />
                <input
                  type="text"
                  placeholder="Error message"
                  value={rule.errorMessage ?? ''}
                  onChange={(e) => updateRule(benefitKey, ri, 'errorMessage', e.target.value)}
                  className="flex-1 min-w-[160px] rounded border border-[#334155] bg-[#0F172A] px-2 py-1.5 text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeRule(benefitKey, ri)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addRule(benefitKey)}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              + Add rule
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={showAddForm ? closeAddBenefitForm : openAddBenefitForm}
          className="rounded-xl border border-dashed border-[#475569] text-[#94A3B8] py-3 hover:border-[#64748B] hover:text-white"
        >
          {showAddForm ? 'Cancel new benefit' : '+ Add benefit (create in catalog + rules)'}
        </button>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white px-6 py-2.5 font-medium"
        >
          {saving ? 'Saving...' : 'Save all changes'}
        </button>
      </div>
    </div>
  );
}
