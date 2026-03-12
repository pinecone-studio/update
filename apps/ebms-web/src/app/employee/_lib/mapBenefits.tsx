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
	wellness: <MdFitnessCenter size={24} />,
	health: <MdHealthAndSafety size={24} />,
	equipment: <MdLaptop size={24} />,
	career: <MdWorkspacePremium size={24} />,
	tools: <MdDesignServices size={24} />,
	financial: <MdHome size={24} />,
	workplace: <MdWork size={24} />,
	performance: <MdTrendingUp size={24} />,
};

const DEFAULT_ICON = <MdFitnessCenter size={24} />;

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
		const eligibilityRules =
			item.ruleEvaluations?.map((r) => ({
				rule: r.ruleType,
				passed: r.passed,
				detail: r.reason,
			})) ?? [];

		const contractLink = b.activeContract?.id
			? `/employee/contracts/${b.activeContract.id}`
			: undefined;

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
			contractLink,
			status: item.status as BenefitCardProps["status"],
			lockReason,
			eligibilityRules,
			icon,
			iconBgColor: "bg-[#334155]",
			iconColor: "text-[#94A3B8]",
		} as BenefitCardProps;
	});
}
