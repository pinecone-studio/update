/** @format */

"use client";

import { useEffect, useState } from "react";
import {
	HiOutlineBell,
	HiOutlineMagnifyingGlass,
	HiOutlineCheckCircle,
	HiOutlineClock,
	HiOutlineInformationCircle,
	HiOutlineArrowUpRight,
} from "react-icons/hi2";
import { NotificationSkeleton } from "../components/NotificationSkeleton";

export default function NotificationPage() {
	const [loading, setLoading] = useState(true);
	const notifications = [
		{
			title: "You’re Now Eligible for Education Allowance!",
			body: "Congratulations! You’ve reached 1 year tenure with an OKR score of 82%. You can now request Education Allowance.",
			time: "2 hours ago",
			tone: "success",
		},
		{
			title: "OKR Score Updated",
			body: "Your Q1 2026 OKR score has been updated to 82%. This may affect your benefit eligibility.",
			time: "5 hours ago",
			tone: "info",
		},
		{
			title: "Transit Pass Request Approved",
			body: "Your Transit Pass benefit request has been approved. You’ll receive further details via email.",
			time: "1 day ago",
			tone: "success",
		},
		{
			title: "Health Insurance Renewal Due Soon",
			body: "Your Health Insurance benefit expires in 30 days. Please review and renew if needed.",
			time: "2 days ago",
			tone: "warning",
		},
		{
			title: "Upcoming Eligibility: Gym Membership",
			body: "You’ll become eligible for Gym Membership in approximately 15 days when your OKR score reaches 75%.",
			time: "3 days ago",
			tone: "info",
		},
	];

	useEffect(() => {
		const t = setTimeout(() => setLoading(false), 400);
		return () => clearTimeout(t);
	}, []);

	if (loading) {
		return (
			<div>
				<div className="bg-slate-50 px-4 py-4 flex flex-col items-center gap-6 text-slate-900 w-full min-h-screen dark:bg-[#0f172A] dark:text-white">
					<div className="flex flex-col gap-6 w-full max-w-[1500px] -mt-4">
						<NotificationSkeleton />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="bg-slate-50 px-4 py-4 flex flex-col items-center gap-6 text-slate-900 w-full min-h-screen dark:bg-[#0f172A] dark:text-white">
				<div className="flex flex-col gap-6 w-full max-w-[1500px] -mt-4">
					<div className="flex items-center gap-4">
						<div className="w-[56px] h-[56px] bg-white rounded-2xl flex items-center justify-center">
							<HiOutlineBell className="text-3xl text-blue-700" />
						</div>
						<div className="flex flex-col">
							<p className="text-2xl font-semibold text-slate-900 dark:text-white">Notifications</p>
							<p className="text-slate-600 text-sm dark:text-slate-300">
								Stay updated on your benefits and eligibility
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
						<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between dark:bg-[#1A2333] dark:border-[#243041]">
							<div>
								<p className="text-xs text-slate-500 dark:text-slate-400">Unread</p>
								<p className="text-slate-900 text-xl font-semibold dark:text-white">2</p>
							</div>
							<div className="h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-blue-600 dark:bg-[#122033] dark:text-blue-500">
								<HiOutlineBell className="text-lg" />
							</div>
						</div>
						<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between dark:bg-[#1A2333] dark:border-[#243041]">
							<div>
								<p className="text-xs text-slate-500 dark:text-slate-400">Today</p>
								<p className="text-slate-900 text-xl font-semibold dark:text-white">2</p>
							</div>
							<div className="h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-orange-500 dark:bg-[#122033] dark:text-orange-400">
								<HiOutlineClock className="text-lg" />
							</div>
						</div>
						<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between dark:bg-[#1A2333] dark:border-[#243041]">
							<div>
								<p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
								<p className="text-slate-900 text-xl font-semibold dark:text-white">5</p>
							</div>
							<div className="h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-green-600 dark:bg-[#122033] dark:text-green-400">
								<HiOutlineCheckCircle className="text-lg" />
							</div>
						</div>
					</div>

				<div className="flex items-center gap-2 mt-6 text-xs text-slate-600 dark:text-slate-300">
					<button className="px-3 py-1.5 rounded-full bg-slate-800 text-white dark:bg-[#1A2333] dark:border dark:border-[#243041]">
						All Notifications
					</button>
					<button className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-[#111A2A] dark:border-[#243041] dark:text-slate-200 dark:hover:bg-[#1A2333]">
						Unread (2)
					</button>
					<button className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-[#111A2A] dark:border-[#243041] dark:text-slate-200 dark:hover:bg-[#1A2333]">
						Settings
					</button>
				</div>

				<div className="mt-4 bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 dark:bg-[#1A2333] dark:border-[#243041]">
					<HiOutlineMagnifyingGlass className="text-slate-500 dark:text-slate-400" />
					<input
						className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
						placeholder="Search notifications..."
					/>
					<button className="px-3 py-1.5 text-xs rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-[#111A2A] dark:border-[#243041] dark:text-slate-200 dark:hover:bg-[#1A2333]">
							Mark All as Read
						</button>
					</div>

					<div className="mt-5 space-y-3">
					{notifications.map((item) => {
						const toneClasses =
							item.tone === "success"
								? "text-green-600 dark:text-green-400"
								: item.tone === "warning"
									? "text-orange-600 dark:text-orange-400"
									: "text-blue-600 dark:text-blue-400";

						return (
							<div
								key={item.title}
								className="bg-white border border-slate-200 rounded-xl p-4 flex items-start justify-between gap-4 dark:bg-[#1A2333] dark:border-[#243041]"
							>
								<div className="flex items-start gap-3">
									<div
										className={`h-8 w-8 rounded-full bg-slate-100 grid place-items-center dark:bg-[#122033] ${toneClasses}`}
									>
										<HiOutlineInformationCircle className="text-lg" />
									</div>
									<div>
										<p className="text-slate-900 text-sm font-semibold dark:text-white">
											{item.title}
										</p>
										<p className="text-slate-600 text-xs mt-1 dark:text-slate-400">{item.body}</p>
										<p className="text-slate-500 text-[10px] mt-2">
											{item.time}
										</p>
									</div>
								</div>
								<button className="text-xs text-blue-600 hover:text-blue-500 inline-flex items-center gap-1 whitespace-nowrap dark:text-blue-400 dark:hover:text-blue-300">
										View Details
										<HiOutlineArrowUpRight className="text-sm" />
									</button>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
