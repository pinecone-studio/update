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

	const activeBenefits = benefits.filter((b) => b.status === "ACTIVE");

	return (
		<>
			{activeBenefits.length === 0 ? (
				<div className="rounded-2xl border border-[#334155] bg-[#1E293B] px-6 py-10 text-center">
					<p className="text-[#94A3B8] text-sm">
						Одоогоор идэвхтэй benefit байхгүй байна. Eligibility-г шалгаад шинэ benefit хүсэх боломжтой.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0 items-stretch">
					{activeBenefits.map((benefit) => (
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
			)}
			<BenefitEligibilityModal
				benefit={selectedBenefit}
				onClose={() => setSelectedBenefit(null)}
			/>
		</>
	);
}
