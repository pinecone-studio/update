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
		<section className="rounded-3xl bg-white p-6 dark:border-[#2C4264] dark:bg-[#181743]/50">
			<div className="flex flex-col gap-12">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="relative min-w-0 flex-1">
						<span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8FA3C5]">
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
							className="h-11 w-[368px] rounded-lg border border-transparent bg-[#FFFFFF]/10 pl-12 pr-4 text-5 text-slate-200 placeholder:text-slate-200 outline-none focus:border-white/70 dark:text-white dark:placeholder:text-[#FFFFFF80]/50 dark:focus:border-white/50"
						/>
					</div>
					<button
						type="button"
						onClick={onAddContract}
						className="inline-flex h-11 min-w-[170px] flex-[0_0_auto] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-[#0057ADCC]/80 px-4 text-[18px] font-medium text-white transition hover:bg-[#3E82F7]"
					>
						+ <span className="text-[18px] font-normal">Add Contract</span>
					</button>
				</div>

				<table className="min-w-full">
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
								<td className="px-5 py-5 text-5">
									<a
										href={contract.contractUrl}
										target="_blank"
										rel="noreferrer"
										className="text-blue-600 underline decoration-blue-600/40 underline-offset-4 hover:text-blue-700 dark:text-[#6FA3FF] dark:decoration-[#6FA3FF]/40 dark:hover:text-[#8AB6FF]"
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
		</section>
	);
}
