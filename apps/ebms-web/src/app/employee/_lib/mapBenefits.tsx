/** @format */

import type { ReactNode } from "react";
import type { MyBenefitEligibility } from "./types";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import {
  MdFitnessCenter,
  MdHealthAndSafety,
  MdLaptop,
  MdWorkspacePremium,
  MdDesignServices,
  MdHome,
  MdWork,
  MdTrendingUp,
} from "react-icons/md";

const CATEGORY_ICONS: Record<string, ReactNode> = {
  wellness: <MdFitnessCenter size={30} />,
  health: <MdHealthAndSafety size={30} />,
  equipment: <MdLaptop size={30} />,
  career: <MdWorkspacePremium size={30} />,
  tools: <MdDesignServices size={30} />,
  financial: <MdHome size={30} />,
  workplace: <MdWork size={30} />,
  performance: <MdTrendingUp size={30} />,
};

const DEFAULT_ICON = <MdFitnessCenter size={30} />;

function formatDateForDisplay(iso?: string | null): string | undefined {
  if (!iso?.trim()) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Map GraphQL myBenefits to BenefitCardProps (UI-д хэрэгтэй хэлбэр) */
export function mapMyBenefitsToCardProps(
  items: MyBenefitEligibility[],
): BenefitCardProps[] {
  return items.map((item) => {
    const b = item.benefit;
    const icon =
      CATEGORY_ICONS[b.category?.toLowerCase() ?? ""] ?? DEFAULT_ICON;
    const lockReason =
      item.status === "LOCKED"
        ? (item.ruleEvaluations?.find((r) => !r.passed)?.reason ??
          "Eligibility rules are not satisfied right now.")
        : undefined;
    const rejectReason =
      item.status === "REJECTED" && item.rejectedReason
        ? item.rejectedReason
        : undefined;
    const eligibilityRules =
      item.ruleEvaluations?.map((r) => ({
        rule: r.ruleType,
        passed: r.passed,
        detail: r.reason,
      })) ?? [];

    // Start/End date: benefit нэмэхэд тохируулсан хугацаанаас (contract эсвэл config)
    const rawStart =
      item.status === "ACTIVE"
        ? (item.effectiveDate ?? b.activeContract?.effectiveDate ?? undefined)
        : undefined;
    const rawEnd =
      item.status === "ACTIVE"
        ? (item.expiryDate ?? b.activeContract?.expiryDate ?? undefined)
        : undefined;
    const benefitStartDate = rawStart
      ? (formatDateForDisplay(rawStart) ?? rawStart)
      : undefined;
    const benefitEndDate = rawEnd
      ? (formatDateForDisplay(rawEnd) ?? rawEnd)
      : undefined;

    const uploadedContractRequestId = item.uploadedContractRequestId ?? undefined;

    const requestDeadline = b.requestDeadline ?? undefined;
    const usageLimitCount = b.usageLimitCount ?? undefined;
    const usageLimitPeriod = b.usageLimitPeriod ?? undefined;

    return {
      benefitId: b.id,
      category: b.category ?? "Benefit",
      name: b.name,
      description:
        b.description ??
        (b.requiresContract
          ? "Requires contract acceptance."
          : "Company benefit."),
      subsidyPercentage:
        b.subsidyPercent != null ? `${b.subsidyPercent}%` : undefined,
      vendorDetails: b.vendorName ?? undefined,
      eligibilityCriteria: eligibilityRules.length
        ? eligibilityRules.map((r) => r.rule).join(", ")
        : "See eligibility details.",
      contractLink: undefined,
      uploadedContractRequestId,
      benefitEndDate,
      benefitStartDate,
      requiresContract: b.requiresContract ?? false,
      requestDeadline,
      usageLimitCount,
      usageLimitPeriod,
      status: item.status as BenefitCardProps["status"],
      lockReason,
      rejectReason,
      overrideApplied: item.overrideApplied ?? false,
      overrideReason: item.overrideReason ?? undefined,
      pendingApprovalBy: item.pendingApprovalBy ?? undefined,
      eligibilityRules,
      icon,
      iconBgColor: "bg-[#334155]",
      iconColor: "text-[#94A3B8]",
    } as BenefitCardProps;
  });
}
