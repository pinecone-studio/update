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
import {
  ERROR_MESSAGES,
  DEFAULT_FORM,
  getDefaultValueForRuleType,
  getDefaultOperatorForRuleType,
} from "../_lib/constants";
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
import { RuleConfigSection } from "../_components/RuleConfigSection";

type AddBenefitsBuilderClientProps = {
  inModal?: boolean;
  compactCreateMode?: boolean;
  onSaved?: () => void | Promise<void>;
  onClose?: () => void;
};

export default function AddBenefitsBuilderClient({
  inModal = false,
  compactCreateMode = false,
  onSaved,
  onClose,
}: AddBenefitsBuilderClientProps = {}) {
  const DRAFT_BENEFIT_ID = "__draft_new_benefit__";
  const router = useRouter();
  const searchParams = useSearchParams();
  const benefitIdFromQuery = searchParams.get("benefitId");
  const isEditMode = !!benefitIdFromQuery;

  const [form, setForm] = useState<AddBenefitFormState>(DEFAULT_FORM);
  const [creating, setCreating] = useState(false);

  const [catalogBenefits, setCatalogBenefits] = useState<BenefitFromCatalog[]>(
    [],
  );
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(
    null,
  );
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
        "role",
        "okr_submitted",
        "late_arrival_count",
        "responsibility_level",
        "tenure",
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
      description: target.description ?? "",
      category: target.category,
      benefitType: "core",
      subsidyPercent: target.subsidyPercent,
      financeCheck: cfg?.financeCheck ?? false,
      requiresContract: target.requiresContract,
      managerApproval: false,
      contractNumber: cfg?.contractNumber ?? "",
      contractName: cfg?.contractName ?? "",
      contractFileName: cfg?.contractFileName ?? "",
      contractUrl: cfg?.contractUrl ?? "",
    });
  }, [benefitIdFromQuery, catalogBenefits, config]);

  const selectedBenefit = catalogBenefits.find(
    (b) => b.id === selectedBenefitId,
  );
  const ruleTargetId = isEditMode ? selectedBenefitId : DRAFT_BENEFIT_ID;
  const rulesForSelected: BenefitConfig | null = isEditMode
    ? selectedBenefitId
      ? (config[selectedBenefitId] ?? {
          name: selectedBenefit?.name ?? "",
          description: selectedBenefit?.description ?? "",
          category: selectedBenefit?.category ?? "",
          rules: [],
        })
      : null
    : {
        ...(config[DRAFT_BENEFIT_ID] ?? { rules: [] }),
        name: form.name,
        description: form.description,
        category: form.category,
        subsidyPercent: form.subsidyPercent,
        financeCheck: form.financeCheck,
        requiresContract: form.requiresContract,
        contractNumber: form.contractNumber,
        contractName: form.contractName,
        contractFileName: form.contractFileName,
        contractUrl: form.contractUrl,
        rules: config[DRAFT_BENEFIT_ID]?.rules ?? [],
      };

  const updateRuleForSelected = useCallback(
    (
      ruleIndex: number,
      field: keyof Rule,
      value: string | number | boolean,
    ) => {
      if (!ruleTargetId) return;
      setConfig((prev) => {
        const benefit = prev[ruleTargetId] ?? {
          name: isEditMode ? (selectedBenefit?.name ?? "") : form.name,
          description: isEditMode
            ? (selectedBenefit?.description ?? "")
            : form.description,
          category: isEditMode
            ? (selectedBenefit?.category ?? "")
            : form.category,
          rules: [],
        };
        const rules = [...(benefit.rules ?? [])];
        rules[ruleIndex] = { ...rules[ruleIndex], [field]: value };
        return { ...prev, [ruleTargetId]: { ...benefit, rules } };
      });
    },
    [ruleTargetId, isEditMode, selectedBenefit, form],
  );

  const addRuleForSelected = useCallback(() => {
    if (!ruleTargetId) return;
    setConfig((prev) => {
      const benefit = prev[ruleTargetId] ?? {
        name: isEditMode ? (selectedBenefit?.name ?? "") : form.name,
        description: isEditMode
          ? (selectedBenefit?.description ?? "")
          : form.description,
        category: isEditMode
          ? (selectedBenefit?.category ?? "")
          : form.category,
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
      return { ...prev, [ruleTargetId]: { ...benefit, rules } };
    });
  }, [ruleTargetId, isEditMode, selectedBenefit, form]);

  const removeRuleForSelected = useCallback(
    (ruleIndex: number) => {
      if (!ruleTargetId) return;
      setConfig((prev) => {
        const benefit = prev[ruleTargetId];
        if (!benefit?.rules?.length) return prev;
        const rules = benefit.rules.filter((_, i) => i !== ruleIndex);
        return { ...prev, [ruleTargetId]: { ...benefit, rules } };
      });
    },
    [ruleTargetId],
  );

  const handleRuleTypeChange = useCallback(
    (ruleIndex: number, newType: string) => {
      if (!ruleTargetId) return;
      const defaultValue = getDefaultValueForRuleType(newType);
      const defaultOperator = getDefaultOperatorForRuleType(newType);
      const isStringField = newType === "employment_status" || newType === "role";
      setConfig((prev) => {
        const benefit = prev[ruleTargetId] ?? {
          name: isEditMode ? (selectedBenefit?.name ?? "") : form.name,
          description: isEditMode
            ? (selectedBenefit?.description ?? "")
            : form.description,
          category: isEditMode
            ? (selectedBenefit?.category ?? "")
            : form.category,
          rules: [],
        };
        const rules = [...(benefit.rules ?? [])];
        const existing = rules[ruleIndex] ?? {};
        rules[ruleIndex] = {
          ...existing,
          type: newType,
          value: defaultValue,
          operator: isStringField ? defaultOperator : (existing.operator ?? "eq"),
        };
        return { ...prev, [ruleTargetId]: { ...benefit, rules } };
      });
    },
    [ruleTargetId, isEditMode, selectedBenefit, form],
  );

  const handleSaveRules = useCallback(async () => {
    const activeBenefitId = isEditMode ? selectedBenefitId : DRAFT_BENEFIT_ID;
    if (!activeBenefitId) {
      setError2(ERROR_MESSAGES.SELECT_BENEFIT);
      return;
    }
    const benefitConfig = config[activeBenefitId];
    if (
      benefitConfig?.rules?.some((r) => String(r.value ?? "").trim() === "")
    ) {
      setError2(ERROR_MESSAGES.RULE_VALUE_REQUIRED);
      return;
    }
    setError2(null);
    setMessage2(null);
    setSaving(true);
    try {
      let payloadConfig = config;

      const name = form.name?.trim();
      const description = form.description?.trim();
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
      if (!description) {
        setError2("Тайлбар заавал бөглөнө үү.");
        return;
      }
      if (subsidy < 0 || subsidy > 100) {
        setError2(ERROR_MESSAGES.SUBSIDY_RANGE);
        return;
      }

      if (isEditMode && benefitIdFromQuery) {
        await updateBenefitInCatalog(getClient(), {
          id: benefitIdFromQuery,
          name,
          description,
          category,
          subsidyPercent: subsidy,
          requiresContract: form.requiresContract ?? false,
        });

        payloadConfig = {
          ...config,
          [benefitIdFromQuery]: {
            ...(config[benefitIdFromQuery] ?? {
              name,
              description,
              category,
              rules: [],
            }),
            name,
            description,
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
      } else {
        setCreating(true);
        const res = await getClient().request<{
          createBenefit: BenefitFromCatalog;
        }>(CREATE_BENEFIT, {
          input: {
            name,
            description,
            category,
            subsidyPercent: subsidy,
            requiresContract: form.requiresContract ?? false,
            rules: [],
          },
        });

        const { [DRAFT_BENEFIT_ID]: _draftBenefit, ...restConfig } = config;
        payloadConfig = {
          ...restConfig,
          [res.createBenefit.id]: {
            ...(config[DRAFT_BENEFIT_ID] ?? { rules: [] }),
            name,
            description,
            category,
            subsidyPercent: subsidy,
            financeCheck: form.financeCheck ?? false,
            requiresContract: form.requiresContract ?? false,
            contractNumber: form.contractNumber ?? "",
            contractName: form.contractName ?? "",
            contractFileName: form.contractFileName ?? "",
            contractUrl: form.contractUrl ?? "",
            rules: config[DRAFT_BENEFIT_ID]?.rules ?? [],
          },
        };
      }

      await getClient().request(UPDATE_CONFIG, {
        config: JSON.stringify({ benefits: payloadConfig }),
      });
      setMessage2(
        isEditMode
          ? "Сонгосон benefit-ийн дүрмүүд амжилттай хадгалагдлаа."
          : `"${name}" benefit болон дүрмүүд амжилттай хадгалагдлаа.`,
      );
      const focusId = isEditMode
        ? (selectedBenefitId ?? benefitIdFromQuery)
        : null;
      if (onSaved) {
        await onSaved();
      } else {
        router.push(
          focusId
            ? `/admin/add-benefit?focusBenefitId=${encodeURIComponent(focusId)}`
            : "/admin/add-benefit",
        );
      }
    } catch (e) {
      setError2(
        `${isEditMode ? ERROR_MESSAGES.CONFIG_SAVE : "Benefit хадгалах үед алдаа: "}${getApiErrorMessage(e)}`,
      );
    } finally {
      setCreating(false);
      setSaving(false);
    }
  }, [
    DRAFT_BENEFIT_ID,
    selectedBenefitId,
    config,
    isEditMode,
    router,
    benefitIdFromQuery,
    form,
    onSaved,
  ]);

  return (
    <div className="flex max-h-[calc(100vh-9.5rem)] flex-col rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 dark:border-[#2C4264] dark:bg-[#1E293B]">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
            Add Benefits
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-[#A7B6D3] sm:text-sm">
            Benefit шинээр нэмэх, мөн rule тохиргоо хийх хэсэг.
          </p>
        </div>
        {inModal ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-[#324A70] dark:text-[#C9D5EA] dark:hover:bg-[#24364F] dark:hover:text-white"
          >
            Close
          </button>
        ) : (
          <Link
            href="/admin/add-benefit"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-[#324A70] dark:text-[#C9D5EA] dark:hover:bg-[#24364F] dark:hover:text-white"
          >
            Back to Benefits&Rule
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AddBenefitForm
          form={form}
          onChange={setForm}
          onSubmit={() => {}}
          creating={creating}
          error={null}
          message={null}
          isEditMode={isEditMode}
          hideSubmitButton
        />

        <RuleConfigSection
          catalogBenefits={catalogBenefits}
          selectedBenefitId={ruleTargetId}
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
          hideBenefitSelector
          showCancelButton={isEditMode}
          onCancel={() => router.push("/admin/add-benefit")}
          saveButtonLabel={isEditMode ? "Save" : "Benefit хадгалах"}
          noTopMargin
        />
      </div>
    </div>
  );
}
