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
							className="min-w-0 rounded-3xl border border-[rgba(96,126,186,0.42)] bg-[radial-gradient(circle_at_20%_118%,rgba(248,160,89,0.05),transparent_52%),radial-gradient(circle_at_88%_14%,rgba(86,124,255,0.03),transparent_46%),linear-gradient(160deg,rgba(62,34,111,0.28),rgba(37,30,98,0.24))] p-5 backdrop-blur-[1px]"
						>
							<div className="mb-4 flex justify-center">
								<Skeleton className="h-7 w-16 rounded-md bg-white/10" />
							</div>
							<Skeleton className="h-4 w-24 rounded-md bg-white/10 sm:h-[16px] sm:w-28" />
							<div className="mt-3 h-px bg-[#2B405F]" />
							<Skeleton className="mt-3 h-3 w-32 rounded-md bg-white/10" />
						</div>
					))}
				</div>

				{/* Right widgets skeleton - matches FinanceRightWidgets */}
				<div className="xl:h-full">
					<aside className="flex h-full w-full flex-col gap-4 overflow-hidden">
						<div className="flex-1 rounded-3xl border border-[rgba(63,91,138,0.44)] bg-[radial-gradient(circle_at_90%_10%,rgba(76,114,255,0.05),transparent_48%),linear-gradient(160deg,rgba(28,29,82,0.28),rgba(22,37,79,0.24))] p-4 backdrop-blur-[1px] sm:p-5">
							<div className="flex items-center justify-between">
								<Skeleton className="h-5 w-28 rounded-md bg-white/10" />
								<Skeleton className="h-4 w-16 rounded-md bg-white/10" />
							</div>
							<div className="mt-3 flex flex-col gap-3">
								{[1, 2].map((j) => (
									<div
										key={j}
										className="flex items-start gap-3 border-b border-[#2B405F] pb-3 last:border-b-0 last:pb-0"
									>
										<Skeleton className="h-8 w-8 shrink-0 rounded-lg bg-white/10" />
										<div className="flex-1 space-y-1">
											<Skeleton className="h-4 w-full rounded-md bg-white/10" />
											<Skeleton className="h-3 w-16 rounded-md bg-white/10" />
										</div>
									</div>
								))}
							</div>
						</div>
					</aside>
				</div>
			</section>

			{/* Financial Benefit Requests table skeleton - matches FinanceRequestsSection */}
			<section className="h-full overflow-hidden rounded-3xl border border-[rgba(63,91,138,0.44)] bg-[radial-gradient(circle_at_18%_8%,rgba(72,97,205,0.06),transparent_48%),linear-gradient(155deg,rgba(29,28,87,0.28),rgba(28,47,103,0.24))] backdrop-blur-[1px]">
				<div className="flex flex-col gap-4 border-b border-[#2B405F] px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 sm:py-5">
					<Skeleton className="h-5 w-48 rounded-md bg-white/10" />
					<div className="flex flex-wrap items-center gap-2">
						{[1, 2, 3, 4].map((i) => (
							<Skeleton key={i} className="h-9 w-20 rounded-xl bg-white/10" />
						))}
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-[15px] leading-tight">
						<thead className="border-b border-[#2B405F]">
							<tr>
								<th className="px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-6 rounded-md bg-white/10" />
								</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-20 rounded-md bg-white/10" />
								</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-24 rounded-md bg-white/10" />
								</th>
								<th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-28 rounded-md bg-white/10" />
								</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-20 rounded-md bg-white/10" />
								</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-12 rounded-md bg-white/10" />
								</th>
								<th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
									<Skeleton className="h-4 w-24 rounded-md bg-white/10" />
								</th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: requestRowCount }, (_, i) => i + 1).map(
								(i) => (
									<tr key={i} className="border-b border-[#2B405F]">
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<Skeleton className="h-4 w-4 rounded-md bg-white/10" />
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<div className="flex items-center gap-2 sm:gap-3">
												<Skeleton className="h-8 w-8 shrink-0 rounded-full bg-white/10 sm:h-10 sm:w-10" />
												<Skeleton className="h-4 w-24 rounded-md bg-white/10" />
											</div>
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<Skeleton className="h-4 w-36 rounded-md bg-white/10" />
										</td>
										<td className="whitespace-nowrap px-4 py-4 sm:px-6 sm:py-5">
											<Skeleton className="h-4 w-16 rounded-md bg-white/10" />
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<Skeleton className="h-6 w-20 rounded-lg bg-white/10" />
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<Skeleton className="h-4 w-24 rounded-md bg-white/10" />
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<div className="flex flex-wrap items-center gap-2">
												<Skeleton className="h-9 w-20 rounded-xl bg-white/10" />
												<Skeleton className="h-9 w-20 rounded-xl bg-white/10" />
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
