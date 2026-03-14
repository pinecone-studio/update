"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type {
  BenefitFromCatalog,
  BenefitConfig,
  Rule,
  AddBenefitFormState,
} from "../_lib/types";
import { ERROR_MESSAGES, DEFAULT_FORM } from "../_lib/constants";
import {
  getClient,
  getApiErrorMessage,
  fetchBenefits,
  fetchConfigAndAttributes,
  CREATE_BENEFIT,
  UPDATE_CONFIG,
  updateBenefitInCatalog,
} from "../_lib/api";
import { AddBenefitForm } from "../_components/AddBenefitForm";
import { BenefitCatalogTable } from "../_components/BenefitCatalogTable";
import { RuleConfigSection } from "../_components/RuleConfigSection";

export default function AddBenefitsBuilderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const benefitIdFromQuery = searchParams.get("benefitId");
  const isEditMode = !!benefitIdFromQuery;

  const [form, setForm] = useState<AddBenefitFormState>(DEFAULT_FORM);
  const [creating, setCreating] = useState(false);
  const [error1, setError1] = useState<string | null>(null);
  const [message1, setMessage1] = useState<string | null>(null);

  const [catalogBenefits, setCatalogBenefits] = useState<BenefitFromCatalog[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null);
  const [config, setConfig] = useState<Record<string, BenefitConfig>>({});
  const [attributes, setAttributes] = useState<string[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error2, setError2] = useState<string | null>(null);
  const [message2, setMessage2] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    setError2(null);
    try {
      const list = await fetchBenefits(getClient());
      setCatalogBenefits(list);
    } catch (e) {
      setError2(ERROR_MESSAGES.BENEFITS_LOAD + getApiErrorMessage(e));
      setCatalogBenefits([]);
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  const loadConfigAndAttributes = useCallback(async () => {
    setLoadingConfig(true);
    setError2(null);
    try {
      const { config: nextConfig, attributes: nextAttrs } =
        await fetchConfigAndAttributes(getClient());
      setConfig(nextConfig);
      setAttributes(nextAttrs);
    } catch (e) {
      setError2(ERROR_MESSAGES.CONFIG_LOAD + getApiErrorMessage(e));
      setConfig({});
      setAttributes([
        "employment_status",
        "okr_submitted",
        "attendance",
        "responsibility_level",
      ]);
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    loadConfigAndAttributes();
  }, [loadConfigAndAttributes]);

  useEffect(() => {
    if (!benefitIdFromQuery) return;
    const exists = catalogBenefits.some((b) => b.id === benefitIdFromQuery);
    if (exists) setSelectedBenefitId(benefitIdFromQuery);
  }, [benefitIdFromQuery, catalogBenefits]);

  useEffect(() => {
    if (!benefitIdFromQuery) return;
    const target = catalogBenefits.find((b) => b.id === benefitIdFromQuery);
    if (!target) return;
    const cfg = config[benefitIdFromQuery];
    setForm({
      name: target.name,
      category: target.category,
      subsidyPercent: target.subsidyPercent,
      financeCheck: cfg?.financeCheck ?? false,
      requiresContract: target.requiresContract,
      contractNumber: cfg?.contractNumber ?? "",
      contractName: cfg?.contractName ?? "",
      contractFileName: cfg?.contractFileName ?? "",
      contractUrl: cfg?.contractUrl ?? "",
    });
  }, [benefitIdFromQuery, catalogBenefits, config]);

  const handleCreateBenefit = useCallback(async () => {
    const name = form.name?.trim();
    const category = form.category?.trim();
    setError1(null);
    setMessage1(null);

    if (!name) {
      setError1(ERROR_MESSAGES.NAME_REQUIRED);
      return;
    }
    if (!category) {
      setError1(ERROR_MESSAGES.CATEGORY_REQUIRED);
      return;
    }
    const subsidy = form.subsidyPercent ?? 0;
    if (subsidy < 0 || subsidy > 100) {
      setError1(ERROR_MESSAGES.SUBSIDY_RANGE);
      return;
    }
    if (form.requiresContract) {
      if (!form.financeCheck) {
        setError1(ERROR_MESSAGES.FINANCE_CHECK_REQUIRED);
        return;
      }
      if (!form.contractNumber.trim()) {
        setError1(ERROR_MESSAGES.CONTRACT_NUMBER_REQUIRED);
        return;
      }
      if (!form.contractName.trim()) {
        setError1(ERROR_MESSAGES.CONTRACT_NAME_REQUIRED);
        return;
      }
      if (!form.contractUrl.trim()) {
        setError1(ERROR_MESSAGES.CONTRACT_FILE_REQUIRED);
        return;
      }
    }

    if (isEditMode && benefitIdFromQuery) return;

    setCreating(true);
    try {
      await getClient().request(CREATE_BENEFIT, {
        input: {
          name,
          category,
          subsidyPercent: subsidy,
          requiresContract: form.requiresContract ?? false,
          rules: [],
        },
      });
      setMessage1(
        `"${name}" D1-д амжилттай нэмэгдлээ. Доорх "Дүрэм тохируулах" хэсгээс дүрмээ тохируулна уу.`,
      );
      setForm(DEFAULT_FORM);
      await Promise.all([loadCatalog(), loadConfigAndAttributes()]);
    } catch (e) {
      setError1(ERROR_MESSAGES.D1_CREATE + getApiErrorMessage(e));
    } finally {
      setCreating(false);
    }
  }, [
    benefitIdFromQuery,
    form,
    isEditMode,
    loadCatalog,
    loadConfigAndAttributes,
  ]);

  const selectedBenefit = catalogBenefits.find((b) => b.id === selectedBenefitId);
  const rulesForSelected: BenefitConfig | null = selectedBenefitId
    ? (config[selectedBenefitId] ?? {
        name: selectedBenefit?.name ?? "",
        category: selectedBenefit?.category ?? "",
        rules: [],
      })
    : null;

  const updateRuleForSelected = useCallback(
    (ruleIndex: number, field: keyof Rule, value: string | number | boolean) => {
      if (!selectedBenefitId) return;
      setConfig((prev) => {
        const benefit = prev[selectedBenefitId] ?? {
          name: selectedBenefit?.name ?? "",
          category: selectedBenefit?.category ?? "",
          rules: [],
        };
        const rules = [...(benefit.rules ?? [])];
        rules[ruleIndex] = { ...rules[ruleIndex], [field]: value };
        return { ...prev, [selectedBenefitId]: { ...benefit, rules } };
      });
    },
    [selectedBenefitId, selectedBenefit],
  );

  const addRuleForSelected = useCallback(() => {
    if (!selectedBenefitId) return;
    setConfig((prev) => {
      const benefit = prev[selectedBenefitId] ?? {
        name: selectedBenefit?.name ?? "",
        category: selectedBenefit?.category ?? "",
        rules: [],
      };
      const rules = [
        ...(benefit.rules ?? []),
        {
          type: "employment_status",
          operator: "eq",
          value: "active",
          errorMessage: "",
        },
      ];
      return { ...prev, [selectedBenefitId]: { ...benefit, rules } };
    });
  }, [selectedBenefitId, selectedBenefit]);

  const removeRuleForSelected = useCallback(
    (ruleIndex: number) => {
      if (!selectedBenefitId) return;
      setConfig((prev) => {
        const benefit = prev[selectedBenefitId];
        if (!benefit?.rules?.length) return prev;
        const rules = benefit.rules.filter((_, i) => i !== ruleIndex);
        return { ...prev, [selectedBenefitId]: { ...benefit, rules } };
      });
    },
    [selectedBenefitId],
  );

  const handleSaveRules = useCallback(async () => {
    if (!selectedBenefitId) {
      setError2(ERROR_MESSAGES.SELECT_BENEFIT);
      return;
    }
    const benefitConfig = config[selectedBenefitId];
    if (benefitConfig?.rules?.some((r) => String(r.value ?? "").trim() === "")) {
      setError2(ERROR_MESSAGES.RULE_VALUE_REQUIRED);
      return;
    }
    setError2(null);
    setMessage2(null);
    setSaving(true);
    try {
      let payloadConfig = config;

      if (isEditMode && benefitIdFromQuery) {
        const name = form.name?.trim();
        const category = form.category?.trim();
        const subsidy = form.subsidyPercent ?? 0;
        if (!name) {
          setError2(ERROR_MESSAGES.NAME_REQUIRED);
          return;
        }
        if (!category) {
          setError2(ERROR_MESSAGES.CATEGORY_REQUIRED);
          return;
        }
        if (subsidy < 0 || subsidy > 100) {
          setError2(ERROR_MESSAGES.SUBSIDY_RANGE);
          return;
        }
        if (form.requiresContract) {
          if (!form.financeCheck) {
            setError2(ERROR_MESSAGES.FINANCE_CHECK_REQUIRED);
            return;
          }
          if (!form.contractNumber.trim()) {
            setError2(ERROR_MESSAGES.CONTRACT_NUMBER_REQUIRED);
            return;
          }
          if (!form.contractName.trim()) {
            setError2(ERROR_MESSAGES.CONTRACT_NAME_REQUIRED);
            return;
          }
          if (!form.contractUrl.trim()) {
            setError2(ERROR_MESSAGES.CONTRACT_FILE_REQUIRED);
            return;
          }
        }

        await updateBenefitInCatalog(getClient(), {
          id: benefitIdFromQuery,
          name,
          category,
          subsidyPercent: subsidy,
          requiresContract: form.requiresContract ?? false,
        });

        payloadConfig = {
          ...config,
          [benefitIdFromQuery]: {
            ...(config[benefitIdFromQuery] ?? { name, category, rules: [] }),
            name,
            category,
            subsidyPercent: subsidy,
            financeCheck: form.financeCheck ?? false,
            requiresContract: form.requiresContract ?? false,
            contractNumber: form.contractNumber ?? "",
            contractName: form.contractName ?? "",
            contractFileName: form.contractFileName ?? "",
            contractUrl: form.contractUrl ?? "",
          },
        };
      }

      await getClient().request(UPDATE_CONFIG, {
        config: JSON.stringify({ benefits: payloadConfig }),
      });
      setMessage2("Сонгосон benefit-ийн дүрмүүд амжилттай хадгалагдлаа.");
      const focusId = selectedBenefitId ?? benefitIdFromQuery;
      router.push(
        focusId
          ? `/admin/add-benefit?focusBenefitId=${encodeURIComponent(focusId)}`
          : "/admin/add-benefit"
      );
    } catch (e) {
      setError2(ERROR_MESSAGES.CONFIG_SAVE + getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }, [
    selectedBenefitId,
    config,
    isEditMode,
    router,
    benefitIdFromQuery,
    form,
  ]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-[#2C4264] dark:bg-[#1E293B]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Add Benefits</h1>
          <p className="mt-2 text-slate-600 dark:text-[#A7B6D3]">
            Benefit шинээр нэмэх, мөн rule тохиргоо хийх хэсэг.
          </p>
        </div>
        <Link
          href="/admin/add-benefit"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-[#324A70] dark:text-[#C9D5EA] dark:hover:bg-[#24364F] dark:hover:text-white"
        >
          Back to Benefits&Rule
        </Link>
      </div>

      <AddBenefitForm
        form={form}
        onChange={setForm}
        onSubmit={handleCreateBenefit}
        creating={creating}
        error={error1}
        message={message1}
        isEditMode={isEditMode}
        hideSubmitButton={isEditMode}
      />

      {!isEditMode && (
        <BenefitCatalogTable
          benefits={catalogBenefits}
          loading={loadingCatalog}
          onRefresh={loadCatalog}
        />
      )}

      <RuleConfigSection
        catalogBenefits={catalogBenefits}
        selectedBenefitId={selectedBenefitId}
        onSelectBenefitId={setSelectedBenefitId}
        rulesForSelected={rulesForSelected}
        attributes={attributes}
        onUpdateRule={updateRuleForSelected}
        onAddRule={addRuleForSelected}
        onRemoveRule={removeRuleForSelected}
        onSave={handleSaveRules}
        loadingCatalog={loadingCatalog}
        loadingConfig={loadingConfig}
        saving={saving}
        error={error2}
        message={message2}
        hideBenefitSelector={isEditMode}
        showCancelButton={isEditMode}
        onCancel={() => router.push("/admin/add-benefit")}
        saveButtonLabel={isEditMode ? "Save" : "Дүрмүүдийг хадгалах"}
      />
    </div>
  );
}
