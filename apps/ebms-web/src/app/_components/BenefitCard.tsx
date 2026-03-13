/** @format */

import { FiExternalLink, FiLock } from "react-icons/fi";
import type { ReactNode } from "react";

export type BenefitStatus = "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING" | "REJECTED";

export interface EligibilityRule {
	rule: string;
	passed: boolean;
	detail?: string;
}

const STATUS_STYLES: Record<BenefitStatus, string> = {
	ACTIVE: "bg-[#16a34a] text-white",
	ELIGIBLE: "bg-[#2563eb] text-white",
	LOCKED: "bg-[#dc2626] text-white",
	PENDING: "bg-[#f59e0b] text-white",
	REJECTED: "bg-[#dc2626] text-white",
};

const BUTTON_TEXT_BY_STATUS: Record<BenefitStatus, string> = {
	ELIGIBLE: "Request benefit",
	ACTIVE: "Manage Benefit",
	PENDING: "Request sent",
	LOCKED: "View details",
	REJECTED: "Request benefit",
};

export interface BenefitCardProps {
	/** Backend benefit id (for requestBenefit mutation) */
	benefitId?: string;
	category: string;
	name: string;
	description: string;
	subsidyPercentage?: string;
	vendorDetails?: string;
	eligibilityCriteria: string;
	contractLink?: string;
	status: BenefitStatus;
	/** Human-readable explanation when status is LOCKED (e.g., "OKR not submitted for Q1 2025") */
	lockReason?: string;
	/** Rejection reason when status is REJECTED (admin's feedback) */
	rejectReason?: string;
	/** Rules evaluated for eligibility breakdown (shown in detail view) */
	eligibilityRules?: EligibilityRule[];
	icon: ReactNode;
	iconBgColor?: string;
	iconColor?: string;
	buttonText?: string;
	onClick?: () => void;
	/** Called when user clicks "Request benefit" on ELIGIBLE benefits */
	onRequestBenefit?: () => void;
	/** Custom footer actions (replaces default button when provided) */
	footerActions?: ReactNode;
}

export const BenefitCard = ({
	benefitId: _benefitId,
	name,
	description,
	subsidyPercentage,
	vendorDetails,
	eligibilityCriteria,
	contractLink,
	status,
	lockReason,
	rejectReason,
	eligibilityRules: _eligibilityRules,
	icon,
	iconBgColor = "bg-[#4CAF50]/20",
	iconColor = "text-[#4CAF50]",
	buttonText,
	onClick,
	onRequestBenefit,
	footerActions,
}: BenefitCardProps) => {
	const displayButtonText = buttonText ?? BUTTON_TEXT_BY_STATUS[status];

	const handleButtonClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if ((status === "ELIGIBLE" || status === "REJECTED") && onRequestBenefit) {
			onRequestBenefit();
		} else if (onClick) {
			onClick();
		}
	};
	return (
		<div
			className={`flex flex-col gap-3 w-full h-full ${onClick ? "cursor-pointer hover:opacity-95 transition-opacity" : ""}`}
			onClick={onClick}
			onKeyDown={
				onClick
					? (e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								onClick();
							}
						}
					: undefined
			}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			<div className={`group relative w-full min-w-0 max-w-full flex-1 min-h-0 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-inner flex flex-col dark:bg-[#1A2536] dark:border-[#2d3a4d] ${status === "LOCKED" ? "cursor-pointer" : ""}`}>
				<div className="p-5 pt-4 flex flex-col">
					<div className="flex items-start gap-4 mb-5">
						<div
							className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor} ${iconColor}`}
						>
							{icon}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-3">
								<div>
									<h3 className="text-lg font-bold text-slate-900 dark:text-white">
										{name}
									</h3>
									<p className="text-sm text-slate-600 mt-0.5 dark:text-[#94A3B8]">
										{description}
									</p>
								</div>
								<span
									className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}
								>
									{status}
								</span>
							</div>
						</div>
					</div>

					<div className="space-y-3 mb-5 pb-5 border-b border-slate-200 dark:border-[#2d3a4d]">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
							<span className="text-sm text-slate-600 dark:text-[#94A3B8]">
								Subsidy
							</span>
							<span className="text-sm text-slate-900 dark:text-white">
								{subsidyPercentage ?? "—"}
							</span>
						</div>
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
							<span className="text-sm text-slate-600 dark:text-[#94A3B8]">
								Vendor
							</span>
							<span className="text-sm text-slate-900 dark:text-white">
								{vendorDetails ?? "—"}
							</span>
						</div>
						<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
							<span className="text-sm text-slate-600 dark:text-[#94A3B8]">
								Eligibility
							</span>
							<span className="text-sm text-slate-900 text-right sm:text-right dark:text-white">
								{eligibilityCriteria}
							</span>
						</div>
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
							<span className="text-sm text-slate-600 dark:text-[#94A3B8]">
								Contract
							</span>
							{contractLink != null ? (
								<a
									href={contractLink}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors dark:text-white dark:hover:text-[#60A5FA]"
									onClick={(e) => e.stopPropagation()}
								>
									View active contract
									<FiExternalLink size={12} className="flex-shrink-0" />
								</a>
							) : (
								<span className="text-sm text-slate-500 dark:text-[#64748b]">
									No active contract
								</span>
							)}
						</div>
					</div>

					<div className="h-[72px] flex flex-col justify-center">
						{status === "LOCKED" && lockReason != null ? (
							<div className="rounded-lg bg-slate-100 border border-slate-300 px-3 py-2 dark:bg-[#64748b]/20 dark:border-[#64748b]/40">
								<p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-0.5 dark:text-[#94A3B8]">
									Blocked by rule
								</p>
								<p className="text-sm text-slate-700 line-clamp-2 dark:text-[#E2E8F0]">
									{lockReason}
								</p>
							</div>
						) : status === "REJECTED" && rejectReason ? (
							<div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 dark:bg-red-950/30 dark:border-red-800/50">
								<p className="text-xs font-medium text-red-600 uppercase tracking-wider mb-0.5 dark:text-red-400">
									Татгалзсан шалтгаан
								</p>
								<p className="text-sm text-red-800 line-clamp-2 dark:text-red-200">
									{rejectReason}
								</p>
							</div>
						) : null}
					</div>

					{footerActions ? (
						<div className="w-full">{footerActions}</div>
					) : (
						<button
							type="button"
							disabled={status !== "ELIGIBLE" && status !== "REJECTED"}
							className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
								status === "ELIGIBLE" || status === "REJECTED"
									? "bg-slate-800 hover:bg-slate-700 text-white dark:bg-[#0f172a] dark:hover:bg-[#1e293b]"
									: "bg-slate-400 text-white cursor-not-allowed dark:bg-slate-600"
							}`}
							onClick={handleButtonClick}
						>
							{displayButtonText}
						</button>
					)}
				</div>
				{status === "LOCKED" && (
					<div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-900/60 dark:bg-slate-950/70 opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100">
						<div className="flex flex-col items-center gap-2">
							<div className="w-14 h-14 rounded-full bg-[#dc2626]/90 flex items-center justify-center">
								<FiLock size={28} className="text-white" strokeWidth={2.5} />
							</div>
							<span className="text-sm font-medium text-white drop-shadow-sm">
								Locked
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
