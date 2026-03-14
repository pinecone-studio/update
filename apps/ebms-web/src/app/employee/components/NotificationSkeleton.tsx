/** @format */

"use client";

import { Skeleton } from "@/app/_components/Skeleton";

export function NotificationSkeleton() {
	return (
		<div className="w-full max-w-[1500px]">
			<div className="flex items-center gap-4">
				<Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
				<div className="flex flex-col gap-1">
					<Skeleton className="h-7 w-40" />
					<Skeleton className="h-4 w-64" />
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 w-full">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between dark:bg-[#1E293B] dark:border-[#2d3a4d]"
					>
						<div>
							<Skeleton className="h-3 w-16" />
							<Skeleton className="h-6 w-8 mt-2" />
						</div>
						<Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
					</div>
				))}
			</div>

			<div className="flex w-full flex-wrap justify-center gap-3 md:gap-6 mt-6">
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-9 w-28 rounded-full" />
				))}
			</div>

			<div className="w-full bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 mt-6 dark:bg-[#1E293B] dark:border-[#2d3a4d]">
				<Skeleton className="h-5 w-5 flex-shrink-0" />
				<Skeleton className="h-4 flex-1" />
				<Skeleton className="h-8 w-28 rounded-full flex-shrink-0" />
			</div>

			<div className="w-full space-y-3 mt-6">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="bg-white border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-4 dark:bg-[#1E293B] dark:border-[#2d3a4d]"
					>
						<div className="flex items-start gap-3 flex-1">
							<Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
							<div className="flex-1 min-w-0">
								<Skeleton className="h-4 w-48" />
								<Skeleton className="h-3 w-full mt-2" />
								<Skeleton className="h-3 w-20 mt-2" />
							</div>
						</div>
						<Skeleton className="h-4 w-24 flex-shrink-0" />
					</div>
				))}
			</div>
		</div>
	);
}
