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
				<h1 className="text-[35px] font-medium text-[rgba(255, 255, 255, 0.8)] 255, 255, 0.8)]">
					Benefits & Rules
				</h1>
				<p className="mt-3 text-[20px] font-normal text-gray-400">
					Manage company benefits and eligibility rules
				</p>
			</div>
			<button
				type="button"
				onClick={onAddClick}
				className="rounded-xl border border-white/10 bg-[#0057AD]/80 px-5 py-2.5 text-sm font-medium text-white"
			>
				+ Add Benefits
			</button>
		</div>
	);
}
