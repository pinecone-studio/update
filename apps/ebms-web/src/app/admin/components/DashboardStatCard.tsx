/** @format */

"use client";

import type { ReactNode } from "react";

type DashboardStatCardProps = {
	keyType: "employees" | "benefits";
	title: string;
	value: string;
	icon: ReactNode;
};

export function DashboardStatCard({
	keyType,
	title,
	value,
	icon,
}: DashboardStatCardProps) {
	const bgClasses =
		keyType === "employees"
			? "bg-violet-50 dark:bg-[rgb(225_42_251/0.1)]"
			: "bg-teal-50 dark:bg-[rgb(1_116_138/0.1)]";

	return (
		<article
			className={`flex w-full min-h-[240px] flex-col rounded-2xl px-6 py-6 text-left shadow-[var(--shadow-card)] ring-1 ring-slate-200 sm:min-h-[280px] sm:px-8 sm:py-8 lg:h-[320px] lg:w-[454px] lg:px-[54px] lg:py-[48px] dark:shadow-lg dark:ring-white/10 ${bgClasses}`}
		>
			<div className="flex flex-1 flex-col justify-between gap-4 sm:gap-6">
				<div className="flex items-center gap-4 sm:gap-10">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white sm:h-[64px] sm:w-[64px] dark:border-white/50 dark:bg-transparent">
						{icon}
					</div>
					<p className="text-lg font-semibold text-slate-900 sm:text-[24px] dark:text-[#FAFBFB]">
						{title}
					</p>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<p className="text-[154px] font-normal leading-none text-slate-900 dark:text-[#EDF6FF]">
						{value}
					</p>
				</div>
			</div>
		</article>
	);
}
