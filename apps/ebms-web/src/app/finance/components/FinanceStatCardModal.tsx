/** @format */

"use client";

import type { StatCard } from "../_lib/dashboard-types";

type FinanceStatCardModalProps = {
	card: StatCard;
	onClose: () => void;
};

export function FinanceStatCardModal({
	card,
	onClose,
}: FinanceStatCardModalProps) {
	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
			<div className="w-full max-w-[560px] rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
				<div className="flex items-start justify-between">
					<div>
						<p className="text-5 text-slate-600">{card.title}</p>
						<p className="mt-3 text-5 font-bold text-black">{card.value}</p>
						<p className="mt-3 text-5 text-slate-600">{card.note}</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-slate-300 px-3 py-1 text-5 text-slate-600 hover:bg-slate-100"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
