/** @format */

"use client";

import React from "react";

export function FinanceRightWidgets() {
	return (
		<aside className="flex h-full w-full flex-col gap-4 overflow-hidden">
			<div className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] dark:border-white/10 dark:bg-transparent dark:shadow-none sm:p-5">
				<div className="flex items-center justify-between">
					<h3 className="text-5 font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
					<button className="text-5 text-slate-600 hover:text-slate-900 dark:text-[#A7B6D3] dark:hover:text-white">
						View All ›
					</button>
				</div>
				<div className="mt-3 flex flex-col gap-3">
					<div className="flex items-start gap-3 border-b border-slate-200 pb-3 dark:border-white/10">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
							✓
						</div>
						<div className="flex-1">
							<p className="text-5 font-medium text-slate-900 dark:text-white">
								Bat approved Gym benefit — ₹200K
							</p>
							<p className="text-4 text-slate-500 dark:text-[#8FA3C5]">1 day ago</p>
						</div>
					</div>

					<div className="flex items-start gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
							▣
						</div>
						<div className="flex-1">
							<p className="text-5 font-medium text-slate-900 dark:text-white">
								Sara requested Laptop — Pending
							</p>
							<p className="text-4 text-slate-500 dark:text-[#8FA3C5]">2 days ago</p>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}

export default FinanceRightWidgets;
