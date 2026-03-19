/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

interface AdminDashboardSkeletonProps {
	/** Number of request rows to show (matches BenefitRequestsSection) */
	requestRowCount?: number;
}

export function AdminDashboardSkeleton({
	requestRowCount = 3,
}: AdminDashboardSkeletonProps) {
	return (
		<div className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden">
			<section className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_1fr] gap-8 px-6 py-6 overflow-hidden lg:grid-cols-[auto_1fr] lg:grid-rows-1">
				{/* Stat cards skeleton - matches DashboardStatCard (320px h, 454px w) */}
				<div className="flex flex-col gap-8 lg:min-w-[454px]">
					{[1, 2].map((i) => (
						<article
							key={i}
							className="flex h-[320px] w-full max-w-[454px] flex-col rounded-2xl bg-white px-[54px] py-[48px] shadow-[var(--shadow-card)] ring-1 ring-slate-200 dark:bg-transparent dark:shadow-lg dark:ring-white/10"
						>
							<div className="flex flex-1 flex-col justify-between gap-6">
								<div className="flex items-center gap-10">
									<Skeleton className="h-16 w-16 shrink-0 rounded-xl bg-slate-200 dark:bg-white/10" />
									<Skeleton className="h-6 w-32 rounded-md bg-slate-200 dark:bg-white/10" />
								</div>
								<div className="flex items-center justify-between gap-10">
									<Skeleton className="h-10 w-24 rounded-lg bg-slate-200 dark:bg-white/10" />
									<Skeleton className="h-[154px] w-24 rounded-md bg-slate-200 dark:bg-white/10" />
								</div>
							</div>
						</article>
					))}
				</div>

				{/* BenefitRequestsSection skeleton */}
				<article className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[var(--shadow-card)] sm:p-6 lg:h-[620px] dark:border-[rgba(38,38,38,1)] dark:bg-[rgba(13,94,85,0.1)] dark:shadow-none">
					<div className="mb-4 flex shrink-0 flex-col gap-3 px-6 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
						<Skeleton className="h-7 w-56 rounded-md bg-slate-200 dark:bg-white/10" />
						<div className="w-auto overflow-hidden rounded-2xl border border-slate-200 dark:border-white/30">
							<div className="flex h-[49px] w-[472px] gap-1.5 p-1.5">
								{[1, 2, 3, 4].map((i) => (
									<Skeleton key={i} className="h-full flex-1 rounded-2xl bg-slate-200 dark:bg-white/10" />
								))}
							</div>
						</div>
					</div>

					<div className="min-h-0 flex-1 divide-y divide-slate-200 px-8 pb-8 dark:divide-white/30">
						{Array.from({ length: requestRowCount }, (_, i) => i + 1).map(
							(i) => (
								<div
									key={i}
									className="flex items-center justify-between px-4 py-3"
								>
									<div className="flex min-w-0 flex-1 flex-col gap-3">
										<Skeleton className="h-3 w-16 rounded-md bg-slate-200 dark:bg-white/10" />
										<div className="flex items-center gap-3">
											<Skeleton className="h-12 w-12 shrink-0 rounded-full bg-slate-200 dark:bg-white/10" />
											<div className="min-w-0 flex-1 space-y-2">
												<Skeleton className="h-4 w-36 rounded-md bg-slate-200 dark:bg-white/10" />
												<Skeleton className="h-3 w-24 rounded-md bg-slate-200 dark:bg-white/10" />
												<Skeleton className="h-3 w-48 rounded-md bg-slate-200 dark:bg-white/10" />
											</div>
										</div>
									</div>
									<div className="flex shrink-0 gap-1.5">
										<Skeleton className="h-[38px] w-[94px] rounded-lg bg-slate-200 dark:bg-white/10" />
										<Skeleton className="h-[38px] w-[94px] rounded-lg bg-slate-200 dark:bg-white/10" />
									</div>
								</div>
							),
						)}
					</div>
				</article>
			</section>
		</div>
	);
}
