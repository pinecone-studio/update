/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function AuditLogSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header with Export button */}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<Skeleton className="h-7 w-48" />
					<Skeleton className="h-4 w-80 mt-3" />
				</div>
				<Skeleton className="h-12 w-36 rounded-2xl" />
			</div>

			{/* Filters section */}
			<section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
				<div className="mb-5 flex items-center justify-between">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-9 w-24 rounded-xl" />
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-14 w-full rounded-2xl" />
						</div>
					))}
				</div>
			</section>

			<Skeleton className="h-4 w-48" />

			{/* Audit Trail section - entry cards */}
			<section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
				<Skeleton className="h-6 w-32 mb-5" />
				<div className="space-y-5">
					{[1, 2, 3].map((i) => (
						<article
							key={i}
							className="rounded-3xl border border-[#324A70] bg-[#23324C] p-5"
						>
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div className="flex items-center gap-3">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-6 w-28 rounded-xl" />
								</div>
								<Skeleton className="h-4 w-20" />
							</div>
							<Skeleton className="h-4 w-48 mt-3" />
							<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
								<Skeleton className="h-16 w-full rounded-2xl" />
								<Skeleton className="h-16 w-full rounded-2xl" />
							</div>
							<Skeleton className="h-16 w-full rounded-2xl mt-4" />
							<Skeleton className="h-20 w-full rounded-2xl mt-4" />
						</article>
					))}
				</div>
			</section>
		</div>
	);
}
