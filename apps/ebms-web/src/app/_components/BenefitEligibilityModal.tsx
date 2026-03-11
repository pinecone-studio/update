/** @format */

"use client";

import { FiCheck, FiX } from "react-icons/fi";
import type { BenefitCardProps, EligibilityRule } from "./BenefitCard";

interface BenefitEligibilityModalProps {
	benefit: BenefitCardProps | null;
	onClose: () => void;
}

export function BenefitEligibilityModal({
	benefit,
	onClose,
}: BenefitEligibilityModalProps) {
	if (benefit == null) return null;

	const rules = benefit.eligibilityRules ?? [
		{
			rule: benefit.eligibilityCriteria,
			passed: benefit.status !== "LOCKED",
			detail: benefit.lockReason,
		},
	];

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="eligibility-modal-title"
		>
			<div
				className="w-full max-w-md rounded-xl bg-[#1A2536] border border-[#2d3a4d] shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between p-5 pb-4 border-b border-[#2d3a4d]">
					<div>
						<h2
							id="eligibility-modal-title"
							className="text-xl font-bold text-white"
						>
							{benefit.name}
						</h2>
						<p className="text-sm text-[#94A3B8] mt-0.5">
							Eligibility breakdown
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-2 rounded-lg text-[#94A3B8] hover:bg-[#2d3a4d] hover:text-white transition-colors"
						aria-label="Close"
					>
						<FiX size={20} />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-5 space-y-3">
					{rules.map((r: EligibilityRule, i: number) => (
						<RuleRow key={i} rule={r} />
					))}
				</div>

				<div className="p-5 pt-4 border-t border-[#2d3a4d]">
					<button
						type="button"
						onClick={onClose}
						className="w-full py-3 px-4 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium text-sm transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}

function RuleRow({ rule }: { rule: EligibilityRule }) {
	return (
		<div className="flex gap-3 p-3 rounded-lg bg-[#0f172a]/50 border border-[#2d3a4d]">
			<div
				className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
					rule.passed ? "bg-[#4CAF50]/20 text-[#4CAF50]" : "bg-[#F44336]/20 text-[#F44336]"
				}`}
			>
				{rule.passed ? <FiCheck size={16} /> : <FiX size={16} />}
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-white">{rule.rule}</p>
				{rule.detail != null && (
					<p className="text-xs text-[#94A3B8] mt-0.5">{rule.detail}</p>
				)}
				<span
					className={`inline-block mt-1 text-xs font-semibold ${
						rule.passed ? "text-[#4CAF50]" : "text-[#F44336]"
					}`}
				>
					{rule.passed ? "PASS" : "FAIL"}
				</span>
			</div>
		</div>
	);
}
