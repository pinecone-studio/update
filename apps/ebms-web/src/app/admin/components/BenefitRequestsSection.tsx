/** @format */

"use client";

import { BenefitRequestRow } from "./BenefitRequestRow";
import type { BenefitRequest } from "../_lib/dashboard-types";

const STATUS_OPTIONS = [
	{ value: "PENDING" as const, label: "Pending" },
	{ value: "APPROVED" as const, label: "Approved" },
	{ value: "REJECTED" as const, label: "Rejected" },
	{ value: undefined, label: "All" },
] as const;

type BenefitRequestsSectionProps = {
	requests: BenefitRequest[];
	statusFilter: string | undefined;
	onStatusFilterChange: (value: string | undefined) => void;
	error: string | null;
	actionLoadingId: string | null;
	employeeIdToDepartment: Record<string, string>;
	onApprove: (requestId: string) => void;
	onReject: (requestId: string) => void;
};

export function BenefitRequestsSection({
	requests,
	statusFilter,
	onStatusFilterChange,
	error,
	actionLoadingId,
	employeeIdToDepartment,
	onApprove,
	onReject,
}: BenefitRequestsSectionProps) {
	return (
		<article className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[var(--shadow-card)] p-4 sm:rounded-[24px] sm:p-6 lg:h-[675px] overflow-y-auto dark:border-[rgba(38,38,38,1)] dark:bg-[rgba(13,94,85,0.1)] dark:shadow-none">
			<div className="mb-4 flex shrink-0 flex-col gap-3 px-4 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 sm:pt-6">
				<h2 className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
					Employee Benefit Requests
				</h2>
				<div className="w-full overflow-x-auto rounded-2xl border border-slate-200 sm:w-auto dark:border-white/30">
					<div className="flex h-[49px] min-w-max gap-1.5 sm:w-[472px]">
						{STATUS_OPTIONS.map(({ value, label }) => (
							<button
								key={value ?? "all"}
								type="button"
								onClick={() => onStatusFilterChange(value)}
								className={`shrink-0 rounded-2xl px-[22px] py-2.5 text-[16px] font-medium transition ${
									statusFilter === value
										? "bg-slate-200 text-slate-900 dark:bg-slate-200 dark:text-black"
										: "bg-transparent text-slate-600 hover:bg-slate-100 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
								}`}
							>
								{label}
							</button>
						))}
					</div>
				</div>
			</div>

			{error && (
				<div className="mx-4 mb-4 shrink-0 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-red-700 sm:mx-8 dark:border-red-500/50 dark:bg-transparent dark:text-red-200">
					{error}
				</div>
			)}

			<div className="min-h-0 flex-1 overflow-y-auto pr-1">
				{requests.length === 0 ? (
					<p className="px-4 py-8 text-center text-slate-500 sm:px-8 dark:text-slate-400">
						No benefit requests found.
					</p>
				) : (
					<div className="divide-y divide-slate-200 px-4 pb-4 sm:px-8 sm:pb-8 dark:divide-white/30">
						{requests.map((req) => (
							<BenefitRequestRow
								key={req.id}
								request={req}
								affiliation={employeeIdToDepartment[req.employeeId] ?? ""}
								actionLoadingId={actionLoadingId}
								onApprove={onApprove}
								onReject={onReject}
							/>
						))}
					</div>
				)}
			</div>
		</article>
	);
}
