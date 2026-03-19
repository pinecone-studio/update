/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function EmployeeEligibilitySkeleton() {
	return (
		<div className="space-y-6">
			{/* Header - matches EmployeeEligibilityHeader */}
			<div>
				<Skeleton className="h-[35px] w-80 rounded-md" />
				<Skeleton className="mt-3 h-5 w-96 max-w-md rounded-md" />
			</div>

			{/* Search bar - matches EmployeeSearchInput */}
			<section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/20 dark:bg-white/5">
				<div className="relative">
					<Skeleton className="h-14 w-full rounded-2xl bg-slate-200 dark:bg-white/10" />
				</div>
			</section>

			{/* Employee list - matches EmployeeListSection */}
			<section className="flex h-[450px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[var(--shadow-card)] dark:border-[rgba(38,38,38,1)] dark:bg-[rgba(13,94,85,0.1)] dark:shadow-none">
				<div className="grid grid-cols-[40px_1fr_1fr_auto] items-center gap-4 border-b border-slate-200 px-6 py-4 dark:border-white/10">
					<Skeleton className="h-4 w-4 rounded bg-slate-200 dark:bg-white/10" />
					<Skeleton className="h-4 w-20 rounded bg-slate-200 dark:bg-white/10" />
					<Skeleton className="h-4 w-12 rounded bg-slate-200 dark:bg-white/10" />
					<Skeleton className="h-4 w-14 rounded bg-slate-200 dark:bg-white/10" />
				</div>
				<div className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-6 pb-6">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div
							key={i}
							className="-mx-6 grid grid-cols-[40px_1fr_1fr_auto] items-center gap-4 border-b border-slate-100 px-6 py-3 last:border-b-0 dark:border-white/5"
						>
							<Skeleton className="h-4 w-4 rounded bg-slate-200 dark:bg-white/10" />
							<div className="flex min-w-0 items-center gap-3">
								<Skeleton className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-white/10" />
								<Skeleton className="h-4 w-32 rounded bg-slate-200 dark:bg-white/10" />
							</div>
							<Skeleton className="h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
							<Skeleton className="h-9 w-16 rounded-lg bg-slate-200 dark:bg-white/10" />
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
