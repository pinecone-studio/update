/** @format */

"use client";

import { useMemo, useState } from "react";

const statCards = [
	{
		key: "pending",
		value: "14",
		title: "Pending Requests",
		note: "Requires attention",
		tone: "yellow" as const,
		icon: "!",
	},
	{
		key: "approved",
		value: "28",
		title: "Approved This Month",
		note: "+12% vs last month",
		tone: "green" as const,
		icon: "check",
	},
	{
		key: "allocated",
		value: "$42,500",
		title: "Total Budget Allocated",
		note: "Year to date",
		tone: "blue" as const,
		icon: "wallet",
	},
	{
		key: "remaining",
		value: "$18,200",
		title: "Remaining Budget",
		note: "42.8% remaining",
		tone: "purple" as const,
		icon: "trend",
	},
];

const requests = [
	{
		id: 1,
		initials: "JC",
		employee: "John Carter",
		benefitType: "Down Payment Assistance",
		amount: "$12,000",
		department: "Engineering",
		date: "May 14",
	},
	{
		id: 2,
		initials: "SK",
		employee: "Sarah Kim",
		benefitType: "OKR Performance Bonus",
		amount: "$2,500",
		department: "Product",
		date: "May 12",
	},
	{
		id: 3,
		initials: "DL",
		employee: "David Lee",
		benefitType: "Travel Subsidy",
		amount: "$1,200",
		department: "Marketing",
		date: "May 10",
	},
];

export default function FinancePage() {
	const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);
	const [rejectingRequestId, setRejectingRequestId] = useState<number | null>(
		null,
	);
	const [rejectionReason, setRejectionReason] = useState("");
	const selectedCard = useMemo(
		() => statCards.find((card) => card.key === selectedCardKey) ?? null,
		[selectedCardKey],
	);

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

	return (
		<div className="space-y-6">
			<header className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
						Finance Manager Panel
					</h1>
					<p className="mt-2 text-5 text-slate-600 dark:text-[#A7B6D3]">
						Review and approve employee benefits with financial impact
					</p>
				</div>
			</header>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{statCards.map((card) => (
					<button
						key={card.key}
						type="button"
						onClick={() => setSelectedCardKey(card.key)}
						className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 dark:border-[#2C4264] dark:bg-[#1E293B] dark:hover:border-[#2B405F]"
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
				<div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#2B405F]">
					<div>
						<h2 className="text-5 font-semibold text-slate-900 dark:text-white">
							Financial Benefit Requests
						</h2>
						<p className="mt-1 text-5 text-slate-600 dark:text-[#A7B6D3]">
							Review and process pending requests
						</p>
					</div>
					<p className="text-5 text-slate-600 dark:text-[#A7B6D3]">
						Showing {requests.length} requests
					</p>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-5">
						<thead className="border-b border-slate-200 uppercase tracking-wide text-slate-600 dark:border-[#2B405F] dark:text-[#A7B6D3]">
							<tr>
								<th className="px-6 py-4">№</th>
								<th className="px-6 py-4">Employee</th>
								<th className="px-6 py-4">Benefit Type</th>
								<th className="px-4 py-4 whitespace-nowrap">
									Requested Amount
								</th>
								<th className="px-6 py-4">Department</th>
								<th className="px-6 py-4">Date</th>
								<th className="px-6 py-4">Action</th>
							</tr>
						</thead>
						<tbody>
							{requests.map((request) => (
								<tr key={request.id} className="border-b border-slate-200 dark:border-[#2B405F]">
									<td className="px-6 py-5 text-5 font-semibold text-slate-900 dark:text-white">
										{request.id}
									</td>
									<td className="px-6 py-5">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-5 font-semibold text-blue-700 dark:bg-[#2A8BFF]/30 dark:text-white">
												{request.initials}
											</div>
											<span className="whitespace-nowrap text-5 text-slate-900 dark:text-white">
												{request.employee}
											</span>
										</div>
									</td>
									<td className="px-6 py-5 whitespace-nowrap text-5 text-slate-600 dark:text-[#A7B6D3]">
										{request.benefitType}
									</td>
									<td className="px-4 py-5 whitespace-nowrap text-5 font-semibold text-slate-900 dark:text-white">
										{request.amount}
									</td>
									<td className="px-6 py-5">
										<span className="rounded-lg bg-slate-100 px-3 py-1 text-5 text-slate-600 dark:bg-[#24364F] dark:text-[#A7B6D3]">
											{request.department}
										</span>
									</td>
									<td className="px-6 py-5 text-5 text-slate-500 dark:text-[#8FA3C5]">
										{request.date}
									</td>
									<td className="px-6 py-5">
										<div className="flex items-center gap-2">
											<button className="rounded-xl bg-green-600 px-4 py-2 text-5 font-medium text-white hover:bg-green-700 dark:bg-[#00C95F] dark:hover:bg-[#00B355]">
												Approve
											</button>
											<button
												type="button"
												onClick={() => {
													setRejectingRequestId(request.id);
													setRejectionReason("");
												}}
												className="rounded-xl bg-red-500/90 px-4 py-2 text-5 font-medium text-white hover:bg-red-500"
											>
												Reject
											</button>
										</div>
									</td>
								</tr>
							))}
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
									// TODO: submit rejection with rejectionReason
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
