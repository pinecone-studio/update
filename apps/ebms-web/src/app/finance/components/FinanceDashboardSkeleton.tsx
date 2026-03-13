/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function FinanceDashboardSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header skeleton */}
			<header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<Skeleton className="h-8 w-56" />
					<Skeleton className="h-5 w-80 mt-2" />
				</div>
			</header>

			{/* Stat cards skeleton - 4 cards */}
			<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#2C4264] dark:bg-[#1E293B]"
					>
						<div className="mb-6 flex items-start justify-between">
							<Skeleton className="h-14 w-14 rounded-2xl flex-shrink-0" />
							<Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
						</div>
						<Skeleton className="h-6 w-16" />
						<Skeleton className="h-4 w-28 mt-2" />
						<div className="mt-4 h-px bg-slate-200 dark:bg-[#2B405F]" />
						<Skeleton className="h-4 w-24 mt-4" />
					</div>
				))}
			</section>

			{/* Financial Benefit Requests table skeleton */}
			<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#2C4264] dark:bg-[#1E293B]">
				<div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 dark:border-[#2B405F]">
					<div>
						<Skeleton className="h-5 w-48" />
						<Skeleton className="h-4 w-64 mt-1" />
					</div>
					<Skeleton className="h-4 w-28" />
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-5">
						<thead className="border-b border-slate-200 dark:border-[#2B405F]">
							<tr>
								<th className="px-6 py-4">
									<Skeleton className="h-4 w-6" />
								</th>
								<th className="px-6 py-4">
									<Skeleton className="h-4 w-20" />
								</th>
								<th className="px-6 py-4">
									<Skeleton className="h-4 w-24" />
								</th>
								<th className="px-4 py-4">
									<Skeleton className="h-4 w-28" />
								</th>
								<th className="px-6 py-4">
									<Skeleton className="h-4 w-20" />
								</th>
								<th className="px-6 py-4">
									<Skeleton className="h-4 w-12" />
								</th>
								<th className="px-6 py-4">
									<Skeleton className="h-4 w-16" />
								</th>
							</tr>
						</thead>
						<tbody>
							{[1, 2, 3].map((i) => (
								<tr
									key={i}
									className="border-b border-slate-200 dark:border-[#2B405F]"
								>
									<td className="px-6 py-5">
										<Skeleton className="h-4 w-4" />
									</td>
									<td className="px-6 py-5">
										<div className="flex items-center gap-3">
											<Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
											<Skeleton className="h-4 w-24" />
										</div>
									</td>
									<td className="px-6 py-5">
										<Skeleton className="h-4 w-36" />
									</td>
									<td className="px-4 py-5">
										<Skeleton className="h-4 w-16" />
									</td>
									<td className="px-6 py-5">
										<Skeleton className="h-6 w-20 rounded-lg" />
									</td>
									<td className="px-6 py-5">
										<Skeleton className="h-4 w-16" />
									</td>
									<td className="px-6 py-5">
										<div className="flex gap-2">
											<Skeleton className="h-9 w-20 rounded-xl" />
											<Skeleton className="h-9 w-20 rounded-xl" />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
