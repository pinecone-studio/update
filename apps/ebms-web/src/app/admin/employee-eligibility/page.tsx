/** @format */

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EmployeeEligibilitySkeleton } from "../components/EmployeeEligibilitySkeleton";
import { GraphQLClient, gql } from "graphql-request";
import {
    ensureValidActiveUserProfile,
    getActiveUserHeaders,
} from "@/app/_lib/activeUser";
import { SearchIcon } from "@/app/icons/search";

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
    const base =
        raw.replace(/\/graphql\/?$/, "").trim() || "http://localhost:8787";
    const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
    return new GraphQLClient(url, {
        headers: {
            ...getActiveUserHeaders("admin"),
        },
    });
}

function EmployeeEligibilityPageContent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") ?? "";
    const [loading, setLoading] = useState(true);
    const [employeeList, setEmployeeList] =
        useState<EmployeeRow[]>(initialEmployees);
    const [search, setSearch] = useState(initialSearch);

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
        let cancelled = false;
        (async () => {
            try {
                await ensureValidActiveUserProfile();
                const client = getClient();
                const data =
                    await client.request<{ employees: EmployeeListItem[] }>(
                        EMPLOYEES_QUERY,
                    );
                if (cancelled) return;
                const rows: EmployeeRow[] = (data.employees ?? []).map((e) => ({
                    id: e.id ?? "",
                    name: e.name ?? "Unknown",
                    department: e.role ?? e.employmentStatus ?? "—",
                }));
                setEmployeeList(rows);
            } catch {
                if (!cancelled) {
                    setEmployeeList([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        setSearch(initialSearch);
    }, [initialSearch]);

    if (loading) {
        return <EmployeeEligibilitySkeleton />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[35px] font-medium text-slate-900 dark:text-white">
                    Employee Eligibility Overview
                </h1>
                <p className="mt-3 text-[20px]text-slate-600 font-normal dark:text-[#A7B6D3]">
                Understand which employees qualify for benefits.
                </p>
            </div>

            <section className="rounded-2xl bg-white p-6 dark:border-[#2C4264] dark:bg-[#20194D80]/50">
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
                        placeholder="Search employees by name"
                        className="h-14 w-full rounded-2xl text-[20px] font-normal border border-white/50  bg-slate-50 pl-14 pr-4 text-5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#FAFBFB1A10 dark:border-[#324A70]/10 dark:bg-[#0B102B1A]/10 dark:text-white dark:placeholder:text-white/50 dark:focus:border-white/50"
                    />
                </div>
            </section>

            <section className="rounded-3xl h-[450px] p-6 overflow-hidden flex flex-col dark:border-[#2C4264] dark:bg-[#20194D80]/50">
                <div className="space-y-2 overflow-y-auto overflow-x-hidden overscroll-contain flex-1 min-h-0 pr-1">
                    {filteredEmployees.map((emp, index) => (
                        <Link
                            key={emp.id}
                            href={`/admin/employee-eligibility/${emp.id}`}
                            className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-all duration-300 ease-out hover:opacity-80 animate-card-slide-in"
                            style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7B7FFF] to-[#6B35FF] text-5 font-semibold text-white">
                                {getInitials(emp.name)}
                            </span>
                            <div className="flex flex-row items-center justify-between w-full">
                            <div>
                                <p className="text-5 font-medium text-slate-900 dark:text-white">
                                    {emp.name}
                                </p>
                                <p className="text-5 text-slate-500 dark:text-[#8FA3C5]">
                                    {emp.department}
                                </p>
                            </div>
                            <div>
                                <p className="text-5 font-medium text-slate-900 dark:text-white">Show details</p>
                            </div>
                            </div>
                        </Link>
                    ))}
                    {filteredEmployees.length === 0 && (
                        <div className="flex items-center justify-center rounded-2xl border border-white/50 h-[402px] flex-col gap-3.5  text-center">
                            <button className="w-[87px] h-[87px] flex items-center justify-center bg-[#20194D80]/50 rounded-full">
                            <SearchIcon />
                            </button>
                            <p className="text-[28px] font-normal text-slate-500 dark:text-[#9FB0CF]">
                                No employees found.
                            </p>
                            <p className="text-[19px] font-normal text-slate-500 dark:text-[#9FB0CF]">
                                Try adjusting your search
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function EmployeeEligibilityPage() {
    return (
        <Suspense fallback={<EmployeeEligibilitySkeleton />}>
            <EmployeeEligibilityPageContent />
        </Suspense>
    );
}