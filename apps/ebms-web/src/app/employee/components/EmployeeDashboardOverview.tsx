/** @format */

"use client";

import type { ReactNode } from "react";

export type EmployeeStatusFilter =
	| "ACTIVE"
	| "ELIGIBLE"
	| "PENDING"
	| "LOCKED"
	| "ALL";

type FilterItem = {
	key: Exclude<EmployeeStatusFilter, "ALL">;
	count: number;
	icon: ReactNode;
};

const FILTER_PILL_STYLES = {
	ACTIVE: {
		label: "Active",
		tone: "text-[var(--text-primary)]",
		countTone: "text-[var(--text-secondary)]",
		iconWrap:
			"bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
		idle:
			"border border-slate-200 bg-white/80 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10",
		active:
			"border border-emerald-300 bg-emerald-50/90 shadow-[var(--shadow-soft)] dark:border-emerald-400/50 dark:bg-emerald-500/15 dark:shadow-none",
	},
	ELIGIBLE: {
		label: "Eligible",
		tone: "text-[var(--text-primary)]",
		countTone: "text-[var(--text-secondary)]",
		iconWrap:
			"bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
		idle:
			"border border-slate-200 bg-white/80 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10",
		active:
			"border border-blue-300 bg-blue-50/90 shadow-[var(--shadow-soft)] dark:border-blue-400/50 dark:bg-blue-500/15 dark:shadow-none",
	},
	PENDING: {
		label: "Pending",
		tone: "text-[var(--text-primary)]",
		countTone: "text-[var(--text-secondary)]",
		iconWrap:
			"bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
		idle:
			"border border-slate-200 bg-white/80 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10",
		active:
			"border border-amber-300 bg-amber-50/90 shadow-[var(--shadow-soft)] dark:border-amber-400/50 dark:bg-amber-500/15 dark:shadow-none",
	},
	LOCKED: {
		label: "Locked",
		tone: "text-[var(--text-primary)]",
		countTone: "text-[var(--text-secondary)]",
		iconWrap:
			"bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
		idle:
			"border border-slate-200 bg-white/80 hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10",
		active:
			"border border-rose-300 bg-rose-50/90 shadow-[var(--shadow-soft)] dark:border-rose-400/50 dark:bg-rose-500/15 dark:shadow-none",
	},
} as const;

interface EmployeeDashboardOverviewProps {
	meName?: string;
	error?: string | null;
	activeCount: number;
	pendingCount: number;
	statusFilter: EmployeeStatusFilter;
	filterItems: FilterItem[];
	onToggleStatus: (key: Exclude<EmployeeStatusFilter, "ALL">) => void;
}

export function EmployeeDashboardOverview({
	meName,
	error,
	activeCount,
	pendingCount,
	statusFilter,
	filterItems,
	onToggleStatus,
}: EmployeeDashboardOverviewProps) {
	return (
		<section className="grid w-full min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_356px] xl:gap-8">
			<div className="min-w-0 max-w-[780px]">
				<div className="mb-6 flex flex-col sm:mb-8">
					<h1 className="text-[28px] font-semibold leading-[1.02] tracking-[-1.4px] text-[var(--text-primary)] sm:text-[35px] sm:tracking-[-2.6px]">
						Welcome back, {meName ?? "..."}
					</h1>
					<p className="mt-2 max-w-[640px] text-[15px] font-normal leading-6 tracking-[-0.2px] text-[var(--text-secondary)] sm:mt-3 sm:text-[20px] sm:leading-7 sm:tracking-[-0.45px]">
						You have {activeCount} active benefits and {pendingCount} pending
						requests
					</p>
					{error ? (
						<p className="mt-3 text-sm text-red-400">Error: {error}</p>
					) : null}
				</div>

				<div className="grid grid-cols-2 gap-2 pb-1 sm:flex sm:flex-nowrap sm:gap-2 sm:overflow-x-auto sm:px-1 lg:overflow-visible lg:px-0">
					{filterItems.map((item) => {
						const styles = FILTER_PILL_STYLES[item.key];
						const isActive = statusFilter === item.key;
						return (
							<button
								key={item.key}
								type="button"
								onClick={() => onToggleStatus(item.key)}
								className={`inline-flex h-[48px] w-full min-w-0 cursor-pointer items-center rounded-[13px] border px-[12px] py-[6px] text-left transition-all duration-200 sm:h-[40px] sm:w-[150px] sm:shrink-0 lg:w-[138px] xl:w-[160px] ${
									isActive ? styles.active : styles.idle
								}`}
							>
								<span
									className={`grid h-[26px] w-[26px] place-items-center rounded-[8px] ${styles.iconWrap}`}
								>
									{item.icon}
								</span>
								<span className="ml-5 min-w-0 flex-1">
									<span
										className={`text-[14px] leading-none font-medium tracking-[-0.2px] ${styles.tone}`}
									>
										{styles.label}
									</span>
								</span>
								<span
									className={`shrink-0 pr-2 text-[14px] leading-none font-medium tracking-[-0.2px] ${styles.countTone}`}
								>
									{item.count}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			<div className="mt-1 w-full lg:mt-6 lg:pr-[10px]">
				<div className="relative flex h-[208px] w-full overflow-hidden rounded-[22px] border border-slate-200 bg-white/90 p-5 shadow-[var(--shadow-card)] dark:border-white/20 dark:bg-white/5 dark:shadow-none sm:h-[236px] sm:p-6 lg:h-[242px] lg:w-full">
					<div className="z-10 flex flex-1 flex-col items-start justify-center text-left">
						<div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[var(--text-secondary)] dark:border-white/20 dark:bg-white/10">
							<span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
							<span className="text-sm font-semibold tracking-[-0.2px]">
								Season 3 • Episode 1
							</span>
						</div>

						<div className="mt-4">
							<h3 className="text-[28px] font-semibold leading-[0.95] tracking-[-1.1px] text-[var(--text-primary)] sm:text-[32px]">
								PineQuest
							</h3>
							<p className="mt-2 text-[14px] font-semibold text-[var(--text-secondary)] sm:text-[15px]">
								The dream chapter: Eternity
							</p>
						</div>

						<div className="mt-5 sm:mt-6">
							<button
								type="button"
								className="inline-flex items-center justify-start rounded-[15px] bg-slate-100 px-4 py-2.5 text-left text-[16px] font-semibold text-[var(--text-primary)] transition hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 sm:pl-2 sm:pr-6 sm:text-[18px]"
							>
								Update team
							</button>
						</div>
					</div>

					<div className="pointer-events-none absolute right-[-10px] bottom-[-10px] opacity-60 sm:right-[-15px] sm:bottom-[-14px] sm:opacity-70">
						<img
							src="/Pinecone.png"
							alt="Pinecone shape"
							className="h-[118px] w-auto object-contain sm:h-[165px] lg:h-[172px]"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
