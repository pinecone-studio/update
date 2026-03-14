/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { FinanceDashboardSkeleton } from "./components/FinanceDashboardSkeleton";
import {
	confirmBenefitRequest,
	fetchBenefitRequests,
	fetchBenefitRequestContractHtml,
	fetchBenefits,
	fetchEmployees,
	getApiErrorMessage,
	getFinanceClient,
	type BenefitRequest,
	type EmployeeLite,
} from "./_lib/api";

type Tone = "yellow" | "green" | "blue" | "purple";
type StatCard = {
	key: string;
	value: string;
	title: string;
	note: string;
	tone: Tone;
	icon: string;
};

export default function FinancePage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [requests, setRequests] = useState<BenefitRequest[]>([]);
	const [employees, setEmployees] = useState<Record<string, EmployeeLite>>({});
	const [benefitSubsidyMap, setBenefitSubsidyMap] = useState<Record<string, number>>({});
	const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);
	const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(
		null,
	);
	const [submittingRequestId, setSubmittingRequestId] = useState<string | null>(null);
	const [rejectionReason, setRejectionReason] = useState("");

	const pendingRequests = useMemo(
		() => requests.filter((r) => r.status === "PENDING"),
		[requests],
	);
	const approvedThisMonth = useMemo(() => {
		const now = new Date();
		return requests.filter((r) => {
			if (r.status !== "APPROVED") return false;
			const d = new Date(r.createdAt);
			return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
		}).length;
	}, [requests]);
	const totalAllocated = useMemo(
		() =>
			requests
				.filter((r) => r.status === "APPROVED")
				.reduce((sum, r) => sum + (benefitSubsidyMap[r.benefitId] ?? 0), 0),
		[requests, benefitSubsidyMap],
	);
	const remainingBudgetEstimate = Math.max(0, 100 - totalAllocated);

	const statCards: StatCard[] = useMemo(
		() => [
			{
				key: "pending",
				value: String(pendingRequests.length),
				title: "Pending Requests",
				note: "Requires attention",
				tone: "yellow",
				icon: "!",
			},
			{
				key: "approved",
				value: String(approvedThisMonth),
				title: "Approved This Month",
				note: "Based on current month data",
				tone: "green",
				icon: "check",
			},
			{
				key: "allocated",
				value: `${totalAllocated}%`,
				title: "Total Budget Allocated",
				note: "From approved benefit subsidies",
				tone: "blue",
				icon: "wallet",
			},
			{
				key: "remaining",
				value: `${remainingBudgetEstimate}%`,
				title: "Remaining Budget",
				note: "Estimated from configured subsidies",
				tone: "purple",
				icon: "trend",
			},
		],
		[pendingRequests.length, approvedThisMonth, totalAllocated, remainingBudgetEstimate],
	);
	const selectedCard = useMemo(
		() => statCards.find((card) => card.key === selectedCardKey) ?? null,
		[selectedCardKey],
	);

	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();

	const loadData = async () => {
		setLoading(true);
		setError(null);
		try {
			const client = getFinanceClient();
			const [reqList, employeeList, benefits] = await Promise.all([
				fetchBenefitRequests(client),
				fetchEmployees(client),
				fetchBenefits(client),
			]);
			setRequests(reqList);
			setEmployees(Object.fromEntries(employeeList.map((e) => [e.id, e])));
			setBenefitSubsidyMap(
				Object.fromEntries(benefits.map((b) => [b.id, Number(b.subsidyPercent ?? 0)])),
			);
		} catch (e) {
			setError(getApiErrorMessage(e));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void loadData();
	}, []);

	const toneClass = (tone: "yellow" | "green" | "blue" | "purple") => {
		if (tone === "yellow") {
			return "border-[#FFAD0F]/40 bg-[#FFAD0F]/20 text-[#FFAD0F]";
		}
		if (tone === "green") {
			return "border-[#00C95F]/40 bg-[#00C95F]/20 text-[#00C95F]";
		}
		if (tone === "blue") {
			return "border-[#2A8BFF]/40 bg-[#2A8BFF]/20 text-[#2A8BFF]";
		}
		return "border-[#9C27B0]/40 bg-[#9C27B0]/20 text-[#9C27B0]";
	};

	if (loading) {
		return <FinanceDashboardSkeleton />;
	}

	const handleDecision = async (requestId: string, accepted: boolean) => {
		setSubmittingRequestId(requestId);
		setError(null);
		try {
			await confirmBenefitRequest(getFinanceClient(), requestId, accepted);
			await loadData();
		} catch (e) {
			setError(getApiErrorMessage(e));
		} finally {
			setSubmittingRequestId(null);
		}
	};

	const handleViewTemplate = async (requestId: string) => {
		try {
			const html = await fetchBenefitRequestContractHtml(getFinanceClient(), requestId);
			const popup = window.open("", "_blank", "noopener,noreferrer");
			if (popup) {
				popup.document.open();
				popup.document.write(html);
				popup.document.close();
			}
		} catch (e) {
			setError(getApiErrorMessage(e));
		}
	};

	const visibleRequests = pendingRequests;

	return (
		<div className="space-y-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
						Finance Manager Panel
					</h1>
					<p className="mt-2 text-5 text-slate-600 dark:text-[#A7B6D3]">
						Review and approve employee benefits with financial impact
					</p>
				</div>
			</header>
			{error && (
				<p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
					{error}
				</p>
			)}

			<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{statCards.map((card) => (
					<button
						key={card.key}
						type="button"
						onClick={() => setSelectedCardKey(card.key)}
						className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 dark:border-[#2C4264] dark:bg-[#1E293B] dark:hover:border-[#2B405F]"
					>
						<div className="mb-6 flex items-start justify-between">
							<div
								className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-semibold ${toneClass(
									card.tone,
								)}`}
							>
								{card.icon === "check"
									? "✓"
									: card.icon === "wallet"
										? "◫"
										: card.icon === "trend"
											? "↗"
											: "!"}
							</div>
							<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-2xl text-blue-600 dark:bg-[#24364F] dark:text-[#2A8BFF]">
								›
							</span>
						</div>
						<p className="text-5 font-bold text-slate-900 dark:text-white">{card.value}</p>
						<p className="mt-2 text-5 text-slate-600 dark:text-[#A7B6D3]">{card.title}</p>
						<div className="mt-4 h-px bg-slate-200 dark:bg-[#2B405F]" />
						<p
							className={`mt-4 text-5 ${card.tone === "green" ? "text-green-600 dark:text-[#00C95F]" : "text-slate-600 dark:text-[#A7B6D3]"}`}
						>
							{card.note}
						</p>
					</button>
				))}
			</section>

			<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#2C4264] dark:bg-[#1E293B]">
				<div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 dark:border-[#2B405F]">
					<div>
						<h2 className="text-5 font-semibold text-slate-900 dark:text-white">
							Financial Benefit Requests
						</h2>
						<p className="mt-1 text-5 text-slate-600 dark:text-[#A7B6D3]">
							Review and process pending requests
						</p>
					</div>
					<p className="text-5 text-slate-600 dark:text-[#A7B6D3]">
						Showing {visibleRequests.length} requests
					</p>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-5">
						<thead className="border-b border-slate-200 uppercase tracking-wide text-slate-600 dark:border-[#2B405F] dark:text-[#A7B6D3]">
							<tr>
								<th className="px-4 py-3 sm:px-6 sm:py-4">№</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">Employee</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">Benefit Type</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
									Requested Amount
								</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">Department</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">Date</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">Contract</th>
								<th className="px-4 py-3 sm:px-6 sm:py-4">Action</th>
							</tr>
						</thead>
						<tbody>
							{visibleRequests.map((request, index) => {
								const needsSignature =
									request.requiresContract && !request.contractAcceptedAt;
								return (
								<tr key={request.id} className="border-b border-slate-200 dark:border-[#2B405F]">
									<td className="px-4 py-4 sm:px-6 sm:py-5 text-5 font-semibold text-slate-900 dark:text-white">
										{index + 1}
									</td>
									<td className="px-4 py-4 sm:px-6 sm:py-5">
										<div className="flex items-center gap-2 sm:gap-3">
											<div className="flex h-8 w-8 shrink-0 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-100 text-5 font-semibold text-blue-700 dark:bg-[#2A8BFF]/30 dark:text-white">
												{getInitials(request.employeeName || request.employeeId)}
											</div>
											<span className="min-w-0 truncate text-5 text-slate-900 dark:text-white">
												{request.employeeName || request.employeeId}
											</span>
										</div>
									</td>
									<td className="px-4 py-4 sm:px-6 sm:py-5 whitespace-nowrap text-5 text-slate-600 dark:text-[#A7B6D3]">
										{request.benefitName || request.benefitId}
									</td>
									<td className="px-4 py-4 sm:px-6 sm:py-5 whitespace-nowrap text-5 font-semibold text-slate-900 dark:text-white">
										{benefitSubsidyMap[request.benefitId] != null
											? `${benefitSubsidyMap[request.benefitId]}%`
											: "—"}
									</td>
									<td className="px-4 py-4 sm:px-6 sm:py-5">
										<span className="rounded-lg bg-slate-100 px-2 py-1 sm:px-3 text-5 text-slate-600 dark:bg-[#24364F] dark:text-[#A7B6D3]">
											{employees[request.employeeId]?.role || "—"}
										</span>
									</td>
									<td className="px-4 py-4 sm:px-6 sm:py-5 text-5 text-slate-500 dark:text-[#8FA3C5]">
										{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "—"}
									</td>
									<td className="px-4 py-4 sm:px-6 sm:py-5 whitespace-nowrap">
										{request.requiresContract ? (
											<div className="flex flex-col gap-1">
												<span
													className={`text-xs font-medium ${
														needsSignature ? "text-amber-500" : "text-emerald-500"
													}`}
												>
													{needsSignature ? "Not signed" : "Signed"}
												</span>
												{request.contractTemplateUrl ? (
													<button
														type="button"
														onClick={() => void handleViewTemplate(request.id)}
														className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-300"
													>
														View template
													</button>
												) : null}
											</div>
										) : (
											<span className="text-xs text-slate-400 dark:text-slate-500">N/A</span>
										)}
									</td>
									<td className="px-4 py-4 sm:px-6 sm:py-5">
										<div className="flex flex-wrap items-center gap-2">
											<button
												type="button"
												onClick={() => void handleDecision(request.id, true)}
												disabled={submittingRequestId === request.id || needsSignature}
												className="rounded-lg bg-green-600 px-3 py-1.5 text-5 font-medium text-white hover:bg-green-700 disabled:opacity-60 sm:rounded-xl sm:px-4 sm:py-2 dark:bg-[#00C95F] dark:hover:bg-[#00B355]"
											>
												{needsSignature ? "Await sign" : "Approve"}
											</button>
											<button
												type="button"
												onClick={() => {
													setRejectingRequestId(request.id);
													setRejectionReason("");
												}}
												disabled={submittingRequestId === request.id}
												className="rounded-lg bg-red-500/90 px-3 py-1.5 text-5 font-medium text-white hover:bg-red-500 sm:rounded-xl sm:px-4 sm:py-2"
											>
												Reject
											</button>
										</div>
									</td>
								</tr>
								);
							})}
							{visibleRequests.length === 0 && (
								<tr>
									<td
										colSpan={8}
										className="px-6 py-6 text-center text-5 text-slate-500 dark:text-[#A7B6D3]"
									>
										Pending хүсэлт алга байна.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>

			{selectedCard && (
				<div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
					<div className="w-full max-w-[560px] rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-[#2C4264] dark:bg-[#1E293B]">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-5 text-slate-600 dark:text-[#A7B6D3]">{selectedCard.title}</p>
								<p className="mt-3 text-5 font-bold text-slate-900 dark:text-white">
									{selectedCard.value}
								</p>
								<p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
									{selectedCard.note}
								</p>
							</div>
							<button
								type="button"
								onClick={() => setSelectedCardKey(null)}
								className="rounded-lg border border-slate-300 px-3 py-1 text-5 text-slate-600 hover:bg-slate-100 dark:border-[#2C4264] dark:text-[#A7B6D3] dark:hover:bg-[#24364F]"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{rejectingRequestId !== null && (
				<div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
					<div className="w-full max-w-[560px] rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-[#2C4264] dark:bg-[#1E293B]">
						<h3 className="text-5 font-semibold text-slate-900 dark:text-white">
							Reject Request
						</h3>
						<p className="mt-2 text-5 text-slate-600 dark:text-[#A7B6D3]">
							Please provide a reason for rejecting this benefit request.
						</p>
						<textarea
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							placeholder="Enter rejection reason..."
							rows={4}
							className="mt-4 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2C4264] dark:bg-[#0F172A] dark:text-white dark:placeholder-[#64748B] dark:focus:border-[#2A8BFF] dark:focus:ring-[#2A8BFF]"
						/>
						<div className="mt-6 flex justify-end gap-3">
							<button
								type="button"
								onClick={() => {
									setRejectingRequestId(null);
									setRejectionReason("");
								}}
								className="rounded-xl border border-slate-300 px-4 py-2 text-5 text-slate-600 hover:bg-slate-100 dark:border-[#2C4264] dark:text-[#A7B6D3] dark:hover:bg-[#24364F]"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => {
									if (!rejectingRequestId) return;
									void handleDecision(rejectingRequestId, false);
									setRejectingRequestId(null);
									setRejectionReason("");
								}}
								disabled={!rejectionReason.trim()}
								className="rounded-xl bg-red-500/90 px-4 py-2 text-5 font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Confirm Reject
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
