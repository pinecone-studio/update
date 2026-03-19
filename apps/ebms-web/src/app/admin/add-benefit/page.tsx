"use client";

import { AddBenefitSkeleton } from "./_components/AddBenefitSkeleton";
import { BenefitsAndRuleHeader } from "./_components/BenefitsAndRuleHeader";
import { BenefitsCatalogSection } from "./_components/BenefitsCatalogSection";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";

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
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
      setConfirmDelete({ id: benefitId, name: benefitName });
    },
    [loadAll],
  );

  const confirmDeleteBenefit = useCallback(async () => {
    if (!confirmDelete) return;
    setActionBusyId(confirmDelete.id);
    setError(null);
    try {
      await deleteBenefitFromCatalog(getClient(), confirmDelete.id);
      await loadAll();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setActionBusyId(null);
      setConfirmDelete(null);
    }
  }, [confirmDelete, loadAll]);

  const handleEdit = useCallback(
    (benefitId: string) => {
      router.push(`/admin/add-benefit/new?benefitId=${benefitId}`);
    },
    [router],
  );

  const handleAddClick = useCallback(() => {
    router.push("/admin/add-benefit/new");
  }, [router]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <BenefitsAndRuleHeader onAddClick={handleAddClick} />

      <section className="mt-4 sm:mt-6 lg:mt-8">
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

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete benefit</AlertDialogTitle>
            <AlertDialogDescription>
              Та{" "}
              <span className="font-semibold text-white">
                "{confirmDelete?.name}"
              </span>{" "}
              benefit‑ийг устгах уу? Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border border-[#2B3B55] bg-[#121C2F] px-4 py-2 text-sm font-medium text-slate-200 hover:bg-[#1A263D] transition">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBenefit}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 transition"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
