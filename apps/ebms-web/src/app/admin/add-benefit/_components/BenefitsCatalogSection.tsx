"use client";

import { HrActiveBenefitsIcon } from "@/app/icons/hrActiveBenefits";
import { AdminBenefitCard } from "./AdminBenefitCard";
import { AddBenefitSkeleton } from "./AddBenefitSkeleton";
import { getBenefitTone, getVendorDisplay } from "../_lib/utils";
import type { BenefitFromCatalog, BenefitConfig } from "../_lib/types";

type BenefitsCatalogSectionProps = {
  catalogBenefits: BenefitFromCatalog[];
  config: Record<string, BenefitConfig>;
  loadingCatalog: boolean;
  error: string | null;
  highlightBenefitId: string | null;
  actionBusyId: string | null;
  onEdit: (benefitId: string) => void;
  onDelete: (benefitId: string, benefitName: string) => void;
};

export function BenefitsCatalogSection({
  catalogBenefits,
  config,
  loadingCatalog,
  error,
  highlightBenefitId,
  actionBusyId,
  onEdit,
  onDelete,
}: BenefitsCatalogSectionProps) {
  if (loadingCatalog) return <AddBenefitSkeleton />;

  if (error) {
    return (
      <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-600 dark:border-[#7F1D1D] dark:bg-[#2F1212] dark:text-[#FCA5A5]">
        {error}
      </p>
    );
  }

  if (catalogBenefits.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-[#2C4264] dark:bg-[#0F172A] dark:text-[#A7B6D3]">
        Benefit алга байна. + Add Benefits товч дарж шинээр нэмнэ үү.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {catalogBenefits.map((benefit) => {
        const ruleCount = config[benefit.id]?.rules?.length ?? 0;
        const tone = getBenefitTone(benefit.category);
        const vendorDisplay = getVendorDisplay(benefit.name);
        const ruleSummary =
          ruleCount > 0 ? `${ruleCount} rule configured` : "";
        return (
          <AdminBenefitCard
            key={benefit.id}
            id={benefit.id}
            name={benefit.name}
            category={benefit.category}
            subsidyPercent={benefit.subsidyPercent}
            vendorDisplay={vendorDisplay}
            ruleSummary={ruleSummary}
            icon={<HrActiveBenefitsIcon />}
            iconBgClass={tone.iconBg}
            iconColorClass={tone.iconColor}
            isHighlighted={highlightBenefitId === benefit.id}
            onEdit={() => onEdit(benefit.id)}
            onDelete={() => void onDelete(benefit.id, benefit.name)}
            isDeleting={actionBusyId === benefit.id}
          />
        );
      })}
    </div>
  );
}
