/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function VendorContractsSkeleton() {
	return (
		<div className="space-y-6">
			{/* Tabs and description */}
			<div>
				<div className="flex flex-wrap items-center gap-3">
					<Skeleton className="h-10 w-40 rounded-xl" />
					<Skeleton className="h-10 w-40 rounded-xl" />
				</div>
				<Skeleton className="h-4 w-96 mt-3" />
			</div>

			{/* Stat cards + search */}
			<section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:col-span-1">
					<article className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-[#2C4264] dark:bg-[#1E293B]">
						<div className="mb-2 flex items-start justify-between">
							<Skeleton className="h-3 w-24" />
							<Skeleton className="h-3 w-3 rounded-full" />
						</div>
						<Skeleton className="h-5 w-8" />
					</article>
					<article className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-[#2C4264] dark:bg-[#1E293B]">
						<div className="mb-2 flex items-start justify-between">
							<Skeleton className="h-3 w-24" />
							<Skeleton className="h-3 w-3 rounded-full" />
						</div>
						<Skeleton className="h-5 w-8" />
					</article>
				</div>
				<div className="rounded-xl border border-slate-200 bg-white p-3 lg:col-span-2 dark:border-[#2C4264] dark:bg-[#1E293B]">
					<Skeleton className="h-14 w-full rounded-xl" />
				</div>
			</section>

			{/* Upload section */}
			<section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
				<Skeleton className="h-5 w-56 mb-4" />
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex flex-col gap-1">
							<Skeleton className="h-3 w-28" />
							<Skeleton className="h-11 w-full rounded-xl" />
						</div>
					))}
					<div className="flex flex-col gap-1">
						<Skeleton className="h-3 w-20" />
						<Skeleton className="h-11 w-32 rounded-xl" />
					</div>
				</div>
			</section>

			{/* Table section */}
			<section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
				<Skeleton className="h-5 w-48 mb-5" />
				<div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-[#2C4264]">
					<table className="min-w-full">
						<thead className="border-b border-slate-200 dark:border-[#2B405F]">
							<tr>
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<th key={i} className="px-5 py-4 text-left">
										<Skeleton className="h-4 w-20" />
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 dark:divide-[#2C4264]">
							{[1, 2, 3].map((i) => (
								<tr key={i}>
									{[1, 2, 3, 4, 5, 6].map((j) => (
										<td key={j} className="px-5 py-5">
											<Skeleton className="h-4 w-24" />
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
