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
		<section className="flex h-[500px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[var(--shadow-card)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
			<div className="grid grid-cols-[40px_1fr_1fr_auto] items-center gap-4 border-b border-slate-200 px-6 py-4 text-left text-sm font-medium text-slate-500 dark:border-white/10 dark:text-white/70">
				<span>#</span>
				<span>Employee</span>
				<span>Role</span>
				<span>Action</span>
			</div>
			<div className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto overscroll-contain px-6 pb-10">
				{employees.length === 0 ? (
					<div className="flex h-[350px] flex-col items-center justify-center gap-3.5 rounded-2xl border border-slate-200 text-center dark:border-white/20">
						<div className="flex h-[87px] w-[87px] items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-white/50">
							<SearchIcon />
						</div>
						<p className="text-[28px] font-normal text-slate-500 dark:text-white/70">
							No employees found.
						</p>
						<p className="text-[19px] font-normal text-slate-500 dark:text-white/60">
							Try adjusting your search
						</p>
					</div>
				) : (
					employees.map((emp, index) => (
						<Link
							key={emp.id}
							href={`/admin/employee-eligibility/${emp.id}`}
							className="-mx-6 grid grid-cols-[40px_1fr_1fr_auto] items-center gap-4 border-b border-slate-100 px-6 py-3 text-left transition-all duration-300 ease-out last:border-b-0 hover:bg-slate-50 animate-card-slide-in dark:border-white/5 dark:hover:bg-white/5"
							style={{
								animationDelay: `${index * 50}ms`,
								animationFillMode: "backwards",
							}}
						>
							<span className="text-sm text-slate-500 dark:text-white/70">
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
							<span className="truncate text-slate-500 dark:text-white/70">
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
