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
		<>
			{/* Header skeleton */}
			<div className="flex flex-col mb-8">
				<Skeleton className="h-9 w-72" />
				<Skeleton className="h-5 w-96 mt-3" />
			</div>

			{/* Stats cards skeleton */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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

			{/* Benefit Portfolio section skeleton */}
			<div className="mt-8 mb-6">
				<Skeleton className="h-6 w-40" />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full min-w-0">
				{Array.from({ length: benefitCount }, (_, i) => i + 1).map((i) => (
					<div
						key={i}
						className="w-full min-w-0 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-inner dark:bg-[#1A2536] dark:border-[#2d3a4d]"
					>
						<div className="p-5 pt-4 flex flex-col">
							<div className="flex items-start gap-4 mb-5">
								<Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
								<div className="flex-1 min-w-0 space-y-2">
									<Skeleton className="h-5 w-[75%]" />
									<Skeleton className="h-4 w-full" />
								</div>
								<Skeleton className="w-16 h-6 rounded-full flex-shrink-0" />
							</div>
							<div className="space-y-3 mb-5 pb-5 border-b border-slate-200 dark:border-[#2d3a4d]">
								{[1, 2, 3, 4].map((j) => (
									<div key={j} className="flex justify-between gap-2">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-24" />
									</div>
								))}
							</div>
							<Skeleton className="h-10 w-full rounded-lg" />
						</div>
					</div>
				))}
			</div>

			{/* Feedback section skeleton */}
			<div className="mt-10 mb-6">
				<Skeleton className="h-6 w-24" />
				<Skeleton className="h-4 w-80 mt-3" />
			</div>
			<div className="rounded-[10px] bg-white border border-slate-200 p-6 dark:bg-[#334155] dark:border-transparent">
				<Skeleton className="h-4 w-32 mb-3" />
				<Skeleton className="h-24 w-full rounded-lg" />
				<Skeleton className="h-10 w-36 mt-4 rounded-lg" />
			</div>
		</>
	);
}
