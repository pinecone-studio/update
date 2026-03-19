/** @format */

"use client";

type BenefitsAndRuleHeaderProps = {
	onAddClick: () => void;
};

export function BenefitsAndRuleHeader({
	onAddClick,
}: BenefitsAndRuleHeaderProps) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
			<div className="min-w-0">
				<h1 className="text-2xl font-medium text-slate-900 sm:text-[28px] lg:text-[35px] dark:text-white">
					Benefits & Rules
				</h1>
				<p className="mt-2 text-base font-normal text-slate-600 sm:text-lg lg:text-[20px] dark:text-white/60">
					Manage company benefits and eligibility rules
				</p>
			</div>
			<button
				type="button"
				onClick={onAddClick}
				className="inline-flex h-11 min-w-0 flex-shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-base font-medium text-white transition hover:bg-blue-500 sm:min-w-[170px] sm:text-[18px] dark:bg-[#1a5fb4] dark:hover:bg-[#2A9BFF]"
			>
				+ Add Benefits
			</button>
		</div>
	);
}
