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
    <section className="flex h-[500px] flex-col overflow-hidden rounded-3xl dark:bg-[#20194D80]/50">
      <div className="grid grid-cols-[40px_1fr_1fr_auto] items-center gap-4 border-b border-white/10 px-6 py-4 text-left text-sm font-medium text-slate-500 dark:border-[#2C4264] dark:bg-[#60587B4D] dark:text-[#93A4C3]">
        <span>#</span>
        <span>Employee</span>
        <span>Role</span>
        <span>Action</span>
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto overscroll-contain px-6 pb-10">
        {employees.length === 0 ? (
          <div className="flex h-[350px] flex-col items-center justify-center gap-3.5 rounded-2xl border border-white/50 text-center">
            <div className="flex h-[87px] w-[87px] items-center justify-center rounded-full bg-[#20194D80]/50">
              <SearchIcon />
            </div>
            <p className="text-[28px] font-normal text-slate-500 dark:text-[#9FB0CF]">
              No employees found.
            </p>
            <p className="text-[19px] font-normal text-slate-500 dark:text-[#9FB0CF]">
              Try adjusting your search
            </p>
          </div>
        ) : (
          employees.map((emp, index) => (
            <Link
              key={emp.id}
              href={`/admin/employee-eligibility/${emp.id}`}
              className="-mx-6 grid grid-cols-[40px_1fr_1fr_auto] items-center gap-4 border-b border-white/5 px-6 py-3 text-left transition-all duration-300 ease-out last:border-b-0 hover:bg-white/5 dark:border-[#2C4264]/50 dark:hover:bg-white/5 animate-card-slide-in"
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
              <span className="truncate text-slate-500 dark:text-[#8FA3C5]">
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
