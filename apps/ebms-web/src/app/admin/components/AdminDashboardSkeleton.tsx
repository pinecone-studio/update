/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function AdminDashboardSkeleton() {
	return (
		<>
			{/* Header skeleton */}
			<div className="mb-10">
				<Skeleton className="h-9 w-48" />
				<Skeleton className="h-5 w-80 mt-3" />
			</div>

			{/* Stat cards skeleton */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{[1, 2].map((i) => (
					<article
						key={i}
						className="flex items-start justify-between rounded-3xl border border-slate-200 bg-white px-8 py-7 dark:border-[#2C4264] dark:bg-[#1E293B]"
					>
						<div>
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-8 w-20 mt-2" />
						</div>
						<Skeleton className="h-12 w-12 rounded-2xl flex-shrink-0" />
					</article>
				))}
			</div>

			{/* Employee Benefit Requests section skeleton */}
			<article className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 dark:border-[#2C4264] dark:bg-[#1E293B]">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
					<Skeleton className="h-6 w-52" />
					<div className="flex gap-2">
						{[1, 2, 3, 4].map((i) => (
							<Skeleton key={i} className="h-9 w-20 rounded-xl" />
						))}
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-5">
						<thead className="border-b border-slate-200 dark:border-[#2B405F]">
							<tr>
								<th className="px-4 py-4">
									<Skeleton className="h-4 w-32" />
								</th>
								<th className="px-4 py-4">
									<Skeleton className="h-4 w-20" />
								</th>
								<th className="px-4 py-4">
									<Skeleton className="h-4 w-16" />
								</th>
								<th className="px-4 py-4">
									<Skeleton className="h-4 w-16" />
								</th>
								<th className="px-4 py-4">
									<Skeleton className="h-4 w-16" />
								</th>
							</tr>
						</thead>
						<tbody>
							{[1, 2, 3, 4, 5].map((i) => (
								<tr
									key={i}
									className="border-b border-slate-200 last:border-b-0 dark:border-[#2B405F]"
								>
									<td className="px-4 py-4">
										<Skeleton className="h-4 w-36" />
									</td>
									<td className="px-4 py-4">
										<Skeleton className="h-4 w-24" />
									</td>
									<td className="px-4 py-4">
										<Skeleton className="h-6 w-16 rounded-xl" />
									</td>
									<td className="px-4 py-4">
										<Skeleton className="h-4 w-28" />
									</td>
									<td className="px-4 py-4">
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
			</article>
		</>
	);
}
