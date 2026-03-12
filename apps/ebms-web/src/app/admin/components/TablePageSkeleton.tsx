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
				<section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
					{Array.from({ length: statCardCount }).map((_, i) => (
						<article
							key={i}
							className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-5"
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

			<section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
				<Skeleton className="h-6 w-48 mb-5" />
				<div className="overflow-x-auto">
					<table className="min-w-full text-left">
						<thead className="border-b border-[#2B405F]">
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
									className="border-b border-[#2B405F] last:border-b-0"
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
