/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

interface FinanceDashboardSkeletonProps {
	/** Number of request table rows to show (matches FinanceRequestsSection) */
	requestRowCount?: number;
}

export function FinanceDashboardSkeleton({
	requestRowCount = 3,
}: FinanceDashboardSkeletonProps) {
	return (
		<div className="space-y-6">
			{/* Stat cards + Right widgets - matches page layout */}
			<section className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-stretch">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] dark:border-white/10 dark:bg-transparent dark:shadow-none"
						>
							<div className="mb-4 flex justify-center">
								<Skeleton className="h-7 w-16 rounded-md bg-slate-200 dark:bg-white/10" />
							</div>
							<Skeleton className="h-4 w-24 rounded-md bg-slate-200 sm:h-[16px] sm:w-28 dark:bg-white/10" />
							<div className="mt-3 h-px bg-slate-200 dark:bg-[#2B405F]" />
							<Skeleton className="mt-3 h-3 w-32 rounded-md bg-slate-200 dark:bg-white/10" />
						</div>
					))}
				</div>

				{/* Right widgets skeleton - matches FinanceRightWidgets */}
				<div className="xl:h-full">
					<aside className="flex h-full w-full flex-col gap-4 overflow-hidden">
						<div className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] dark:border-white/10 dark:bg-transparent dark:shadow-none sm:p-5">
							<div className="flex items-center justify-between">
								<Skeleton className="h-5 w-28 rounded-md bg-slate-200 dark:bg-white/10" />
								<Skeleton className="h-4 w-16 rounded-md bg-slate-200 dark:bg-white/10" />
							</div>
							<div className="mt-3 flex flex-col gap-3">
								{[1, 2].map((j) => (
									<div
										key={j}
										className="flex items-start gap-3 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 dark:border-white/10"
									>
										<Skeleton className="h-8 w-8 shrink-0 rounded-lg bg-slate-200 dark:bg-white/10" />
										<div className="flex-1 space-y-1">
											<Skeleton className="h-4 w-full rounded-md bg-slate-200 dark:bg-white/10" />
											<Skeleton className="h-3 w-16 rounded-md bg-slate-200 dark:bg-white/10" />
										</div>
									</div>
								))}
							</div>
						</div>
					</aside>
				</div>
			</section>

			{/* Financial Benefit Requests table skeleton - matches FinanceRequestsSection */}
			<section className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[var(--shadow-card)] dark:border-white/10 dark:bg-transparent dark:shadow-none">
				<div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 dark:border-white/10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 sm:py-5">
					<Skeleton className="h-5 w-48 rounded-md bg-slate-200 dark:bg-white/10" />
					<div className="flex flex-wrap items-center gap-2">
						{[1, 2, 3, 4].map((i) => (
							<Skeleton key={i} className="h-9 w-20 rounded-xl bg-slate-200 dark:bg-white/10" />
						))}
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-[15px] leading-tight">
						<thead className="border-b border-slate-200 dark:border-white/10">
							<tr>
								<th className="px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-6 rounded-md bg-slate-200 dark:bg-white/10" />
								</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-20 rounded-md bg-slate-200 dark:bg-white/10" />
								</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-24 rounded-md bg-slate-200 dark:bg-white/10" />
								</th>
								<th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-28 rounded-md bg-slate-200 dark:bg-white/10" />
								</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-20 rounded-md bg-slate-200 dark:bg-white/10" />
								</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-12 rounded-md bg-slate-200 dark:bg-white/10" />
								</th>
								<th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-24 rounded-md bg-slate-200 dark:bg-white/10" />
								</th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: requestRowCount }, (_, i) => i + 1).map(
								(i) => (
									<tr key={i} className="border-b border-slate-200 dark:border-white/10">
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<Skeleton className="h-4 w-4 rounded-md bg-slate-200 dark:bg-white/10" />
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<div className="flex items-center gap-2 sm:gap-3">
												<Skeleton className="h-8 w-8 shrink-0 rounded-full bg-slate-200 sm:h-10 sm:w-10 dark:bg-white/10" />
												<Skeleton className="h-4 w-24 rounded-md bg-slate-200 dark:bg-white/10" />
											</div>
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<Skeleton className="h-4 w-36 rounded-md bg-slate-200 dark:bg-white/10" />
										</td>
										<td className="whitespace-nowrap px-4 py-4 sm:px-6 sm:py-5">
											<Skeleton className="h-4 w-16 rounded-md bg-slate-200 dark:bg-white/10" />
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<Skeleton className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-white/10" />
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<Skeleton className="h-4 w-24 rounded-md bg-slate-200 dark:bg-white/10" />
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<div className="flex flex-wrap items-center gap-2">
												<Skeleton className="h-9 w-20 rounded-xl bg-slate-200 dark:bg-white/10" />
												<Skeleton className="h-9 w-20 rounded-xl bg-slate-200 dark:bg-white/10" />
											</div>
										</td>
									</tr>
								),
							)}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
