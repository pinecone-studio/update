/** @format */

"use client";

import Link from "next/link";
import { SearchIcon } from "@/app/icons/search";

type EmployeeRow = {
	id: string;
	name: string;
	department: string;
};

function getInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

type EmployeeListSectionProps = {
	employees: EmployeeRow[];
};

export function EmployeeListSection({ employees }: EmployeeListSectionProps) {
	return (
		<section className="flex min-h-[400px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/90 sm:h-[500px] dark:border-white/10 dark:bg-[#16142a]">
			<div className="grid grid-cols-[32px_1fr_auto] items-center gap-2 border-b border-slate-200 px-3 py-3 text-left text-xs font-medium text-slate-500 sm:grid-cols-[40px_1fr_1fr_auto] sm:gap-4 sm:px-6 sm:py-4 sm:text-sm dark:border-[#2C4264] dark:bg-[#60587B4D] dark:text-[#93A4C3]">
				<span>#</span>
				<span>Employee</span>
				<span className="hidden sm:inline">Role</span>
				<span>Action</span>
			</div>
			<div className="min-h-0 flex-1 space-y-1 overflow-x-auto overflow-y-auto overscroll-contain px-3 pb-10 sm:overflow-x-hidden sm:px-6">
				{employees.length === 0 ? (
					<div className="flex h-[350px] flex-col items-center justify-center gap-3.5 rounded-2xl border border-slate-200 text-center dark:border-white/50">
						<div className="flex h-[87px] w-[87px] items-center justify-center rounded-full bg-slate-100 dark:bg-[#1e1a35]">
							<SearchIcon />
						</div>
						<p className="text-lg font-normal text-slate-500 sm:text-[28px] dark:text-[#9FB0CF]">
							No employees found.
						</p>
						<p className="text-base font-normal text-slate-500 sm:text-[19px] dark:text-[#9FB0CF]">
							Try adjusting your search
						</p>
					</div>
				) : (
					employees.map((emp, index) => (
						<Link
							key={emp.id}
							href={`/admin/employee-eligibility/${emp.id}`}
							className="-mx-3 grid grid-cols-[32px_1fr_auto] items-center gap-2 border-b border-slate-200 px-3 py-3 text-left transition-all duration-300 ease-out last:border-b-0 hover:bg-slate-50 animate-card-slide-in dark:border-[#2C4264]/50 dark:hover:bg-white/5 sm:-mx-6 sm:grid-cols-[40px_1fr_1fr_auto] sm:gap-4 sm:px-6"
							style={{
								animationDelay: `${index * 50}ms`,
								animationFillMode: "backwards",
							}}
						>
							<span className="text-sm text-slate-500 dark:text-[#8FA3C5]">
								{index + 1}
							</span>
							<div className="flex min-w-0 items-center gap-3">
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7B7FFF] to-[#6B35FF] text-sm font-semibold text-white">
									{getInitials(emp.name)}
								</span>
								<span className="truncate font-medium text-slate-900 dark:text-white">
									{emp.name}
								</span>
							</div>
							<span className="hidden truncate text-slate-500 sm:inline dark:text-[#8FA3C5]">
								{emp.department}
							</span>
							<span className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-500">
								View
							</span>
						</Link>
					))
				)}
			</div>
		</section>
	);
}
