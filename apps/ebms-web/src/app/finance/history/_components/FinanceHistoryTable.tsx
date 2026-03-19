/** @format */

"use client";

import { useCallback } from "react";
import {
	fetchBenefitRequestContractHtml,
	getFinanceClient,
} from "../../_lib/api";
import type { BenefitRequest } from "../../_lib/api";

function formatDateTime(raw: string) {
	const date = new Date(raw);
	if (Number.isNaN(date.getTime())) return raw;
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

type FinanceHistoryTableProps = {
	entries: BenefitRequest[];
	onError?: (msg: string) => void;
};

export function FinanceHistoryTable({
	entries,
	onError,
}: FinanceHistoryTableProps) {
	const handleViewContract = useCallback(
		async (requestId: string) => {
			try {
				const html = await fetchBenefitRequestContractHtml(
					getFinanceClient(),
					requestId,
				);
				const popup = window.open("", "_blank", "noopener,noreferrer");
				if (popup) {
					popup.document.open();
					popup.document.write(html);
					popup.document.close();
				}
			} catch (e) {
				const msg = e instanceof Error ? e.message : "Failed to open contract";
				onError?.(msg);
				if (!onError) alert(msg);
			}
		},
		[onError],
	);

	return (
		<section className="overflow-hidden rounded-3xl dark:bg-[#20194D80]/50 p-2">
			<div className="overflow-x-auto">
				<table className="min-w-full text-left text-5">
					<thead className="border-b border-white/5 text-slate-500 dark:text-[#A7B6D3]">
						<tr>
							<th className="px-4 py-4 font-medium sm:px-6">№</th>
							<th className="px-4 py-4 font-medium sm:px-6">Time</th>
							<th className="px-4 py-4 font-medium sm:px-6">User</th>
							<th className="px-4 py-4 font-medium sm:px-6">Action</th>
							<th className="px-4 py-4 font-medium sm:px-6">Benefit</th>
							<th className="px-4 py-4 font-medium sm:px-6">Result</th>
							<th className="px-4 py-4 font-medium sm:px-6">Contract</th>
							<th className="px-4 py-4 font-medium sm:px-6">Log ID</th>
						</tr>
					</thead>
					<tbody>
						{entries.map((entry, idx) => {
							const oldStatus =
								entry.status === "APPROVED" || entry.status === "REJECTED"
									? "ADMIN_APPROVED"
									: "PENDING";
							const newStatus = entry.status;
							const actionLabel =
								entry.status === "APPROVED"
									? "Request Approved"
									: "Request Rejected";
							return (
								<tr
									key={entry.id}
									className="border-b border-white/5 last:border-b-0"
								>
									<td className="px-4 py-5 font-semibold text-slate-900 dark:text-white sm:px-6">
										{idx + 1}
									</td>
									<td className="whitespace-nowrap px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
										{formatDateTime(entry.createdAt)}
									</td>
									<td className="px-4 py-5 sm:px-6">
										<p className="font-semibold text-slate-900 dark:text-white">
											{entry.employeeName ?? entry.employeeId}
										</p>
										<p className="text-xs text-slate-500 dark:text-[#8FA3C5]">
											{entry.employeeId}
										</p>
									</td>
									<td className="px-4 py-5 font-medium text-slate-800 dark:text-[#D4DEEF] sm:px-6">
										{actionLabel}
									</td>
									<td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
										{entry.benefitName ?? entry.benefitId}
									</td>
									<td className="px-4 py-5 sm:px-6">
										<div className="flex flex-wrap items-center gap-2">
											<span className="text-xs font-medium text-slate-700 dark:text-[#C7D6EF]">
												{oldStatus}
											</span>
											<span className="text-slate-400 dark:text-[#6B7B9E]">
												→
											</span>
											<span className="text-xs font-medium text-slate-700 dark:text-[#C7D6EF]">
												{newStatus}
											</span>
										</div>
									</td>
									<td className="px-4 py-5 sm:px-6">
										{entry.contractTemplateUrl || entry.requiresContract ? (
											<button
												type="button"
												onClick={() => handleViewContract(entry.id)}
												className="cursor-pointer text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
											>
												View contract
											</button>
										) : (
											<span className="text-slate-400 dark:text-slate-500">
												—
											</span>
										)}
									</td>
									<td className="px-4 py-5 font-mono text-xs text-slate-500 dark:text-[#8FA3C5] sm:px-6">
										{entry.id.slice(0, 8)}…
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{entries.length === 0 && (
				<p className="border-t border-slate-200 px-4 py-3 text-5 text-slate-500 dark:border-[#22395A] dark:text-[#A7B6D3] sm:px-6">
					No records found matching your selected search/filter.
				</p>
			)}
		</section>
	);
}
