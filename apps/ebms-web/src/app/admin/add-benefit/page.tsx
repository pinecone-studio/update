"use client";

import Link from "next/link";
import { AddBenefitSkeleton } from "./_components/AddBenefitSkeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { BenefitCard, type BenefitStatus } from "@/app/_components/BenefitCard";
import { HrActiveBenefitsIcon } from "@/app/icons/hrActiveBenefits";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import AddBenefitsBuilderClient from "./new/AddBenefitsBuilderClient";
import type { BenefitFromCatalog, BenefitConfig } from "./_lib/types";
import {
  getClient,
  getApiErrorMessage,
  fetchBenefits,
  fetchConfigAndAttributes,
  deleteBenefitFromCatalog,
} from "./_lib/api";

function BenefitsAndRulePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusBenefitId = searchParams.get("focusBenefitId");
  const [catalogBenefits, setCatalogBenefits] = useState<BenefitFromCatalog[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [config, setConfig] = useState<Record<string, BenefitConfig>>({});
  const [error, setError] = useState<string | null>(null);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [highlightBenefitId, setHighlightBenefitId] = useState<string | null>(null);
  const [showAddBenefitModal, setShowAddBenefitModal] = useState(false);

  const loadAll = useCallback(async () => {
    setLoadingCatalog(true);
    setError(null);
    try {
      const client = getClient();
      const [benefits, conf] = await Promise.all([
        fetchBenefits(client),
        fetchConfigAndAttributes(client),
      ]);
      setCatalogBenefits(benefits);
      setConfig(conf.config);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setCatalogBenefits([]);
      setConfig({});
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!focusBenefitId || loadingCatalog) return;
    const target = document.getElementById(`benefit-card-${focusBenefitId}`);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightBenefitId(focusBenefitId);
    const timer = window.setTimeout(() => setHighlightBenefitId(null), 2200);
    return () => window.clearTimeout(timer);
  }, [focusBenefitId, loadingCatalog, catalogBenefits]);

  const toCardStatus = (benefit: BenefitFromCatalog): BenefitStatus => {
    const configuredRules = config[benefit.id]?.rules ?? [];
    if (configuredRules.length > 0) return "ACTIVE";
    return "ELIGIBLE";
  };

  const handleDelete = useCallback(async (benefitId: string, benefitName: string) => {
    const ok = window.confirm(`"${benefitName}" benefit-ийг устгах уу?`);
    if (!ok) return;
    setActionBusyId(benefitId);
    setError(null);
    try {
      await deleteBenefitFromCatalog(getClient(), benefitId);
      await loadAll();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setActionBusyId(null);
    }
  }, [loadAll]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-[#2C4264] dark:bg-[#1E293B]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Benefits&Rule</h1>
          <p className="mt-3 text-slate-600 dark:text-[#A7B6D3]">
            Таны үүсгэсэн бүх benefit энд харагдана.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddBenefitModal(true)}
          className="rounded-xl bg-[#2F66E8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3E82F7]"
        >
          + Add Benefits
        </button>
      </div>

      <section className="mt-8">
        {loadingCatalog ? (
          <AddBenefitSkeleton />
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
              const contractText = benefit.requiresContract
                ? "Contract required"
                : "No contract required";
              const benefitDescription =
                benefit.description?.trim() || `${benefit.category} benefit`;
              return (
                <div
                  key={benefit.id}
                  id={`benefit-card-${benefit.id}`}
                  className={`rounded-xl transition ${
                    highlightBenefitId === benefit.id
                      ? "ring-2 ring-[#2F66E8] ring-offset-2 ring-offset-transparent"
                      : ""
                  }`}
                >
                  <BenefitCard
                    benefitId={benefit.id}
                    category={benefit.category}
                    name={benefit.name}
                    description={benefitDescription}
                    subsidyPercentage={`${benefit.subsidyPercent}%`}
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
                            void handleDelete(benefit.id, benefit.name);
                          }}
                          disabled={actionBusyId === benefit.id}
                          className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-red-600 dark:border-[#4B5D83] dark:bg-[#334160] dark:text-[#D4DEEF] dark:hover:bg-[#3A4A6C] dark:hover:text-[#FCA5A5]"
                        >
                          {actionBusyId === benefit.id ? "..." : <FiTrash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showAddBenefitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close add benefit modal"
            onClick={() => setShowAddBenefitModal(false)}
            className="absolute inset-0 bg-[#020B1FCC] backdrop-blur-md"
          />
          <div className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-auto rounded-3xl">
            <AddBenefitsBuilderClient
              inModal
              compactCreateMode
              onClose={() => setShowAddBenefitModal(false)}
              onSaved={async () => {
                setShowAddBenefitModal(false);
                await loadAll();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function BenefitsAndRulePage() {
  return (
    <Suspense fallback={<AddBenefitSkeleton />}>
      <BenefitsAndRulePageContent />
    </Suspense>
  );
}
