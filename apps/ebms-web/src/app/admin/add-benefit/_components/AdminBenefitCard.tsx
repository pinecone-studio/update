/** @format */

"use client";

import type { ReactNode } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type AdminBenefitCardProps = {
	id: string;
	name: string;
	category: string;
	subsidyPercent: number;
	vendorDisplay: string;
	ruleSummary: string;
	validityPeriodDisplay?: string;
	usagePeriodDisplay?: string;
	requestDeadlineDisplay?: string;
	financeApproval?: boolean;
	vendorContract?: boolean;
	managerApproval?: boolean;
	icon: ReactNode;
	iconBgClass?: string;
	iconColorClass?: string;
	isHighlighted?: boolean;
	onEdit: () => void;
	onDelete: () => void;
	isDeleting?: boolean;
};

export function AdminBenefitCard({
	id,
	name,
	category,
	subsidyPercent,
	vendorDisplay,
	ruleSummary,
	validityPeriodDisplay,
	usagePeriodDisplay,
	requestDeadlineDisplay,
	financeApproval,
	vendorContract,
	managerApproval,
	icon,
	iconBgClass = "bg-slate-500/20",
	iconColorClass = "text-slate-300",
	isHighlighted,
	onEdit,
	onDelete,
	isDeleting,
}: AdminBenefitCardProps) {
	const categoryLabel = category
		? `${category.charAt(0).toUpperCase()}${category.slice(1)} benefit`
		: "Benefit";

	const durationDisplay =
		[validityPeriodDisplay, usagePeriodDisplay].filter(Boolean).join(" · ") ||
		"—";

	const approvalDisplay =
		[
			financeApproval && "Finance",
			vendorContract && "Vendor Contract",
			managerApproval && "Manager",
		]
			.filter(Boolean)
			.join(", ") || "—";

	const labelClass = "text-sm text-white/55";
	const valueClass = "text-sm font-semibold text-white/90";

	return (
		<div
			id={`benefit-card-${id}`}
			className={`flex flex-col rounded-xl border border-white/10 transition ${
				isHighlighted ? "ring-2 ring-[#2A8BFF]" : ""
			} bg-[#1A2037] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]`}
		>
			<div className="flex flex-1 min-h-0 flex-col p-4 sm:p-5">
				<div className="flex items-start gap-3 sm:gap-4">
					<div
						className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 sm:h-12 sm:w-12 ${iconBgClass} ${iconColorClass}`}
					>
						<div className="h-5 w-5 sm:h-6 sm:w-6">{icon}</div>
					</div>
					<div className="min-w-0 flex-1">
						<h3 className="text-[15px] font-semibold text-white sm:text-base">
							{name}
						</h3>
						<p className="mt-1 text-[13px] text-white/50 sm:text-sm">
							{categoryLabel}
						</p>
					</div>
				</div>

				<div className="mt-3 space-y-0.5">
					<div className="flex items-center justify-between border-b border-white/10 py-2.5">
						<span className={labelClass}>Coverage</span>
						<span className={valueClass}>{subsidyPercent}% subsidy</span>
					</div>
					<div className="flex items-center justify-between border-b border-white/10 py-2.5">
						<span className={labelClass}>Vendor</span>
						<span className={valueClass}>{vendorDisplay}</span>
					</div>
					<div className="flex items-center justify-between border-b border-white/10 py-2.5">
						<span className={labelClass}>Duration</span>
						<span className={valueClass}>{durationDisplay}</span>
					</div>
					<div className="flex items-center justify-between border-b border-white/10 py-2.5">
						<span className={labelClass}>Request deadline</span>
						<span className={valueClass}>{requestDeadlineDisplay ?? "—"}</span>
					</div>
					<div className="flex items-center justify-between border-b border-white/10 py-2.5">
						<span className={labelClass}>Approval</span>
						<span className={valueClass}>{approvalDisplay}</span>
					</div>
				</div>

				{ruleSummary ? (
					<p className="mt-3 text-sm text-white/70">{ruleSummary}</p>
				) : null}

				<div className="mt-4 flex items-center gap-4">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onEdit();
						}}
						className="inline-flex items-center w-[180px] h-11 justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
					>
						Edit
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
						disabled={isDeleting}
						className="inline-flex items-center w-[180px] h-11 justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isDeleting ? "..." : "Delete"}
					</button>
				</div>
			</div>
		</div>
	);
}
