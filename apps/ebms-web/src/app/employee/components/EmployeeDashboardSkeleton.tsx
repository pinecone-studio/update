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
		<div className="flex w-full min-w-0 flex-col">
			{/* Header section - matches EmployeeDashboardOverview */}
			<section className="grid w-full min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_356px] xl:gap-8">
				<div className="min-w-0 max-w-[780px]">
					<div className="mb-4 flex flex-col sm:mb-8">
						<Skeleton className="h-7 w-64 rounded-md bg-slate-200 sm:h-9 sm:w-72 lg:h-10 lg:w-80 dark:bg-white/10" />
						<Skeleton className="mt-2 h-5 w-72 max-w-[640px] rounded-md bg-slate-200 sm:mt-3 sm:h-6 sm:w-80 lg:h-7 lg:w-96 dark:bg-white/10" />
					</div>
					{/* Filter pills skeleton - matches grid grid-cols-2 sm:flex, pill h-[48px] sm:h-[40px] sm:w-[150px] lg:w-[138px] xl:w-[160px] */}
					<div className="grid grid-cols-2 gap-2 pb-1 sm:flex sm:flex-nowrap sm:gap-2 sm:overflow-x-auto sm:px-1 lg:overflow-visible lg:px-0">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="flex h-[48px] w-full min-w-0 shrink-0 items-center gap-2 rounded-[13px] border border-slate-200 bg-slate-100 px-3 py-1.5 sm:h-[40px] sm:w-[150px] lg:w-[138px] xl:w-[160px] dark:border-white/10 dark:bg-white/5"
							>
								<Skeleton className="h-[26px] w-[26px] shrink-0 rounded-[8px] bg-slate-200 dark:bg-white/10" />
								<Skeleton className="h-4 w-16 flex-1 rounded-md bg-slate-200 dark:bg-white/10" />
							</div>
						))}
					</div>
				</div>

				{/* Hero card - matches rounded-2xl min-h-[180px] sm:h-[236px] lg:h-[242px] */}
				<div className="mt-4 w-full lg:mt-6 lg:pr-[10px]">
					<div className="relative flex min-h-[180px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-lg dark:border-white/20 dark:bg-white/5 dark:shadow-[0_25px_50px_rgba(0,0,0,0.4)] sm:h-[236px] sm:p-6 lg:h-[242px] lg:w-full">
						<div className="flex flex-1 flex-col gap-4">
							<Skeleton className="h-8 w-32 rounded-full bg-slate-200 dark:bg-white/10" />
							<div className="space-y-2">
								<Skeleton className="h-7 w-40 rounded-md bg-slate-200 sm:h-8 lg:h-9 dark:bg-white/10" />
								<Skeleton className="h-4 w-48 rounded-md bg-slate-200 dark:bg-white/10" />
							</div>
							<Skeleton className="mt-2 h-10 w-28 rounded-[15px] bg-slate-200 dark:bg-white/10" />
						</div>
						<Skeleton className="absolute right-[-10px] bottom-[-10px] h-[118px] w-24 rounded-lg bg-slate-200 sm:right-[-15px] sm:bottom-[-14px] sm:h-[165px] lg:h-[172px] dark:bg-white/10" />
					</div>
				</div>
			</section>

			{/* Benefits section - matches page section mt-2 sm:mt-8 lg:mt-10, BenefitPortfolio grid */}
			<section className="mt-2 w-full sm:mt-8 lg:mt-10">
				<div className="mb-4 sm:mb-6">
					<Skeleton className="h-5 w-28 rounded-md bg-slate-200 sm:h-6 sm:w-36 dark:bg-white/10" />
					<Skeleton className="mt-1 h-4 w-44 rounded-md bg-slate-200 sm:h-[15px] dark:bg-white/10" />
				</div>
				<div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
					{Array.from({ length: benefitCount }, (_, i) => i + 1).map((i) => (
						<div
							key={i}
							className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-white/5 sm:p-5"
						>
							<div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
								<div className="flex min-w-0 items-start gap-3 sm:gap-4">
									<Skeleton className="h-[52px] w-[52px] shrink-0 rounded-xl bg-slate-200 sm:h-[58px] sm:w-[58px] dark:bg-white/10" />
									<div className="min-w-0 flex-1 space-y-2">
										<Skeleton className="h-4 w-[75%] rounded-md bg-slate-200 dark:bg-white/10" />
										<Skeleton className="h-3 w-20 rounded-md bg-slate-200 dark:bg-white/10" />
									</div>
								</div>
								<Skeleton className="h-6 w-16 shrink-0 rounded-full bg-slate-200 dark:bg-white/10" />
							</div>
							<div className="h-px bg-slate-200 dark:bg-white/10" />
							<div className="mt-3 space-y-2">
								{[1, 2, 3].map((j) => (
									<div key={j} className="flex justify-between gap-2 border-b border-slate-200 py-2 dark:border-white/10">
										<Skeleton className="h-3 w-16 rounded-md bg-slate-200 dark:bg-white/10" />
										<Skeleton className="h-3 w-20 rounded-md bg-slate-200 dark:bg-white/10" />
									</div>
								))}
							</div>
							<Skeleton className="mt-4 h-10 w-full rounded-xl bg-slate-200 sm:h-11 dark:bg-white/10" />
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
