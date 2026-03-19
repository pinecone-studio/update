/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

interface EmployeeDashboardSkeletonProps {
	/** Number of benefit cards to show (matches dashboard's BenefitPortfolio) */
	benefitCount?: number;
}

export function EmployeeDashboardSkeleton({
	benefitCount = 6,
}: EmployeeDashboardSkeletonProps) {
	return (
		<div className="flex w-full flex-col">
			{/* Header section - matches lg:grid-cols-[minmax(0,1fr)_356px] */}
			<section className="grid w-full min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_356px] lg:items-start lg:gap-8">
				<div className="min-w-0 max-w-[780px]">
					<div className="mb-8 flex flex-col sm:mb-10">
						<Skeleton className="h-9 w-64 rounded-md bg-slate-200 sm:h-10 sm:w-80 dark:bg-white/10" />
						<Skeleton className="mt-3 h-6 w-80 max-w-[640px] rounded-md bg-slate-200 sm:h-7 sm:w-96 dark:bg-white/10" />
					</div>
					{/* Filter pills skeleton */}
					<div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:overflow-visible">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="h-[38px] w-[160px] shrink-0 rounded-[13px] border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5"
							>
								<div className="flex h-full items-center gap-[10px] px-[8px] py-[6px]">
									<Skeleton className="h-[26px] w-[26px] shrink-0 rounded-[8px] bg-slate-200 dark:bg-white/10" />
									<Skeleton className="h-4 w-16 rounded-md bg-slate-200 dark:bg-white/10" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Hero image placeholder */}
				<div className="w-full lg:justify-self-end">
					<div className="flex h-[180px] w-full items-center justify-center overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-lg dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:h-[260px] lg:h-[242px] lg:w-[356px]">
						<Skeleton className="h-[140px] w-40 rounded-lg bg-slate-200 sm:h-[200px] sm:w-48 lg:h-[190px] dark:bg-white/10" />
					</div>
				</div>
			</section>

			{/* Benefits section - matches BenefitPortfolio grid */}
			<section className="mt-12 w-full sm:mt-16">
				<div className="mb-6">
					<Skeleton className="h-6 w-32 rounded-md bg-slate-200 sm:h-7 sm:w-40 dark:bg-white/10" />
					<Skeleton className="mt-1 h-5 w-48 rounded-md bg-slate-200 dark:bg-white/10" />
				</div>
				<div className="grid w-full min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
					{Array.from({ length: benefitCount }, (_, i) => i + 1).map((i) => (
						<div
							key={i}
							className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
						>
							<div className="flex items-start gap-4">
								<Skeleton className="h-12 w-12 shrink-0 rounded-lg bg-slate-200 dark:bg-white/10" />
								<div className="min-w-0 flex-1 space-y-2">
									<Skeleton className="h-4 w-[75%] rounded-md bg-slate-200 dark:bg-white/10" />
									<Skeleton className="h-3 w-full rounded-md bg-slate-200 dark:bg-white/10" />
								</div>
								<Skeleton className="h-6 w-20 shrink-0 rounded-full bg-slate-200 dark:bg-white/10" />
							</div>
							<div className="mt-4 space-y-2">
								{[1, 2, 3].map((j) => (
									<div key={j} className="flex justify-between gap-2">
										<Skeleton className="h-3 w-16 rounded-md bg-slate-200 dark:bg-white/10" />
										<Skeleton className="h-3 w-20 rounded-md bg-slate-200 dark:bg-white/10" />
									</div>
								))}
							</div>
							<Skeleton className="mt-4 h-10 w-full rounded-lg bg-slate-200 dark:bg-white/10" />
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
