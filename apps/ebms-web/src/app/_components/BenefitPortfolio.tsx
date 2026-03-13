/** @format */

"use client";

import { useState } from "react";
import { BenefitCard } from "@/app/_components/BenefitCard";
import { BenefitEligibilityModal } from "@/app/_components/BenefitEligibilityModal";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";

interface BenefitPortfolioProps {
	benefits: BenefitCardProps[];
	/** When provided, called when user clicks "Request benefit" on an ELIGIBLE benefit (e.g. to call requestBenefit API) */
	onRequestBenefit?: (benefit: BenefitCardProps) => void;
}

export function BenefitPortfolio({
	benefits,
	onRequestBenefit,
}: BenefitPortfolioProps) {
	const [selectedBenefit, setSelectedBenefit] =
		useState<BenefitCardProps | null>(null);

	const handleRequestBenefit = (benefit: BenefitCardProps) => {
		if (onRequestBenefit) {
			onRequestBenefit(benefit);
		} else {
			alert(
				`Request submitted for ${benefit.name}. You'll be notified when it's reviewed.`,
			);
		}
	};

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full min-w-0 items-stretch">
				{benefits.map((benefit) => (
					<BenefitCard
						key={benefit.benefitId ?? benefit.name}
						{...benefit}
						onClick={() => setSelectedBenefit(benefit)}
						onRequestBenefit={
							benefit.status === "ELIGIBLE"
								? () => handleRequestBenefit(benefit)
								: undefined
						}
					/>
				))}
			</div>
			<BenefitEligibilityModal
				benefit={selectedBenefit}
				onClose={() => setSelectedBenefit(null)}
			/>
		</>
	);
}
