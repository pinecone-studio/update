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
import { BasicInformationSection } from "../_components/BasicInformationSection";
import { BenefitConfigCard } from "../_components/BenefitConfigCard";
import { ApprovalSettingsSection } from "../_components/ApprovalSettingsSection";
import { RuleConfigSectionTabs } from "../_components/RuleConfigSectionTabs";

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
    const deadline = target.requestDeadline?.trim();
    const usagePeriod =
      target.usageLimitPeriod?.toLowerCase() === "year"
        ? "year"
        : target.usageLimitPeriod?.toLowerCase() === "month"
          ? "month"
          : target.usageLimitPeriod?.toLowerCase() === "7days"
            ? "7days"
            : "";
    setForm({
      name: target.name,
      description: target.description ?? "",
      category: target.category,
      benefitType: "core",
      subsidyPercent: target.subsidyPercent,
      financeCheck: cfg?.financeCheck ?? false,
      requiresContract: target.requiresContract,
      managerApproval: cfg?.managerApproval ?? false,
      contractNumber: cfg?.contractNumber ?? "",
      contractName: cfg?.contractName ?? "",
      contractFileName: cfg?.contractFileName ?? "",
      contractUrl: cfg?.contractUrl ?? "",
      expiryDuration: cfg?.expiryDuration ?? 1,
      expiryUnit: (cfg?.expiryUnit as "day" | "month" | "year") ?? "year",
      usagePeriod: Math.max(1, cfg?.usagePeriod ?? 1),
      usagePeriodUnit: cfg?.usagePeriodUnit ?? "day",
      usageLimit: Math.max(1, cfg?.usageLimit ?? 1),
      requestDeadline: deadline || undefined,
      usageLimitCount: target.usageLimitCount ?? 1,
      usageLimitPeriod: usagePeriod as "7days" | "month" | "year" | "",
      activeFromDate: cfg?.activeFromDate ?? undefined,
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
        expiryDuration: form.expiryDuration ?? 1,
        expiryUnit: form.expiryUnit ?? "year",
        usagePeriod: Math.max(1, form.usagePeriod ?? 1),
        usagePeriodUnit: form.usagePeriodUnit ?? "day",
        usageLimit: Math.max(1, form.usageLimit ?? 1),
        activeFromDate: form.activeFromDate ?? undefined,
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
        const reqDeadline = form.requestDeadline?.trim() || null;
        const usageCount = form.usageLimitCount ?? 1;
        const usagePeriodVal =
          form.usageLimitPeriod === "month"
            ? "month"
            : form.usageLimitPeriod === "year"
              ? "year"
              : form.usageLimitPeriod === "7days"
                ? "7days"
                : null;
        await updateBenefitInCatalog(getClient(), {
          id: benefitIdFromQuery,
          name,
          description,
          category,
          subsidyPercent: subsidy,
          requiresContract: form.requiresContract ?? false,
          requestDeadline: reqDeadline,
          usageLimitCount: usageCount,
          usageLimitPeriod: usagePeriodVal,
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
            managerApproval: form.managerApproval ?? false,
            contractNumber: form.contractNumber ?? "",
            contractName: form.contractName ?? "",
            contractFileName: form.contractFileName ?? "",
            contractUrl: form.contractUrl ?? "",
            expiryDuration: form.expiryDuration ?? 1,
            expiryUnit: form.expiryUnit ?? "year",
            usagePeriod: Math.max(1, form.usagePeriod ?? 1),
            usagePeriodUnit: form.usagePeriodUnit ?? "day",
            usageLimit: Math.max(1, form.usageLimit ?? 1),
            activeFromDate: form.activeFromDate ?? undefined,
          },
        };
      } else {
        setCreating(true);
        const reqDeadline = form.requestDeadline?.trim() || null;
        const usageCount = form.usageLimitCount ?? 1;
        const usagePeriodVal =
          form.usageLimitPeriod === "month"
            ? "month"
            : form.usageLimitPeriod === "year"
              ? "year"
              : form.usageLimitPeriod === "7days"
                ? "7days"
                : null;
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
            requestDeadline: reqDeadline,
            usageLimitCount: usageCount,
            usageLimitPeriod: usagePeriodVal,
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
            managerApproval: form.managerApproval ?? false,
            contractNumber: form.contractNumber ?? "",
            contractName: form.contractName ?? "",
            contractFileName: form.contractFileName ?? "",
            contractUrl: form.contractUrl ?? "",
            expiryDuration: form.expiryDuration ?? 1,
            expiryUnit: form.expiryUnit ?? "year",
            usagePeriod: Math.max(1, form.usagePeriod ?? 1),
            usagePeriodUnit: form.usagePeriodUnit ?? "day",
            usageLimit: Math.max(1, form.usageLimit ?? 1),
            activeFromDate: form.activeFromDate ?? undefined,
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 pt-4 sm:p-6 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex shrink-0 items-start gap-4">
        {inModal ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/20 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Close
          </button>
        ) : (
          <Link
            href="/admin/add-benefit"
            className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/20 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            &larr; Back
          </Link>
        )}
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
          Add Benefit
        </h1>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        <BasicInformationSection form={form} onChange={setForm} />
        <BenefitConfigCard form={form} onChange={setForm} />
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <RuleConfigSectionTabs
            rulesForSelected={rulesForSelected}
            attributes={attributes}
            onUpdateRule={updateRuleForSelected}
            onRuleTypeChange={handleRuleTypeChange}
            onAddRule={addRuleForSelected}
            onRemoveRule={removeRuleForSelected}
            error={error2}
            message={message2}
          />
        </div>
        <div className="flex w-full shrink-0 lg:w-72 lg:max-w-[280px]">
          <ApprovalSettingsSection form={form} onChange={setForm} />
        </div>
      </div>

      <div className="mt-4 flex shrink-0 justify-end gap-3">
        <button
          type="button"
          onClick={() => (inModal ? onClose?.() : router.push("/admin/add-benefit"))}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-900 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveRules}
          disabled={saving || loadingConfig}
          className="rounded-lg bg-[#3B82F6] px-4 py-2 font-medium text-white hover:bg-[#2563EB] disabled:opacity-50"
        >
          {saving ? "Saved..." : "Save"}
        </button>
      </div>
    </div>
  );
}
