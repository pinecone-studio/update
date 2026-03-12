"use client";

import Link from "next/link";
import { AddBenefitSkeleton } from "./_components/AddBenefitSkeleton";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BenefitCard, type BenefitStatus } from "@/app/_components/BenefitCard";
import { HrActiveBenefitsIcon } from "@/app/icons/hrActiveBenefits";
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
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [config, setConfig] = useState<Record<string, BenefitConfig>>({});
  const [error, setError] = useState<string | null>(null);

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

  const toCardStatus = (benefit: BenefitFromCatalog): BenefitStatus => {
    const configuredRules = config[benefit.id]?.rules ?? [];
    if (configuredRules.length > 0) return "ACTIVE";
    return "ELIGIBLE";
  };

  return (
    <div className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-white">Benefits&Rule</h1>
          <p className="mt-3 text-[#A7B6D3]">
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
          <AddBenefitSkeleton />
        ) : error ? (
          <p className="rounded-xl border border-[#7F1D1D] bg-[#2F1212] p-4 text-[#FCA5A5]">
            {error}
          </p>
        ) : catalogBenefits.length === 0 ? (
          <p className="rounded-xl border border-[#2C4264] bg-[#0F172A] p-4 text-[#A7B6D3]">
            Benefit алга байна. + Add Benefits товч дарж шинээр нэмнэ үү.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {catalogBenefits.map((benefit) => {
              const ruleCount = config[benefit.id]?.rules?.length ?? 0;
              const contractText = benefit.requiresContract
                ? "Contract required"
                : "No contract required";
              return (
                <BenefitCard
                  key={benefit.id}
                  benefitId={benefit.id}
                  category={benefit.category}
                  name={benefit.name}
                  description={`${benefit.category} benefit`}
                  subsidyPercentage={`${benefit.subsidyPercent}%`}
                  vendorDetails={contractText}
                  eligibilityCriteria={`${ruleCount} rule configured`}
                  status={toCardStatus(benefit)}
                  icon={<HrActiveBenefitsIcon />}
                  onClick={() =>
                    router.push(`/admin/add-benefit/new?benefitId=${benefit.id}`)
                  }
                  buttonText="Configure"
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
