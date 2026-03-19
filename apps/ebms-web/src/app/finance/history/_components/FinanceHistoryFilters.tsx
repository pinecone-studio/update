/** @format */

"use client";

import type { BenefitRequestStatus } from "../../_lib/api";

type FinanceHistoryFiltersProps = {
	searchTerm: string;
	onSearchTermChange: (v: string) => void;
	requestIdFilter: string;
	onRequestIdFilterChange: (v: string) => void;
	benefitFilter: string;
	onBenefitFilterChange: (v: string) => void;
	statusFilter: "ALL" | BenefitRequestStatus;
	onStatusFilterChange: (v: "ALL" | BenefitRequestStatus) => void;
	dateFrom: string;
	onDateFromChange: (v: string) => void;
	dateTo: string;
	onDateToChange: (v: string) => void;
	benefitOptions: string[];
	onClearAll: () => void;
};

const SelectChevron = () => (
	<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8595B6]">
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className="h-6 w-6"
			stroke="currentColor"
			strokeWidth="1.8"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</span>
);

export function FinanceHistoryFilters({
	searchTerm,
	onSearchTermChange,
	requestIdFilter,
	onRequestIdFilterChange,
	benefitFilter,
	onBenefitFilterChange,
	statusFilter,
	onStatusFilterChange,
	dateFrom,
	onDateFromChange,
	dateTo,
	onDateToChange,
	benefitOptions,
	onClearAll,
}: FinanceHistoryFiltersProps) {
	return (
		<section className="rounded-3xl border border-slate-200 bg-white/90 p-4 dark:border-white/10 dark:bg-[#16142a] sm:p-6">
			<div className="mb-5 flex items-center justify-between">
				<h2 className="flex items-center gap-3 text-5 font-semibold text-slate-900 dark:text-white">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						className="h-7 w-7"
						stroke="currentColor"
						strokeWidth="1.8"
					>
						<path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" />
					</svg>
					Filters
				</h2>
				<button
					type="button"
					onClick={onClearAll}
					className="rounded-xl border border-slate-200 bg-white/10 px-4 py-2 text-5 text-slate-900 transition hover:bg-white/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
				>
					Clear All
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="space-y-2">
					<label className="text-5 font-medium text-slate-900 dark:text-white">
						Search
					</label>
					<div className="relative">
						<span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-200 dark:text-[#8FA3C5]">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								className="h-6 w-6"
								stroke="currentColor"
								strokeWidth="1.8"
							>
								<circle cx="11" cy="11" r="7" />
								<path d="m20 20-4-4" />
							</svg>
						</span>
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => onSearchTermChange(e.target.value)}
							placeholder="User, ID, benefit, action, status..."
							className="h-14 w-full rounded-2xl border border-slate-200 bg-white/10 pl-14 pr-4 text-l text-slate-900 placeholder:text-slate-400 outline-none focus:border-white/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-[#ffffff] dark:focus:border-white/10"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-5 font-medium text-slate-900 dark:text-white">
						Benefit Type
					</label>
					<div className="relative">
						<select
							value={benefitFilter}
							onChange={(e) => onBenefitFilterChange(e.target.value)}
							className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-white/10 px-4 pr-9 text-l text-slate-900 outline-none focus:border-white/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:border-white/10"
						>
							<option value="ALL">All Benefits</option>
							{benefitOptions.map((benefit) => (
								<option key={benefit} value={benefit}>
									{benefit}
								</option>
							))}
						</select>
						<SelectChevron />
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-5 font-medium text-slate-900 dark:text-white">
						Status
					</label>
					<div className="relative">
						<select
							value={statusFilter}
							onChange={(e) =>
								onStatusFilterChange(
									e.target.value as "ALL" | BenefitRequestStatus,
								)
							}
							className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-white/10 px-4 pr-9 text-l text-slate-900 outline-none focus:border-white/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:border-white/10"
						>
							<option value="ALL">All Status</option>
							<option value="APPROVED">APPROVED</option>
							<option value="REJECTED">REJECTED</option>
						</select>
						<SelectChevron />
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-5 font-medium text-slate-900 dark:text-white">
						Date Range
					</label>
					<div className="grid grid-cols-1 sm:grid-cols-2">
						<input
							type="date"
							value={dateFrom}
							onChange={(e) => onDateFromChange(e.target.value)}
							className="h-14 w-full rounded-xl border border-slate-200 bg-white/10 px-4 text-l text-slate-900 outline-none focus:border-white/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:border-white/10"
						/>
						<input
							type="date"
							value={dateTo}
							onChange={(e) => onDateToChange(e.target.value)}
							className="h-14 w-full rounded-xl border border-slate-200 bg-white/10 px-4 text-l text-slate-900 outline-none focus:border-white/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:focus:border-white/10"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-5 font-medium text-slate-900 dark:text-white">
						Request ID
					</label>
					<input
						type="text"
						value={requestIdFilter}
						onChange={(e) => onRequestIdFilterChange(e.target.value)}
						placeholder="Request ID"
						className="h-14 w-full rounded-2xl border border-slate-200 bg-white/10 px-4 text-l text-slate-900 placeholder:text-slate-400 outline-none focus:border-white/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-[#ffffff] dark:focus:border-white/10"
					/>
				</div>
			</div>
		</section>
	);
}
