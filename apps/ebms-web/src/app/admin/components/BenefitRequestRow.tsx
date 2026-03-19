/** @format */

"use client";

import { formatRelativeTime, getInitials } from "../_lib/utils";
import type { BenefitRequest } from "../_lib/dashboard-types";

type BenefitRequestRowProps = {
	request: BenefitRequest;
	affiliation: string;
	actionLoadingId: string | null;
	onApprove: (requestId: string) => void;
	onReject: (requestId: string) => void;
};

export function BenefitRequestRow({
	request,
	affiliation: _affiliation,
	actionLoadingId,
	onApprove,
	onReject,
}: BenefitRequestRowProps) {
	const status = (request.status || "PENDING").toUpperCase();
	const isLoading = actionLoadingId === request.id;
	const employeeName = request.employeeName ?? request.employeeId ?? "";
	const benefitText =
		request.benefitName ?? request.benefitId ?? "Benefit request";

	return (
		<div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-3">
			<div className="flex min-w-0 flex-1">
				<div className="flex items-start gap-3">
					<div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-violet-600 text-[22px] font-semibold text-white dark:bg-[linear-gradient(160deg,#6f65ff,#8b2fff)]">
						{getInitials(employeeName)}
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
							<p className="text-[20px] font-semibold leading-tight text-slate-900 dark:text-white">
								{employeeName}
							</p>
							<span className="text-[15px] text-slate-500 dark:text-slate-400">
								{formatRelativeTime(request.createdAt)}
							</span>
						</div>
						<p className="mt-1 truncate text-[15px] leading-tight text-slate-600 dark:text-white/85">
							{benefitText}
						</p>
					</div>
				</div>
			</div>
			<div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
				{status === "PENDING" && (
					<div className="flex flex-wrap items-center gap-2">
						<button
							type="button"
							disabled
							className="h-[48px] min-w-[118px] rounded-xl border border-amber-300 bg-amber-100 px-4 py-2 text-[14px] font-medium text-amber-800 transition disabled:cursor-not-allowed disabled:opacity-90 dark:border-[#f0d58a]/85 dark:bg-[linear-gradient(180deg,#c8892b,#a86714)] dark:text-[#ffffff]"
						>
							Pending
						</button>
						<button
							type="button"
							onClick={() => onApprove(request.id)}
							disabled={isLoading}
							className="h-[48px] min-w-[118px] rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2 text-[14px] font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#2ba17e]/80 dark:bg-[#0f5540] dark:hover:bg-[#14684d]"
						>
							{isLoading ? "..." : "Approve"}
						</button>
						<button
							type="button"
							onClick={() => onReject(request.id)}
							disabled={isLoading}
							className="h-[48px] min-w-[118px] rounded-xl border border-red-600 bg-red-600 px-4 py-2 text-[14px] font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#c23c46]/80 dark:bg-[linear-gradient(180deg,#a4161c,#8e1218)] dark:hover:brightness-110"
						>
							Reject
						</button>
					</div>
				)}
				{status === "APPROVED" && (
					<button
						type="button"
						disabled={isLoading}
						className="flex h-[28px] min-w-[80px] items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[84px] dark:bg-[#0f5540] dark:hover:bg-emerald-700"
					>
						Approved
					</button>
				)}
				{status === "REJECTED" && (
					<button
						type="button"
						disabled={isLoading}
						className="flex h-[28px] min-w-[80px] items-center justify-center rounded-lg bg-red-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[84px] sm:text-base dark:bg-[#851618] dark:hover:bg-red-700"
					>
						Reject
					</button>
				)}
			</div>
		</div>
	);
}
