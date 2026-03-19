/** @format */

"use client";

import { getInitials } from "../_lib/utils";
import type { BenefitRequest, EmployeeLite } from "../_lib/api";

const STATUS_OPTIONS = [
	{ value: "ADMIN_APPROVED" as const, label: "Awaiting" },
	{ value: "APPROVED" as const, label: "Approved" },
	{ value: "REJECTED" as const, label: "Rejected" },
	{ value: undefined, label: "All" },
] as const;

type StatusCounts = {
	ADMIN_APPROVED: number;
	APPROVED: number;
	REJECTED: number;
	ALL: number;
};

type FinanceRequestsSectionProps = {
	requests: BenefitRequest[];
	statusCounts: StatusCounts;
	statusFilter:
		| "PENDING"
		| "ADMIN_APPROVED"
		| "APPROVED"
		| "REJECTED"
		| undefined;
	onStatusFilterChange: (
		value: "PENDING" | "ADMIN_APPROVED" | "APPROVED" | "REJECTED" | undefined,
	) => void;
	employees: Record<string, EmployeeLite>;
	benefitSubsidyMap: Record<string, number>;
	submittingRequestId: string | null;
	onApprove: (requestId: string) => void;
	onReject: (requestId: string) => void;
	onViewTemplate: (requestId: string) => void;
};

export function FinanceRequestsSection({
	requests,
	statusCounts,
	statusFilter,
	onStatusFilterChange,
	employees,
	benefitSubsidyMap,
	submittingRequestId,
	onApprove,
	onReject,
	onViewTemplate,
}: FinanceRequestsSectionProps) {
	return (
		<section className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[var(--shadow-card)] dark:border-white/10 dark:bg-transparent dark:shadow-none">
			<div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 dark:border-white/10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 sm:py-5">
				<h2 className="text-[20px] font-semibold leading-tight text-slate-900 dark:text-white">
					Financial Benefit Requests
				</h2>
				<div className="flex flex-wrap items-center gap-2">
					{STATUS_OPTIONS.map(({ value, label }) => (
						<button
							key={value ?? "all"}
							type="button"
							onClick={() => onStatusFilterChange(value)}
							className={`rounded-xl px-4 py-2 text-[15px] font-medium leading-tight transition ${
								statusFilter === value
									? "bg-blue-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] dark:bg-[#2A69D7]"
									: "border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-[#3A4F78] dark:text-[#B7C4DD] dark:hover:bg-[#2A3E63]"
							}`}
						>
							{label} (
							{value === "ADMIN_APPROVED"
								? statusCounts.ADMIN_APPROVED
								: value === "APPROVED"
									? statusCounts.APPROVED
									: value === "REJECTED"
										? statusCounts.REJECTED
										: statusCounts.ALL}
							)
						</button>
					))}
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full text-left text-[15px] leading-tight">
					<thead className="border-b border-slate-200 text-[13px] uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-[#9DAECF]">
						<tr>
							<th className="px-4 py-3 sm:px-6 sm:py-4">#</th>
							<th className="px-4 py-3 sm:px-6 sm:py-4">Employee</th>
							<th className="px-4 py-3 sm:px-6 sm:py-4">Benefit Type</th>
							<th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
								Requested Amount
							</th>
							<th className="px-4 py-3 sm:px-6 sm:py-4">Department</th>
							<th className="px-4 py-3 sm:px-6 sm:py-4">Date</th>
							<th className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4">
								Contract / Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{requests.length === 0 ? (
							<tr className="border-b border-slate-200 dark:border-white/10">
								<td
									colSpan={7}
									className="px-6 py-12 text-center sm:px-8 sm:py-14"
								>
									<h3 className="text-[20px] font-semibold leading-tight text-slate-900 dark:text-white">
										🎉 No requests awaiting finance
									</h3>
									<p className="mt-2 text-[15px] leading-tight text-slate-600 dark:text-[#A7B6D3]">
										All employee benefit requests are processed.
									</p>
									<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
										<button
											type="button"
											onClick={() => onStatusFilterChange("APPROVED")}
											className="rounded-xl bg-blue-600 px-4 py-2 text-[15px] font-medium leading-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] dark:bg-[#2A69D7]"
										>
											View Approved
										</button>
										<button
											type="button"
											className="rounded-xl border border-slate-300 px-4 py-2 text-[15px] font-medium leading-tight text-slate-600 dark:border-[#3A4F78] dark:text-[#C5D2E8]"
										>
											Create Budget Rule
										</button>
									</div>
								</td>
							</tr>
						) : (
							requests.map((request, index) => {
								const status = (request.status || "PENDING").toUpperCase();
								const isPending =
									status === "PENDING" || status === "ADMIN_APPROVED";
								const needsSignature =
									status === "APPROVED" &&
									request.requiresContract &&
									!request.contractAcceptedAt;

								return (
									<tr
										key={request.id}
										className="border-b border-slate-200 dark:border-white/10"
									>
										<td className="px-4 py-4 text-[15px] font-semibold leading-tight text-slate-900 sm:px-6 sm:py-5 dark:text-white">
											{index + 1}
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<div className="flex items-center gap-2 sm:gap-3">
												<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[15px] font-semibold leading-tight text-white sm:h-10 sm:w-10">
													{getInitials(
														request.employeeName || request.employeeId,
													)}
												</div>
												<span className="min-w-0 truncate text-[15px] leading-tight text-slate-900 dark:text-white">
													{request.employeeName || request.employeeId}
												</span>
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-4 text-[15px] leading-tight text-slate-600 sm:px-6 sm:py-5 dark:text-[#A7B6D3]">
											{request.benefitName || request.benefitId}
										</td>
										<td className="whitespace-nowrap px-4 py-4 text-[15px] font-semibold leading-tight text-slate-900 sm:px-6 sm:py-5 dark:text-white">
											{benefitSubsidyMap[request.benefitId] != null
												? `${benefitSubsidyMap[request.benefitId]}%`
												: "—"}
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<span className="rounded-lg bg-slate-100 px-2 py-1 text-[15px] leading-tight text-slate-700 sm:px-3 dark:bg-[#24364F] dark:text-[#B7C4DD]">
												{employees[request.employeeId]?.role || "—"}
											</span>
										</td>
										<td className="px-4 py-4 text-[15px] leading-tight text-slate-500 sm:px-6 sm:py-5 dark:text-[#8FA3C5]">
											{request.createdAt
												? new Date(request.createdAt).toLocaleString("mn-MN", {
														year: "numeric",
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})
												: "—"}
										</td>
										<td className="px-4 py-4 sm:px-6 sm:py-5">
											<div className="flex flex-wrap items-center gap-2">
												{request.requiresContract ? (
													<span
														className={`rounded-md px-2 py-1 text-[15px] font-medium leading-tight ${
															needsSignature
																? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
																: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
														}`}
													>
														{needsSignature ? "Not signed" : "Signed"}
													</span>
												) : (
													<span className="text-[15px] leading-tight text-slate-500 dark:text-slate-400">
														N/A
													</span>
												)}
												{request.contractTemplateUrl ? (
													<button
														type="button"
														onClick={() => void onViewTemplate(request.id)}
														className="text-[15px] leading-tight text-blue-600 hover:text-blue-700 dark:text-[#8BC3FF] dark:hover:text-[#B5DAFF]"
													>
														View template
													</button>
												) : null}
												{isPending ? (
													<>
														<button
															type="button"
															onClick={() => void onApprove(request.id)}
															disabled={submittingRequestId === request.id}
															className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[15px] font-medium leading-tight text-white hover:bg-emerald-700 disabled:opacity-60 sm:rounded-xl sm:px-4 sm:py-2 dark:bg-[#0A8A53] dark:hover:bg-[#0D9C5F]"
														>
															Approve
														</button>
														<button
															type="button"
															onClick={() => onReject(request.id)}
															disabled={submittingRequestId === request.id}
															className="rounded-lg bg-red-700 px-3 py-1.5 text-[15px] font-medium leading-tight text-white hover:bg-red-800 disabled:opacity-60 sm:rounded-xl sm:px-4 sm:py-2 dark:bg-[#B21C23] dark:hover:bg-[#CB222B]"
														>
															Reject
														</button>
													</>
												) : (
													<span
														className={`rounded-md px-2 py-1 text-[15px] font-medium leading-tight ${
															status === "APPROVED"
																? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
																: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
														}`}
													>
														{status === "APPROVED" ? "Approved" : "Rejected"}
													</span>
												)}
											</div>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
}
