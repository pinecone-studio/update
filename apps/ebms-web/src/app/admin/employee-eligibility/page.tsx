/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EmployeeEligibilitySkeleton } from "../components/EmployeeEligibilitySkeleton";
import { GraphQLClient, gql } from "graphql-request";

type EmployeeListItem = {
  id: string;
  name?: string | null;
  role?: string | null;
  employmentStatus?: string | null;
};

type EmployeeRow = {
  id: string;
  name: string;
  department: string;
};

const initialEmployees: EmployeeRow[] = [];

const EMPLOYEES_QUERY = gql`
  query Employees {
    employees {
      id
      name
      role
      employmentStatus
    }
  }
`;

function getClient(): GraphQLClient {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const base = raw.replace(/\/graphql\/?$/, "").trim() || "http://localhost:8787";
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      "x-employee-id": "admin",
      "x-role": "admin",
    },
  });
}

export default function EmployeeEligibilityPage() {
	const [loading, setLoading] = useState(true);
	const [employeeList, setEmployeeList] =
		useState<EmployeeRow[]>(initialEmployees);
	const [search, setSearch] = useState("");

	const filteredEmployees = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return employeeList;
		return employeeList.filter(
			(emp) =>
				emp.name.toLowerCase().includes(q) ||
				emp.id.toLowerCase().includes(q) ||
				emp.department.toLowerCase().includes(q),
		);
	}, [search, employeeList]);

	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();

	useEffect(() => {
		const client = getClient();
		client
			.request<{ employees: EmployeeListItem[] }>(EMPLOYEES_QUERY)
			.then((data) => {
				const rows: EmployeeRow[] = (data.employees ?? []).map((e) => ({
					id: e.id ?? "",
					name: e.name ?? "Unknown",
					department: e.role ?? e.employmentStatus ?? "—",
				}));
				setEmployeeList(rows);
			})
			.catch(() => {
				setEmployeeList([]);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <EmployeeEligibilitySkeleton />;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-xl font-semibold text-slate-900 dark:text-white">
					Employee Eligibility Overview
				</h1>
				<p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
					Нэрээр хайж, ажилтан дээр дарахад benefit eligibility-г бүтэн дэлгэц дээр
					харна.
				</p>
			</div>

			<section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
				<div className="relative">
					<span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#93A4C3]">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							className="h-6 w-6"
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
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Ажилтны нэрээр хайх..."
						className="h-14 w-full rounded-2xl border border-slate-300 bg-slate-50 pl-14 pr-4 text-5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8FA3C5] dark:focus:border-[#4B6FA8]"
					/>
				</div>
			</section>

			<section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
				<h2 className="text-10 font-semibold text-slate-900 dark:text-white">
					Ажилтнуудын жагсаалт
				</h2>
				<div className="mt-4 space-y-2">
					{filteredEmployees.map((emp) => (
						<Link
							key={emp.id}
							href={`/admin/employee-eligibility/${emp.id}`}
							className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100 dark:border-[#324A70] dark:bg-[#0F172A] dark:hover:bg-[#142544]"
						>
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7B7FFF] to-[#6B35FF] text-5 font-semibold text-white">
								{getInitials(emp.name)}
							</span>
							<div>
								<p className="text-5 font-medium text-slate-900 dark:text-white">{emp.name}</p>
								<p className="text-5 text-slate-500 dark:text-[#8FA3C5]">{emp.department}</p>
							</div>
						</Link>
					))}
					{filteredEmployees.length === 0 && (
						<p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-5 text-slate-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-[#9FB0CF]">
							Хайлтад тохирох ажилтан олдсонгүй.
						</p>
					)}
				</div>
			</section>
		</div>
	);
}
