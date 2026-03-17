"use client";

import { AddBenefitSkeleton } from "./_components/AddBenefitSkeleton";
import { BenefitsAndRuleHeader } from "./_components/BenefitsAndRuleHeader";
import { BenefitsCatalogSection } from "./_components/BenefitsCatalogSection";
import { AddBenefitModal } from "./_components/AddBenefitModal";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
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

  const handleDelete = useCallback(
    async (benefitId: string, benefitName: string) => {
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
    },
    [loadAll],
  );

  const handleEdit = useCallback(
    (benefitId: string) => {
      router.push(`/admin/add-benefit/new?benefitId=${benefitId}`);
    },
    [router],
  );

  return (
    <div className="p-8">
      <BenefitsAndRuleHeader onAddClick={() => setShowAddBenefitModal(true)} />

      <section className="mt-8">
        <BenefitsCatalogSection
          catalogBenefits={catalogBenefits}
          config={config}
          loadingCatalog={loadingCatalog}
          error={error}
          highlightBenefitId={highlightBenefitId}
          actionBusyId={actionBusyId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      {showAddBenefitModal && (
        <AddBenefitModal onClose={() => setShowAddBenefitModal(false)} onSaved={loadAll} />
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
