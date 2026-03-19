/** @format */

"use client";

import { useCallback } from "react";
import { openAdminContractByRequestId } from "../../_lib/api";
import type { AuditEntry } from "../_lib/types";

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

type AuditLogTableProps = {
	entries: AuditEntry[];
};

export function AuditLogTable({ entries }: AuditLogTableProps) {
	const handleViewContract = useCallback(async (requestId: string) => {
		try {
			await openAdminContractByRequestId(requestId);
		} catch (e) {
			alert(e instanceof Error ? e.message : "Failed to open contract");
		}
	}, []);
	return (
		<section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-2 dark:border-white/10 dark:bg-[#16142a]">
			<div className="space-y-3 p-2 sm:hidden">
				{entries.map((entry, idx) => {
					let oldStatus = (entry.oldStatus ?? "").toUpperCase().trim();
					if (!oldStatus) {
						if (entry.status === "ACTIVE") oldStatus = "ELIGIBLE";
						else if (entry.status === "ELIGIBLE") oldStatus = "PENDING";
						else if (entry.status === "REJECTED") oldStatus = "PENDING";
						else oldStatus = "LOCKED";
					}
					const newStatus = entry.status;
					return (
						<div
							key={entry.id}
							className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
						>
							<div className="mb-3 flex items-start justify-between gap-3">
								<div>
									<p className="text-xs text-slate-500 dark:text-[#A7B6D3]">№ {idx + 1}</p>
									<p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
										{entry.action}
									</p>
								</div>
								<p className="text-right text-[11px] text-slate-500 dark:text-[#A7B6D3]">
									{formatDateTime(entry.timestamp)}
								</p>
							</div>

							<div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
								<div>
									<p className="text-slate-500 dark:text-[#A7B6D3]">Processed by</p>
									<p className="mt-1 font-semibold text-slate-900 dark:text-white">
										{entry.performedBy}
									</p>
								</div>
								<div>
									<p className="text-slate-500 dark:text-[#A7B6D3]">Benefit</p>
									<p className="mt-1 text-slate-900 dark:text-white">{entry.benefit}</p>
								</div>
								<div>
									<p className="text-slate-500 dark:text-[#A7B6D3]">Result</p>
									<div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-[#C7D6EF]">
										<span>{oldStatus}</span>
										<span className="text-slate-400 dark:text-[#6B7B9E]">→</span>
										<span>{newStatus}</span>
									</div>
								</div>
								<div>
									<p className="text-slate-500 dark:text-[#A7B6D3]">Log ID</p>
									<p className="mt-1 font-mono text-[11px] text-slate-700 dark:text-[#8FA3C5]">
										{entry.id.slice(0, 8)}…
									</p>
								</div>
							</div>

							<div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-white/10">
								<span className="text-[11px] text-slate-500 dark:text-[#A7B6D3]">
									{entry.employee}
								</span>
								{entry.uploadedContractRequestId ? (
									<button
										type="button"
										onClick={() =>
											handleViewContract(entry.uploadedContractRequestId!)
										}
										className="cursor-pointer text-xs font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
									>
										View contract
									</button>
								) : (
									<span className="text-xs text-slate-400 dark:text-slate-500">—</span>
								)}
							</div>
						</div>
					);
				})}
			</div>

			<div className="hidden overflow-x-auto sm:block">
				<table className="min-w-full text-left text-5">
					<thead className="border-b border-slate-200 text-slate-500 dark:border-white/5 dark:text-[#A7B6D3]">
						<tr>
							<th className="px-4 py-4 font-medium sm:px-6">№</th>
							<th className="px-4 py-4 font-medium sm:px-6">Time</th>
							<th className="px-4 py-4 font-medium sm:px-6">Processed by</th>
							<th className="px-4 py-4 font-medium sm:px-6">Action</th>
							<th className="px-4 py-4 font-medium sm:px-6">Benefit</th>
							<th className="px-4 py-4 font-medium sm:px-6">Result</th>
							<th className="px-4 py-4 font-medium sm:px-6">Contract</th>
							<th className="px-4 py-4 font-medium sm:px-6">Log ID</th>
						</tr>
					</thead>
					<tbody>
						{entries.map((entry, idx) => {
							let oldStatus = (entry.oldStatus ?? "").toUpperCase().trim();
							if (!oldStatus) {
								if (entry.status === "ACTIVE") oldStatus = "ELIGIBLE";
								else if (entry.status === "ELIGIBLE") oldStatus = "PENDING";
								else if (entry.status === "REJECTED") oldStatus = "PENDING";
								else oldStatus = "LOCKED";
							}
							const newStatus = entry.status;
							return (
								<tr
									key={entry.id}
									className="border-b border-slate-200 last:border-b-0 dark:border-white/5"
								>
									<td className="px-4 py-5 font-semibold text-slate-900 dark:text-white sm:px-6">
										{idx + 1}
									</td>
									<td className="whitespace-nowrap px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
										{formatDateTime(entry.timestamp)}
									</td>
									<td className="px-4 py-5 sm:px-6">
										<p className="font-semibold text-slate-900 dark:text-white">
											{entry.performedBy}
										</p>
									</td>
									<td className="px-4 py-5 font-medium text-slate-800 dark:text-[#D4DEEF] sm:px-6">
										{entry.action}
									</td>
									<td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
										{entry.benefit}
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
										{entry.uploadedContractRequestId ? (
											<button
												type="button"
												onClick={() =>
													handleViewContract(entry.uploadedContractRequestId!)
												}
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
					Таны сонгосон хайлт/шүүлтүүрт тохирох audit log олдсонгүй.
				</p>
			)}
		</section>
	);
}
