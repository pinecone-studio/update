/** @format */

"use client";

import { useState } from "react";
import { BenefitCard } from "@/app/_components/BenefitCard";
import { BenefitStatusModal } from "@/app/employee/components/BenefitStatusModal";
import { BenefitRequestSuccessModal } from "@/app/employee/components/BenefitRequestSuccessModal";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";

interface BenefitPortfolioProps {
  benefits: BenefitCardProps[];
  /** When provided, called when user clicks "Request benefit" on an ELIGIBLE benefit (e.g. to call requestBenefit API) */
  onRequestBenefit?: (
    benefit: BenefitCardProps,
  ) => boolean | void | Promise<boolean | void>;
  onViewContract?: (benefit: BenefitCardProps) => void | Promise<void>;
  /** When provided, called when user clicks "View uploaded contract" on ACTIVE benefit */
  onViewUploadedContract?: (requestId: string) => void | Promise<void>;
  /** Use single column layout (e.g. for sidebar) */
  compact?: boolean;
}

export function BenefitPortfolio({
  benefits,
  onRequestBenefit,
  onViewContract,
  onViewUploadedContract,
  compact,
}: BenefitPortfolioProps) {
  const [selectedBenefit, setSelectedBenefit] =
    useState<BenefitCardProps | null>(null);
  const [successBenefit, setSuccessBenefit] = useState<BenefitCardProps | null>(
    null,
  );

  const handleRequestBenefit = async (benefit: BenefitCardProps) => {
    if (onRequestBenefit) {
      const submitted = await onRequestBenefit(benefit);
      setSelectedBenefit(null);
      if (submitted !== false) {
        setSuccessBenefit(benefit);
      }
    } else {
      alert(
        `Request submitted for ${benefit.name}. You'll be notified when it's reviewed.`,
      );
      setSelectedBenefit(null);
    }
  };

  if (benefits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          No benefits match this filter.
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
          Try selecting a different status or view All benefits.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid w-full min-w-0 ${
          compact
            ? "grid-cols-1 gap-4 items-start"
            : "grid-cols-1 gap-4 items-stretch sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6"
        }`}
      >
        {benefits.map((benefit) => {
          const canRequest =
            benefit.status === "ELIGIBLE" || benefit.status === "REJECTED";
          return (
            <BenefitCard
              key={benefit.benefitId ?? benefit.name}
              {...benefit}
              compact={compact}
              onClick={() => {
                setSelectedBenefit(benefit);
              }}
              onRequestBenefit={
                canRequest ? () => handleRequestBenefit(benefit) : undefined
              }
              onViewUploadedContract={onViewUploadedContract}
            />
          );
        })}
      </div>
      <BenefitStatusModal
        benefit={selectedBenefit}
        onClose={() => {
          setSelectedBenefit(null);
        }}
        onRequestBenefit={onRequestBenefit ? handleRequestBenefit : undefined}
        onViewContract={onViewContract}
        onViewUploadedContract={onViewUploadedContract}
      />
      {successBenefit ? (
        <BenefitRequestSuccessModal
          benefitName={successBenefit.name}
          onClose={() => setSuccessBenefit(null)}
        />
      ) : null}
    </>
  );
}
