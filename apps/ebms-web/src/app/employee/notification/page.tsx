/** @format */

import {
	HiOutlineBell,
	HiOutlineMagnifyingGlass,
	HiOutlineCheckCircle,
	HiOutlineClock,
	HiOutlineInformationCircle,
	HiOutlineArrowUpRight,
} from "react-icons/hi2";
import { Header } from "../components/Header";

export default function NotificationPage() {
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

	return (
		<div className="min-h-screen bg-[#0B1220]">
			<div className="w-full h-full bg-[#0F172A] px-6 py-6">
				<div className="flex items-center gap-4">
					<div className="w-[56px] h-[56px] bg-white rounded-2xl flex items-center justify-center">
						<HiOutlineBell className="text-3xl text-blue-700" />
					</div>
					<div className="flex flex-col">
						<p className="text-2xl text-white font-semibold">Notifications</p>
						<p className="text-slate-300 text-sm">
							Stay updated on your benefits and eligibility
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
					<div className="bg-[#1A2333] border border-[#243041] rounded-xl p-4 flex items-center justify-between">
						<div>
							<p className="text-xs text-slate-400">Unread</p>
							<p className="text-white text-xl font-semibold">2</p>
						</div>
						<div className="h-8 w-8 rounded-full bg-[#122033] grid place-items-center text-blue-500">
							<HiOutlineBell className="text-lg" />
						</div>
					</div>
					<div className="bg-[#1A2333] border border-[#243041] rounded-xl p-4 flex items-center justify-between">
						<div>
							<p className="text-xs text-slate-400">Today</p>
							<p className="text-white text-xl font-semibold">2</p>
						</div>
						<div className="h-8 w-8 rounded-full bg-[#122033] grid place-items-center text-orange-400">
							<HiOutlineClock className="text-lg" />
						</div>
					</div>
					<div className="bg-[#1A2333] border border-[#243041] rounded-xl p-4 flex items-center justify-between">
						<div>
							<p className="text-xs text-slate-400">Total</p>
							<p className="text-white text-xl font-semibold">5</p>
						</div>
						<div className="h-8 w-8 rounded-full bg-[#122033] grid place-items-center text-green-400">
							<HiOutlineCheckCircle className="text-lg" />
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2 mt-6 text-xs text-slate-300">
					<button className="px-3 py-1.5 rounded-full bg-[#1A2333] border border-[#243041] text-white">
						All Notifications
					</button>
					<button className="px-3 py-1.5 rounded-full bg-[#111A2A] border border-[#243041] hover:text-white hover:bg-[#1A2333]">
						Unread (2)
					</button>
					<button className="px-3 py-1.5 rounded-full bg-[#111A2A] border border-[#243041] hover:text-white hover:bg-[#1A2333]">
						Settings
					</button>
				</div>

				<div className="mt-4 bg-[#1A2333] border border-[#243041] rounded-xl p-3 flex items-center gap-3">
					<HiOutlineMagnifyingGlass className="text-slate-400" />
					<input
						className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none"
						placeholder="Search notifications..."
					/>
					<button className="px-3 py-1.5 text-xs rounded-full bg-[#111A2A] border border-[#243041] text-slate-200 hover:text-white hover:bg-[#1A2333]">
						Mark All as Read
					</button>
				</div>

				<div className="mt-5 space-y-3">
					{notifications.map((item) => {
						const toneClasses =
							item.tone === "success"
								? "text-green-400"
								: item.tone === "warning"
									? "text-orange-400"
									: "text-blue-400";

						return (
							<div
								key={item.title}
								className="bg-[#1A2333] border border-[#243041] rounded-xl p-4 flex items-start justify-between gap-4"
							>
								<div className="flex items-start gap-3">
									<div
										className={`h-8 w-8 rounded-full bg-[#122033] grid place-items-center ${toneClasses}`}
									>
										<HiOutlineInformationCircle className="text-lg" />
									</div>
									<div>
										<p className="text-white text-sm font-semibold">
											{item.title}
										</p>
										<p className="text-slate-400 text-xs mt-1">{item.body}</p>
										<p className="text-slate-500 text-[10px] mt-2">
											{item.time}
										</p>
									</div>
								</div>
								<button className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 whitespace-nowrap">
									View Details
									<HiOutlineArrowUpRight className="text-sm" />
								</button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
