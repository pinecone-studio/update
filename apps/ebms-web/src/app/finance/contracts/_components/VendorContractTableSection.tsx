/** @format */

"use client";

import type { Contract } from "../types";

type VendorContractTableSectionProps = {
	contracts: Contract[];
	search: string;
	onSearchChange: (v: string) => void;
	onAddContract: () => void;
};

export function VendorContractTableSection({
	contracts,
	search,
	onSearchChange,
	onAddContract,
}: VendorContractTableSectionProps) {
	return (
		<section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 dark:border-[#2C4264] dark:bg-[#16142a] sm:p-6">
			<div className="flex flex-col gap-6 sm:gap-12">
				<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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
							className="h-11 w-full min-w-0 rounded-lg border border-slate-300 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-blue-500 dark:border-transparent dark:bg-[#FFFFFF]/10 dark:text-white dark:placeholder:text-[#FFFFFF80]/50 dark:focus:border-white/50 sm:w-[280px] lg:w-[368px]"
						/>
					</div>
					<button
						type="button"
						onClick={onAddContract}
						className="inline-flex h-11 min-w-0 flex-shrink-0 items-center justify-center gap-2 self-start rounded-xl border-none bg-[#0057ADCC]/80 px-4 text-base font-medium text-white transition hover:bg-[#3E82F7] sm:min-w-[170px] sm:text-[18px]"
					>
						+ <span className="font-normal">Add Contract</span>
					</button>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-[640px] w-full">
						<thead>
							<tr>
								<th className="px-5 py-4 text-left text-[18px] font-normal dark:text-[#A7B6D3]">
									№
								</th>
								<th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
									Contract number
								</th>
								<th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
									Contract name
								</th>
								<th className="px-5 py-4 text-left text-[18px] font-normal dark:text-[#A7B6D3]">
									Start date
								</th>
								<th className="px-5 py-4 text-left text-[18px] font-normal dark:text-[#A7B6D3]">
									End date
								</th>
								<th className="px-5 py-4 text-left text-[18px] font-normal dark:text-[#A7B6D3]">
									Contract URL
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
									<td className="max-w-[120px] px-5 py-5 text-sm sm:max-w-[200px]">
										<a
											href={contract.contractUrl}
											target="_blank"
											rel="noreferrer"
											className="block truncate text-blue-600 underline decoration-blue-600/40 underline-offset-4 hover:text-blue-700 dark:text-[#6FA3FF] dark:decoration-[#6FA3FF]/40 dark:hover:text-[#8AB6FF]"
										>
											{contract.contractUrl}
										</a>
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
