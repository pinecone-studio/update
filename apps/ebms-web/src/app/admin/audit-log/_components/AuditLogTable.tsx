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
		<section className="overflow-hidden rounded-3xl dark:bg-[#20194D80]/50 p-2 ">
			<div className="overflow-x-auto">
				<table className="min-w-full text-left text-5">
					<thead className="border-b border-white/5 text-slate-500  dark:text-[#A7B6D3]">
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
									className="border-b border-white/5 last:border-b-0 "
								>
									<td className="px-4 py-5 font-semibold text-slate-900 dark:text-white sm:px-6">
										{idx + 1}
									</td>
									<td className="whitespace-nowrap px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
										{formatDateTime(entry.timestamp)}
									</td>
									<td className="px-4 py-5 sm:px-6">
										<p className="font-semibold text-slate-900 dark:text-white">
											{entry.employee}
										</p>
										<p className="text-sm text-slate-500 dark:text-[#8FA3C5]">
											{entry.employeeId}
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
