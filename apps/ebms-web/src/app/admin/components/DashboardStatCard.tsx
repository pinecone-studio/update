/** @format */

"use client";

import type { ReactNode } from "react";

type DashboardStatCardProps = {
	keyType: "employees" | "benefits";
	title: string;
	value: string;
	icon: ReactNode;
	onClick?: () => void;
};

export function DashboardStatCard({
	keyType,
	title,
	value,
	icon,
	onClick,
}: DashboardStatCardProps) {
	const bgStyle =
		keyType === "employees"
			? "rgba(225, 42, 251, 0.1)"
			: "rgba(1, 116, 138, 0.1)";

	return (
		<article
			className={`flex w-full min-h-[180px] flex-col rounded-2xl px-4 py-4 text-left shadow-lg ring-1 ring-slate-200 sm:min-h-[240px] sm:px-6 sm:py-6 dark:ring-white/10 md:min-h-[280px] md:px-8 md:py-8 lg:h-[320px] lg:min-w-[280px] lg:max-w-[454px] lg:px-[54px] lg:py-[48px] ${
				onClick ? "cursor-pointer transition hover:opacity-95" : ""
			}`}
			style={{ background: bgStyle }}
			onClick={onClick}
			onKeyDown={
				onClick
					? (e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								onClick();
							}
						}
					: undefined
			}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
		>
			<div className="flex flex-1 flex-col justify-between gap-4 sm:gap-6">
				<div className="flex items-center gap-4 sm:gap-10">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-300 text-slate-700 sm:h-[64px] sm:w-[64px] dark:border-white/50 dark:text-white">
						{icon}
					</div>
					<p className="text-lg font-semibold text-slate-900 sm:text-[24px] dark:text-[#FAFBFB]">
						{title}
					</p>
				</div>
				<div className="flex flex-1 items-center justify-center overflow-hidden">
					<p className="text-5xl font-normal leading-none text-slate-800 sm:text-7xl md:text-8xl dark:text-[#EDF6FF] lg:text-[100px] xl:text-[154px]">
						{value}
					</p>
				</div>
			</div>
		</article>
	);
}
