/** @format */

"use client";

type BenefitsAndRuleHeaderProps = {
	onAddClick: () => void;
};

export function BenefitsAndRuleHeader({
	onAddClick,
}: BenefitsAndRuleHeaderProps) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			<div>
				<h1 className="text-[35px] font-medium text-[rgba(255, 255, 255, 0.8)] dark:text-[rgba(255, 255, 255, 0.8)]">
					Benefits & Rules
				</h1>
				<p className="mt-3 text-[20px] font-normal text-gray-400">
					Manage company benefits and eligibility rules
				</p>
			</div>
			<button
				type="button"
				onClick={onAddClick}
				className="inline-flex h-11 min-w-[170px] flex-[0_0_auto] items-center justify-center gap-2 rounded-xl  bg-[#0057ADCC]/80 px-4 text-[18px] font-medium text-white transition hover:bg-[#3E82F7]"
			>
				+ Add Benefits
			</button>
		</div>
	);
}
