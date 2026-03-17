/** @format */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { gql } from "graphql-request";
import { HrTotalEmployeeIcon } from "../icons/hrTotalEmployee";
import { HrActiveBenefitsIcon } from "../icons/hrActiveBenefits";
import { AdminDashboardSkeleton } from "./components/AdminDashboardSkeleton";
import {
  getAdminClient,
  getApiBaseUrl,
  confirmBenefitRequest,
  getApiErrorMessage,
  uploadSignedContractForRequest,
  fetchUnclosedFeedback,
  closeFeedback,
  type EscalatedFeedbackItem,
} from "./_lib/api";
import { ProfileIcon } from "@/app/icons/profile";

const BENEFIT_REQUESTS_QUERY = gql`
  query BenefitRequests($status: RequestStatus) {
    benefitRequests(status: $status) {
      id
      employeeId
      benefitId
      status
      createdAt
      employeeName
      benefitName
      rejectReason
      requiresContract
      contractAcceptedAt
      contractTemplateUrl
    }
  }
`;

const EMPLOYEES_COUNT_QUERY = gql`
  query EmployeesCount {
    employees {
      id
      name
      role
      employmentStatus
    }
  }
`;

const ACTIVE_BENEFITS_COUNT_QUERY = gql`
  query ActiveBenefitsCount {
    benefits {
      id
      name
      category
    }
  }
`;

type BenefitRequest = {
  id: string;
  employeeId: string;
  benefitId: string;
  status: string;
  createdAt: string;
  employeeName?: string | null;
  benefitName?: string | null;
  rejectReason?: string | null;
  requiresContract: boolean;
  contractAcceptedAt?: string | null;
  contractTemplateUrl?: string | null;
};

type EmployeeSearchItem = {
  id: string;
  name: string;
  department: string;
};

type StatCard = {
  key: "employees" | "benefits";
  title: string;
  value: string;
  icon: ReactNode;
  toneClass: string;
};

function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatRelativeTime(iso: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    return formatDate(iso);
  } catch {
    return iso;
  }
}

function getInitials(name: string | null | undefined): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
export default function HrDashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<BenefitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeBenefits, setActiveBenefits] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    "PENDING",
  );
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [eligibilitySearch, setEligibilitySearch] = useState("");
  const [employeesForSearch, setEmployeesForSearch] = useState<
    EmployeeSearchItem[]
  >([]);
  const [selectedContractFileByRequestId, setSelectedContractFileByRequestId] =
    useState<Record<string, File | null>>({});
  const [uploadingContractByRequestId, setUploadingContractByRequestId] =
    useState<Record<string, boolean>>({});
  const [unclosedFeedback, setUnclosedFeedback] = useState<
    EscalatedFeedbackItem[]
  >([]);
  const [feedbackClosingId, setFeedbackClosingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    const client = getAdminClient();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await client.request<{ benefitRequests: BenefitRequest[] }>(
          BENEFIT_REQUESTS_QUERY,
          { status: statusFilter ?? undefined },
        );
        if (!cancelled) {
          setRequests(
            (res.benefitRequests ?? []).map((r) => ({
              ...r,
              status: (r.status || "PENDING").toUpperCase(),
            })),
          );
        }
      } catch (e) {
        if (!cancelled) {
          setError(getApiErrorMessage(e));
          setRequests([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  useEffect(() => {
    let cancelled = false;
    const client = getAdminClient();

    (async () => {
      try {
        const [employeesRes, benefitsRes] = await Promise.all([
          client.request<{
            employees: Array<{
              id: string;
              name?: string | null;
              role?: string | null;
              employmentStatus?: string | null;
            }>;
          }>(EMPLOYEES_COUNT_QUERY),
          client.request<{ benefits: Array<{ id: string }> }>(
            ACTIVE_BENEFITS_COUNT_QUERY,
          ),
        ]);

        if (!cancelled) {
          const employees = employeesRes.employees ?? [];
          setTotalEmployees(employees.length);
          setActiveBenefits((benefitsRes.benefits ?? []).length);
          setEmployeesForSearch(
            employees
              .map((e) => ({
                id: e.id,
                name: (e.name ?? "").trim(),
                department: (e.role ?? e.employmentStatus ?? "").trim(),
              }))
              .filter((e) => e.id && e.name),
          );
        }
      } catch {
        if (!cancelled) {
          setTotalEmployees(0);
          setActiveBenefits(0);
          setEmployeesForSearch([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const statCards: StatCard[] = [
    {
      key: "employees",
      title: "Total-Employees",
      value: String(totalEmployees),
      toneClass: "from-purple-600/80 to-purple-800/90",
      icon: <HrTotalEmployeeIcon />,
    },
    {
      key: "benefits",
      title: "All-Benefits",
      value: String(activeBenefits),
      toneClass: "from-emerald-500/80 to-cyan-700/90",
      icon: <HrActiveBenefitsIcon />,
    },
  ];

  const normalizedSearch = eligibilitySearch.trim().toLowerCase();
  const apiBaseUrl = getApiBaseUrl().replace(/\/$/, "");
  const employeeIdToDepartment = useMemo(() => {
    const map: Record<string, string> = {};
    for (const e of employeesForSearch) {
      if (e.id && e.department) map[e.id] = e.department;
    }
    return map;
  }, [employeesForSearch]);

  const employeeSuggestions = useMemo(() => {
    if (!normalizedSearch) return [];
    return employeesForSearch
      .filter(
        (emp) =>
          emp.name.toLowerCase().includes(normalizedSearch) ||
          emp.id.toLowerCase().includes(normalizedSearch) ||
          emp.department.toLowerCase().includes(normalizedSearch),
      )
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(normalizedSearch)
          ? 0
          : 1;
        const bStarts = b.name.toLowerCase().startsWith(normalizedSearch)
          ? 0
          : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 12);
  }, [employeesForSearch, normalizedSearch]);

  const displayRequests = requests.filter(
    (req) =>
      !statusFilter || (req.status || "PENDING").toUpperCase() === statusFilter,
  );

  const handleApprove = async (requestId: string) => {
    setActionLoadingId(requestId);
    try {
      await confirmBenefitRequest(getAdminClient(), requestId, true);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "APPROVED" } : r,
        ),
      );
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = window.prompt("Reject reason")?.trim();
    if (!reason) return;
    setActionLoadingId(requestId);
    try {
      await confirmBenefitRequest(getAdminClient(), requestId, false, reason);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "REJECTED" } : r,
        ),
      );
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUploadSignedContract = async (requestId: string) => {
    const file = selectedContractFileByRequestId[requestId];
    if (!file) {
      setError("Please select signed contract PDF first.");
      return;
    }
    setUploadingContractByRequestId((prev) => ({ ...prev, [requestId]: true }));
    setError(null);
    try {
      await uploadSignedContractForRequest(getAdminClient(), requestId, file);
      const client = getAdminClient();
      const res = await client.request<{ benefitRequests: BenefitRequest[] }>(
        BENEFIT_REQUESTS_QUERY,
        { status: statusFilter ?? undefined },
      );
      setRequests(
        (res.benefitRequests ?? []).map((r) => ({
          ...r,
          status: (r.status || "PENDING").toUpperCase(),
        })),
      );
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setUploadingContractByRequestId((prev) => ({
        ...prev,
        [requestId]: false,
      }));
    }
  };

  if (loading) return <AdminDashboardSkeleton />;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden">
      <section className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_1fr] gap-8 lg:grid-cols-[auto_1fr] lg:grid-rows-1 px-6 py-6 overflow-hidden">
        <div className="flex flex-col gap-8 lg:min-w-[454px]">
          {statCards.map((card) => (
            <article
              key={card.title}
              className="flex h-[320px] w-[454px] flex-col rounded-2xl px-[54px] py-[48px] text-left shadow-lg ring-1 ring-white/10"
              style={{
                background:
                  card.key === "employees"
                    ? "rgba(225, 42, 251, 0.1)"
                    : "rgba(1, 116, 138, 0.1)",
              }}
            >
              <div className="flex flex-1 flex-col justify-between gap-6">
                <div className="flex items-center gap-10">
                  <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-xl border border-white/50 text-white">
                    {card.icon}
                  </div>
                  <p className="text-[24px] font-semibold text-[#FAFBFB]">{card.title}</p>
                </div>
                <div className="flex items-center justify-between gap-10">
                  <button
                    type="button"
                    onClick={() => router.push(card.key === "employees" ? "/admin/employee-eligibility" : "/admin/add-benefit")}
                    className="shrink-0 rounded-lg border border-white/50 px-10 py-2.5 text-[24px] font-medium text-[#F2F3F3] transition hover:bg-[#4F2754]/70"
                    style={{
                      background:
                        card.key === "employees"
                          ? "rgba(79, 39, 84, 0.5)"
                          : "rgba(1, 40, 36, 0.3)",
                    }}
                  >
                    Manage 
                  </button>
                  <p className="text-[154px] font-normal leading-none text-[#EDF6FF]">{card.value}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <article
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border border-[rgba(38, 38, 38, 1)] bg-[rgba(13, 94, 85, 0.1)] sm:p-6 dark:border-[#262626]"
        >
        <div className="mb-4 shrink-0 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between px-6 pt-6">
          <h2 className="text-xl font-bold text-white">Employee Benefit Requests</h2>
          <div className="rounded-2xl border border-white/30 overflow-hidden w-auto">
            <div className="flex gap-1.5 w-[472px] h-[49px]">
              {([
                { value: "PENDING" as const, label: "Pending" },
                { value: "APPROVED" as const, label: "Approved" },
                { value: "REJECTED" as const, label: "Rejected" },
                { value: undefined, label: "All" },
              ] as const).map(({ value, label }) => (
                <button
                  key={value ?? "all"}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={`shrink-0 rounded-2xl px-[22px] py-2.5  text-[20px] font-medium transition ${
                    statusFilter === value
                      ? "bg-slate-200 text-slate-800 dark:bg-slate-200 dark:text-slate-800"
                      : "bg-transparent text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="mx-8 mb-4 shrink-0 rounded-lg border border-red-500/50  px-4 py-2 text-red-200">{error}</div>}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {displayRequests.length === 0 ? (
            <p className="px-8 py-8 text-center text-slate-400 dark:text-[#A7B6D3]">No benefit requests found.</p>
          ) : (
            <div className="divide-y divide-white/30 px-8 pb-8">
              {displayRequests.map((req) => {
              const status = (req.status || "PENDING").toUpperCase();
              const isLoading = actionLoadingId === req.id;
              const needsSignature = req.requiresContract && !req.contractAcceptedAt;
              const employeeName = req.employeeName ?? req.employeeId ?? "";
              const benefitText = req.benefitName ?? req.benefitId ?? "Benefit request";
              const affiliation = employeeIdToDepartment[req.employeeId] ?? "";

                return (
                  <div
                    key={req.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <span className="text-xs text-slate-400 dark:text-[#94A3B8]">
                        {formatRelativeTime(req.createdAt)}
                      </span>

                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                          {getInitials(employeeName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white">
                            {employeeName}
                          </p>
                          {affiliation ? (
                            <p className="text-sm text-slate-400 dark:text-[#94A3B8]">
                              {affiliation}
                            </p>
                          ) : null}
                          <p className="mt-0.5 text-sm text-white dark:text-[#E2E8F0]">
                            {benefitText}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-3">
                      {status === "PENDING" ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled
                            className="rounded-lg bg-[#8A5212] px-3 py-1.5 text-base font-medium h-[38px] w-[94px] text-[#ffffff]  transition disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(req.id)}
                            disabled={isLoading}
                            className="rounded-lg bg-[#0f5540]  h-[38px] w-[94px]  px-3 py-1.5 text-base font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isLoading ? "..." : "Approve"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(req.id)}
                            disabled={isLoading}
                            className="rounded-lg bg-[#851618] px-3 py-1.5 text-base font-medium h-[38px] w-[94px] text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : status === "APPROVED" ? (
                        <button
                        type="button"
                        disabled={isLoading}
                        className="rounded-lg bg-[#0f5540]  h-[28px] w-[84px]  px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
                      >
                      Approved
                      </button>
                      ) : status === "REJECTED" ? (
                        <button
                        type="button"
                        disabled={isLoading}
                        className="rounded-lg bg-[#851618] px-3 py-1.5 text-base font-medium h-[28px] w-[84px] text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
                      >
                        Reject
                      </button>
                      ) : null}
                    </div>
                  </div>
              );
            })}
            </div>
          )}
        </div>
      </article>
      </section>
    </div>
  );
}
