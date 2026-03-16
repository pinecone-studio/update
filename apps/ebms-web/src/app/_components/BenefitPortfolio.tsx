/** @format */

"use client";

import { useState } from "react";
import { BenefitCard } from "@/app/_components/BenefitCard";
import { BenefitStatusModal } from "@/app/employee/components/BenefitStatusModal";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";

interface BenefitPortfolioProps {
	benefits: BenefitCardProps[];
	/** When provided, called when user clicks "Request benefit" on an ELIGIBLE benefit (e.g. to call requestBenefit API) */
	onRequestBenefit?: (benefit: BenefitCardProps) => void;
	onViewContract?: (benefit: BenefitCardProps) => void | Promise<void>;
	/** Use single column layout (e.g. for sidebar) */
	compact?: boolean;
}

export function BenefitPortfolio({
	benefits,
	onRequestBenefit,
	onViewContract,
	compact,
}: BenefitPortfolioProps) {
	const [selectedBenefit, setSelectedBenefit] =
		useState<BenefitCardProps | null>(null);
	const [openWithContractStep, setOpenWithContractStep] = useState(false);

	const handleRequestBenefit = async (benefit: BenefitCardProps) => {
		if (onRequestBenefit) {
			await onRequestBenefit(benefit);
			setSelectedBenefit(null);
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
						: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch"
				}`}
			>
				{benefits.map((benefit) => {
					const canRequest =
						benefit.status === "ELIGIBLE" || benefit.status === "REJECTED";
					const needsContract =
						canRequest && (benefit.requiresContract || benefit.contractLink);
					// If contract required: button opens modal with contract; else direct request
					return (
						<BenefitCard
							key={benefit.benefitId ?? benefit.name}
							{...benefit}
							compact={compact}
							onClick={() => {
								setOpenWithContractStep(false);
								setSelectedBenefit(benefit);
							}}
							onRequestBenefit={
								canRequest
									? needsContract
										? () => {
												setOpenWithContractStep(true);
												setSelectedBenefit(benefit);
											}
										: () => handleRequestBenefit(benefit)
									: undefined
							}
						/>
					);
				})}
			</div>
			<BenefitStatusModal
				benefit={selectedBenefit}
				onClose={() => {
					setSelectedBenefit(null);
					setOpenWithContractStep(false);
				}}
				onRequestBenefit={onRequestBenefit ? handleRequestBenefit : undefined}
				onViewContract={onViewContract}
				initialOpenContractStep={openWithContractStep}
			/>
		</>
	);
}
