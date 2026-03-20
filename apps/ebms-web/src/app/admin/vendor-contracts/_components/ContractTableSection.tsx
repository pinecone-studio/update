/** @format */

"use client";

import { useCallback, useState } from "react";
import { downloadAdminContractByUrl } from "../../_lib/api";
import type { Contract } from "../types";

type EmployeeOption = { id: string; name: string | null };

type ContractTableSectionProps = {
	contracts: Contract[];
	search: string;
	onSearchChange: (v: string) => void;
	filterByEmployeeId: string;
	onFilterByEmployeeChange: (v: string) => void;
	employeeOptions: EmployeeOption[];
	onAddContract: () => void;
};

export function ContractTableSection({
	contracts,
	search,
	onSearchChange,
	filterByEmployeeId,
	onFilterByEmployeeChange,
	employeeOptions,
	onAddContract,
}: ContractTableSectionProps) {
	const [downloadingId, setDownloadingId] = useState<string | null>(null);
	const handleDownload = useCallback(
		async (contract: Contract) => {
			if (downloadingId === contract.id) return;
			setDownloadingId(contract.id);
			try {
				await downloadAdminContractByUrl(
					contract.contractUrl,
					`contract-${contract.contractNumber}.pdf`,
				);
			} catch (e) {
				alert(e instanceof Error ? e.message : "Failed to download");
			} finally {
				setDownloadingId(null);
			}
		},
		[downloadingId],
	);
	return (
		<section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 dark:border-[#2C4264] dark:bg-[#16142a] sm:p-6">
			<div className="flex flex-col gap-4 sm:gap-6">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-[26px]">
						Contracts
					</h2>
				</div>
				<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
					<div className="flex items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
						<div className="relative w-[96px] shrink-0 sm:w-auto">
							<select
								aria-label="Filter by employee"
								value={filterByEmployeeId}
								onChange={(e) => onFilterByEmployeeChange(e.target.value)}
								className="h-10 min-w-[82px] appearance-none rounded-lg border border-slate-300 bg-slate-50 pl-3 pr-9 text-slate-900 outline-none focus:border-blue-500 dark:border-[#6F5AA8] dark:bg-[#FFFFFF]/10 dark:text-white dark:focus:border-[#B18CFF]"
							>
								<option value="">All</option>
								{employeeOptions.map((emp) => (
									<option key={emp.id} value={emp.id}>
										{emp.name || emp.id}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-3 flex items-center justify-center text-slate-600 dark:text-white">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									className="h-5 w-5"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										d="m6 9 6 6 6-6"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>
						<div className="relative min-w-0 flex-1">
							<span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-[#8FA3C5]">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									className="h-5 w-5"
									stroke="currentColor"
									strokeWidth="1.8"
								>
									<circle cx="11" cy="11" r="7" />
									<path d="m20 20-4-4" />
								</svg>
							</span>
							<input
								type="text"
								value={search}
								onChange={(e) => onSearchChange(e.target.value)}
								placeholder="Search by contract name"
								className="h-10 w-full min-w-0 rounded-lg border border-slate-300 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-blue-500 dark:border-transparent dark:bg-[#FFFFFF]/10 dark:text-white dark:placeholder:text-[#FFFFFF80]/50 dark:focus:border-white/50 sm:h-11 sm:w-[280px] lg:w-[368px]"
							/>
						</div>
					</div>
					<button
						type="button"
						onClick={onAddContract}
						className="inline-flex h-11 min-w-0 flex-shrink-0 items-center justify-center gap-2 self-start rounded-xl border-none bg-blue-600 px-4 text-base font-medium text-white transition hover:bg-blue-500 dark:bg-[#0057ADCC]/80 dark:hover:bg-[#3E82F7] sm:min-w-[170px] sm:text-[18px]"
					>
						+ <span className="font-normal">Add Contract</span>
					</button>
				</div>

				<div className="space-y-3 md:hidden">
					{contracts.map((contract, index) => (
						<div
							key={contract.id}
							className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
						>
							<div className="mb-3 flex items-start justify-between gap-3">
								<div>
									<p className="text-xs text-slate-500 dark:text-[#A7B6D3]">№ {index + 1}</p>
									<p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
										{contract.contractNumber}
									</p>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
								<div>
									<p className="text-slate-500 dark:text-[#A7B6D3]">Contract code</p>
									<p className="mt-1 text-slate-900 dark:text-white">{contract.contractName}</p>
								</div>
								<div>
									<p className="text-slate-500 dark:text-[#A7B6D3]">Start date</p>
									<p className="mt-1 text-slate-900 dark:text-white">{contract.startDate}</p>
								</div>
								<div>
									<p className="text-slate-500 dark:text-[#A7B6D3]">End date</p>
									<p className="mt-1 text-slate-900 dark:text-white">{contract.endDate}</p>
								</div>
								<div className="min-w-0">
									<p className="text-slate-500 dark:text-[#A7B6D3]">Contract</p>
									<button
										type="button"
										onClick={() => handleDownload(contract)}
										disabled={downloadingId === contract.id}
										className="mt-1 block truncate text-left text-blue-600 underline decoration-blue-600/40 underline-offset-4 hover:text-blue-700 disabled:opacity-50 dark:text-[#6FA3FF] dark:decoration-[#6FA3FF]/40 dark:hover:text-[#8AB6FF]"
									>
										{downloadingId === contract.id ? "Downloading..." : "Download PDF"}
									</button>
								</div>
							</div>
						</div>
					))}
					{contracts.length === 0 && (
						<div className="py-6 text-center text-sm text-slate-600 dark:text-[#A7B6D3]">
							Contract not found.
						</div>
					)}
				</div>

				<div className="hidden overflow-x-auto md:block">
					<table className="min-w-[640px] w-full">
						<thead>
							<tr>
								<th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
									№
								</th>
								<th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
									Contract name
								</th>
								<th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
									Contract code
								</th>
								<th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
									Start date
								</th>
								<th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
									End date
								</th>
								<th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
									Contract
								</th>
							</tr>
						</thead>
						<tbody>
							{contracts.map((contract, index) => (
								<tr key={contract.id}>
									<td className="px-5 py-5 text-5 text-slate-900 dark:text-white">
										{index + 1}
									</td>
									<td className="px-5 py-5 text-5 font-semibold text-slate-900 dark:text-white">
										{contract.contractNumber}
									</td>
									<td className="px-5 py-5 text-5 text-slate-900 dark:text-white">
										{contract.contractName}
									</td>
									<td className="px-5 py-5 text-5 text-slate-600 dark:text-[#D1DBEF]">
										{contract.startDate}
									</td>
									<td className="px-5 py-5 text-5 text-slate-600 dark:text-[#D1DBEF]">
										{contract.endDate}
									</td>
									<td className="max-w-[120px] px-5 py-5 text-5 sm:max-w-[200px]">
										<button
											type="button"
											onClick={() => handleDownload(contract)}
											disabled={downloadingId === contract.id}
											className="block truncate text-left text-blue-600 underline decoration-blue-600/40 underline-offset-4 hover:text-blue-700 disabled:opacity-50 dark:text-[#6FA3FF] dark:decoration-[#6FA3FF]/40 dark:hover:text-[#8AB6FF]"
										>
											{downloadingId === contract.id ? "Downloading..." : "Download PDF"}
										</button>
									</td>
								</tr>
							))}
							{contracts.length === 0 && (
								<tr>
									<td
										colSpan={6}
										className="px-5 py-6 text-center text-5 text-slate-600 dark:text-[#A7B6D3]"
									>
										Contract not found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
