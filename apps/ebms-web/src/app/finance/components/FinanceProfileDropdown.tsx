/** @format */

"use client";

import Link from "next/link";
import {
	HiOutlineArrowRightOnRectangle,
	HiOutlineArrowTopRightOnSquare,
	HiOutlineUserCircle,
} from "react-icons/hi2";
import { ProfileIcon } from "@/app/icons/profile";
import { HistoryIcon } from "@/app/icons/history";

interface FinanceProfileDropdownProps {
	open: boolean;
	userName: string;
	userId: string;
	onToggle: () => void;
	onClose: () => void;
}

export function FinanceProfileDropdown({
	open,
	userName,
	userId,
	onToggle,
	onClose,
}: FinanceProfileDropdownProps) {
	return (
		<div className="relative">
			<button
				onClick={onToggle}
				className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-transparent dark:text-white"
				aria-label="Profile"
			>
				<ProfileIcon />
			</button>

			{open ? (
				<div className="absolute right-0 top-full z-50 mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden dark:bg-[#1A2333] dark:border-[#243041]">
					<div className="p-4 border-b border-slate-200 dark:border-[#243041]">
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-transparent dark:text-white">
								<ProfileIcon />
							</div>
							<div>
								<p className="text-slate-900 font-semibold dark:text-white">
									{userName ?? "—"}
								</p>
								<p className="text-slate-500 text-xs mt-1 dark:text-slate-500">
									{userId ?? "—"}
								</p>
							</div>
						</div>
					</div>

					<div className="p-2">
						<Link
							href="/employee"
							onClick={onClose}
							className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
						>
							<HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
							Employee
						</Link>

						<Link
							href="/finance/history"
							onClick={onClose}
							className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
						>
							<HistoryIcon />
							History
						</Link>

						<div className="my-2 h-px bg-slate-200 dark:bg-[#243041]" />
						<button
							onClick={onClose}
							className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
						>
							<HiOutlineArrowRightOnRectangle className="h-4 w-4" />
							Sign out
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}
