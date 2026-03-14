/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

interface TablePageSkeletonProps {
	statCardCount?: number;
	tableRowCount?: number;
	tableColCount?: number;
}

export function TablePageSkeleton({
	statCardCount = 4,
	tableRowCount = 5,
	tableColCount = 5,
}: TablePageSkeletonProps) {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-7 w-64" />
				<Skeleton className="h-4 w-96 mt-3" />
			</div>

			{statCardCount > 0 && (
				<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: statCardCount }).map((_, i) => (
						<article
							key={i}
							className="min-w-0 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-[#2C4264] dark:bg-[#1E293B]"
						>
							<div className="mb-4 flex items-start justify-between">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-4 rounded-full" />
							</div>
							<Skeleton className="h-6 w-16" />
						</article>
					))}
				</section>
			)}

			<section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
				<Skeleton className="h-6 w-48 mb-5" />
				<div className="overflow-x-auto">
					<table className="min-w-full text-left">
						<thead className="border-b border-slate-200 dark:border-[#2B405F]">
							<tr>
								{Array.from({ length: tableColCount }).map((_, i) => (
									<th key={i} className="px-4 py-4">
										<Skeleton className="h-4 w-20" />
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: tableRowCount }).map((_, i) => (
								<tr
									key={i}
									className="border-b border-slate-200 last:border-b-0 dark:border-[#2B405F]"
								>
									{Array.from({ length: tableColCount }).map((_, j) => (
										<td key={j} className="px-4 py-4">
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
