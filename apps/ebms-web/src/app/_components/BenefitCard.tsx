/** @format */

import { FiExternalLink, FiInfo } from "react-icons/fi";
import type { ReactNode } from "react";

export type BenefitStatus =
	| "ACTIVE"
	| "ELIGIBLE"
	| "LOCKED"
	| "PENDING"
	| "REJECTED";

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
	/** Benefit end date (from active contract expiry) */
	benefitEndDate?: string | null;
	/** Benefit start date (from active contract effective date, for ACTIVE benefits) */
	benefitStartDate?: string | null;
	/** If true, employee must accept vendor contract before requesting */
	requiresContract?: boolean;
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
	/** Compact layout for list/sidebar (single column) */
	compact?: boolean;
}

export const BenefitCard = ({
	benefitId: _benefitId,
	name,
	description,
	subsidyPercentage,
	vendorDetails,
	eligibilityCriteria,
	contractLink,
	benefitEndDate,
	status,
	lockReason,
	rejectReason,
	eligibilityRules,
	icon,
	iconBgColor = "bg-[#4CAF50]/20",
	iconColor = "text-[#4CAF50]",
	buttonText,
	onClick,
	onRequestBenefit,
	footerActions,
	compact,
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

	const isButtonClickable =
		status === "ELIGIBLE" ||
		status === "REJECTED" ||
		((status === "ACTIVE" || status === "LOCKED") && onClick);
	return (
		<div
			className={`flex flex-col w-full ${compact ? "" : "h-full"} ${onClick ? "cursor-pointer hover:opacity-95 transition-opacity" : ""}`}
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
			<div
				className={`relative w-full min-w-0 max-w-full rounded-xl bg-white border border-slate-200 overflow-hidden shadow-inner flex flex-col dark:bg-[#1A2536] dark:border-[#2d3a4d] ${
					compact ? "flex-none" : "flex-1 min-h-0"
				}`}
			>
				<div
					className={compact ? "p-4 flex flex-col" : "p-5 pt-4 flex flex-col"}
				>
					<div
						className={`flex items-start gap-3 ${compact ? "mb-3" : "mb-5"}`}
					>
						<div
							className={`flex-shrink-0 rounded-lg flex items-center justify-center ${iconBgColor} ${iconColor} ${
								compact ? "w-10 h-10" : "w-12 h-12"
							}`}
						>
							{icon}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<h3
										className={`font-bold text-slate-900 dark:text-white ${
											compact ? "text-sm" : "text-lg"
										}`}
									>
										{name}
									</h3>
									<p
										className={`text-slate-600 dark:text-[#94A3B8] ${
											compact ? "text-xs mt-0.5 line-clamp-1" : "text-sm mt-0.5"
										}`}
									>
										{description}
									</p>
								</div>
								<div className="flex-shrink-0 flex items-center gap-1">
									{status === "ACTIVE" &&
										(eligibilityRules ?? []).length > 0 && (
											<span
												className="relative group"
												onClick={(e) => e.stopPropagation()}
											>
												<FiInfo
													size={12}
													className="text-slate-500 hover:text-slate-700 cursor-help dark:text-slate-400 dark:hover:text-slate-200"
													aria-label="Requirements to maintain benefit"
												/>
												<span className="absolute right-0 top-full mt-1 px-2 py-1.5 w-44 rounded-lg bg-slate-800 text-white text-xs font-normal shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 pointer-events-none">
													<p className="font-semibold mb-1">
														To maintain this benefit
													</p>
													<ul className="space-y-0.5 list-disc list-inside">
														{(eligibilityRules ?? [])
															.slice(0, 3)
															.map((r, i) => (
																<li key={i} className="line-clamp-2">
																	{r.rule}
																</li>
															))}
													</ul>
												</span>
											</span>
										)}
									<span
										className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}
									>
										{status}
									</span>
								</div>
							</div>
						</div>
					</div>

					{!compact && (
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
					)}

					{!compact && (
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
					)}

					{footerActions ? (
						<div className="w-full">{footerActions}</div>
					) : (
						<button
							type="button"
							disabled={!isButtonClickable}
							className={`w-full rounded-lg font-medium transition-colors ${
								compact ? "py-2 px-3 text-xs" : "py-3 px-4 text-sm"
							} ${
								status === "ELIGIBLE" || status === "REJECTED"
									? "bg-slate-800 hover:bg-slate-700 text-white dark:bg-[#0f172a] dark:hover:bg-[#1e293b]"
									: status === "ACTIVE" || status === "LOCKED"
										? "bg-slate-800 hover:bg-slate-700 text-white dark:bg-[#0f172a] dark:hover:bg-[#1e293b] cursor-pointer"
										: "bg-slate-400 text-white cursor-not-allowed dark:bg-slate-600"
							}`}
							onClick={handleButtonClick}
						>
							{displayButtonText}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
