/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

interface EmployeeDashboardSkeletonProps {
	/** Number of benefit cards to show (matches dashboard's BenefitPortfolio) */
	benefitCount?: number;
}

export function EmployeeDashboardSkeleton({
	benefitCount = 4,
}: EmployeeDashboardSkeletonProps) {
	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-12 w-full min-h-0">
			{/* Stats cards skeleton - matches lg:col-span-7 layout */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-7 min-h-0">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="min-w-0 rounded-[10px] bg-white border border-slate-200 p-6 flex flex-col min-h-[134px] dark:bg-[#334155] dark:border-transparent"
					>
						<div className="flex justify-between items-start">
							<div className="flex-1">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-12 w-16 mt-3" />
								<Skeleton className="h-4 w-28 mt-3" />
							</div>
							<Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
						</div>
					</div>
				))}
			</div>

			{/* Benefit Portfolio section skeleton - matches lg:col-span-5 layout */}
			<div className="rounded-2xl bg-white border border-slate-200/80 p-5 dark:bg-slate-800/50 dark:border-slate-700/80 lg:col-span-5 h-[480px] flex flex-col overflow-hidden">
				<div className="flex-shrink-0 mb-4 flex flex-wrap items-center justify-between gap-3">
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-9 w-14 rounded-xl" />
				</div>
				<div className="flex-1 min-h-0 overflow-hidden space-y-4">
					{Array.from({ length: benefitCount }, (_, i) => i + 1).map((i) => (
						<div
							key={i}
							className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4"
						>
							<div className="flex items-start gap-4 mb-3">
								<Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
								<div className="flex-1 min-w-0 space-y-2">
									<Skeleton className="h-4 w-[75%]" />
									<Skeleton className="h-3 w-full" />
								</div>
								<Skeleton className="w-14 h-5 rounded-full flex-shrink-0" />
							</div>
							<div className="space-y-2">
								{[1, 2, 3].map((j) => (
									<div key={j} className="flex justify-between gap-2">
										<Skeleton className="h-3 w-16" />
										<Skeleton className="h-3 w-20" />
									</div>
								))}
							</div>
							<Skeleton className="h-9 w-full rounded-lg mt-3" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
