/** @format */

"use client";

import type { StatCard } from "../_lib/dashboard-types";

type FinanceStatCardProps = {
	card: StatCard;
	onClick: () => void;
};

export function FinanceStatCard({ card, onClick }: FinanceStatCardProps) {
	const isPendingCard = card.key === "pending";
	const isNoPending = isPendingCard && card.value === "0";
	const noteMatch = card.note.match(/(\d+%)(.*)/);

	return (
		<button
			type="button"
			onClick={onClick}
			className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-[var(--shadow-card)] transition hover:border-slate-300 hover:shadow-lg dark:border-white/10 dark:bg-transparent dark:shadow-none dark:hover:border-white/20 sm:p-5"
		>
			<div className="mb-4 flex justify-center">
				<p className="text-[22px] font-bold leading-tight text-slate-900 dark:text-[#E8F2FF]">
					{card.value}
				</p>
			</div>
			{isNoPending ? (
				<>
					<p className="mt-3 text-[20px] font-semibold leading-tight text-slate-900 dark:text-white">
						No Pending Requests
					</p>
					<p className="mt-3 text-[13px] leading-tight text-slate-600 dark:text-[#A7B6D3]">
						🎉 All requests are processed
					</p>
				</>
			) : (
				<>
					<p className="whitespace-nowrap text-[14px] font-semibold leading-tight text-slate-900 sm:text-[16px] dark:text-white">
						{card.title}
					</p>
					<div className="mt-3 h-px bg-slate-200 dark:bg-white/10" />
					<p className="mt-3 text-[13px] leading-tight text-slate-600 dark:text-[#A7B6D3]">
						{noteMatch ? (
							<>
								<span className="text-emerald-600 dark:text-[#00C95F]">{noteMatch[1]}</span>
								<span>{noteMatch[2]}</span>
							</>
						) : (
							card.note
						)}
					</p>
				</>
			)}
		</button>
	);
}
