"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BenefitCard, type BenefitStatus } from "@/app/_components/BenefitCard";
import { HrActiveBenefitsIcon } from "@/app/icons/hrActiveBenefits";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { BenefitFromCatalog, BenefitConfig } from "./_lib/types";
import {
  getClient,
  getApiErrorMessage,
  fetchBenefits,
  fetchConfigAndAttributes,
} from "./_lib/api";

export default function BenefitsAndRulePage() {
  const router = useRouter();
  const [catalogBenefits, setCatalogBenefits] = useState<BenefitFromCatalog[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [config, setConfig] = useState<Record<string, BenefitConfig>>({});
  const [hiddenBenefitIds, setHiddenBenefitIds] = useState<string[]>([]);
  const [benefitEdits, setBenefitEdits] = useState<Record<
    string,
    {
      name: string;
      category: string;
      subsidyPercent: number;
      requiresContract: boolean;
    }
  >>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("admin_hidden_benefit_ids");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setHiddenBenefitIds(parsed.filter((v) => typeof v === "string"));
      }
    } catch {
      setHiddenBenefitIds([]);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("admin_benefit_edits");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setBenefitEdits(parsed);
      }
    } catch {
      setBenefitEdits({});
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoadingCatalog(true);
    setError(null);
    try {
      const client = getClient();
      const [benefits, conf] = await Promise.all([
        fetchBenefits(client),
        fetchConfigAndAttributes(client),
      ]);
      setCatalogBenefits(benefits.filter((b) => !hiddenBenefitIds.includes(b.id)));
      setConfig(conf.config);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setCatalogBenefits([]);
      setConfig({});
    } finally {
      setLoadingCatalog(false);
    }
  }, [hiddenBenefitIds]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const toCardStatus = (benefit: BenefitFromCatalog): BenefitStatus => {
    const configuredRules = config[benefit.id]?.rules ?? [];
    if (configuredRules.length > 0) return "ACTIVE";
    return "ELIGIBLE";
  };

  const handleDelete = useCallback((benefitId: string, benefitName: string) => {
    const ok = window.confirm(`"${benefitName}" benefit-ийг устгах уу?`);
    if (!ok) return;
    setCatalogBenefits((prev) => prev.filter((b) => b.id !== benefitId));
    setConfig((prev) => {
      const next = { ...prev };
      delete next[benefitId];
      return next;
    });
    setHiddenBenefitIds((prev) => {
      const next = prev.includes(benefitId) ? prev : [...prev, benefitId];
      window.localStorage.setItem("admin_hidden_benefit_ids", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-[#2C4264] dark:bg-[#1E293B]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Benefits&Rule</h1>
          <p className="mt-3 text-slate-600 dark:text-[#A7B6D3]">
            Таны үүсгэсэн бүх benefit энд харагдана.
          </p>
        </div>
        <Link
          href="/admin/add-benefit/new"
          className="rounded-xl bg-[#2F66E8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3E82F7]"
        >
          + Add Benefits
        </Link>
      </div>

      <section className="mt-8">
        {loadingCatalog ? (
          <p className="text-slate-600 dark:text-[#A7B6D3]">Benefit жагсаалт ачаалж байна...</p>
        ) : error ? (
          <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-600 dark:border-[#7F1D1D] dark:bg-[#2F1212] dark:text-[#FCA5A5]">
            {error}
          </p>
        ) : catalogBenefits.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-[#2C4264] dark:bg-[#0F172A] dark:text-[#A7B6D3]">
            Benefit алга байна. + Add Benefits товч дарж шинээр нэмнэ үү.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {catalogBenefits.map((benefit) => {
              const ruleCount = config[benefit.id]?.rules?.length ?? 0;
              const displayBenefit = benefitEdits[benefit.id]
                ? { ...benefit, ...benefitEdits[benefit.id] }
                : benefit;
              const contractText = displayBenefit.requiresContract
                ? "Contract required"
                : "No contract required";
              return (
                <BenefitCard
                  key={benefit.id}
                  benefitId={benefit.id}
                  category={displayBenefit.category}
                  name={displayBenefit.name}
                  description={`${displayBenefit.category} benefit`}
                  subsidyPercentage={`${displayBenefit.subsidyPercent}%`}
                  vendorDetails={contractText}
                  eligibilityCriteria={`${ruleCount} rule configured`}
                  status={toCardStatus(benefit)}
                  icon={<HrActiveBenefitsIcon />}
                  footerActions={
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        aria-label={`Edit ${benefit.name}`}
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/add-benefit/new?benefitId=${benefit.id}`);
                        }}
                        className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-800 dark:border-[#4B5D83] dark:bg-[#334160] dark:text-[#D4DEEF] dark:hover:bg-[#3A4A6C]"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${benefit.name}`}
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(benefit.id, benefit.name);
                        }}
                        className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-red-600 dark:border-[#4B5D83] dark:bg-[#334160] dark:text-[#D4DEEF] dark:hover:bg-[#3A4A6C] dark:hover:text-[#FCA5A5]"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
