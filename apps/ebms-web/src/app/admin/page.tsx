/** @format */
"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "./_lib/api";

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

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    PENDING: "bg-[#FFAD0F]/20 text-[#FFAD0F] border-[#FFAD0F]/40",
    APPROVED: "bg-[#00C95F]/20 text-[#00C95F] border-[#00C95F]/40",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/40",
    CANCELLED: "bg-[#64748B]/20 text-[#94A3B8] border-[#64748B]/40",
  };
  const cls = styles[status] ?? "bg-[#64748B]/20 text-[#94A3B8] border-[#64748B]/40";
  return <span className={`inline-flex rounded-xl border px-3 py-1 text-xs font-medium ${cls}`}>{status}</span>;
}

export default function HrDashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<BenefitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeBenefits, setActiveBenefits] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>("PENDING");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [eligibilitySearch, setEligibilitySearch] = useState("");
  const [employeesForSearch, setEmployeesForSearch] = useState<EmployeeSearchItem[]>([]);
  const [selectedContractFileByRequestId, setSelectedContractFileByRequestId] =
    useState<Record<string, File | null>>({});
  const [uploadingContractByRequestId, setUploadingContractByRequestId] =
    useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    const client = getAdminClient();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await client.request<{ benefitRequests: BenefitRequest[] }>(
          BENEFIT_REQUESTS_QUERY,
          { status: statusFilter ?? undefined }
        );
        if (!cancelled) {
          setRequests((res.benefitRequests ?? []).map((r) => ({ ...r, status: (r.status || "PENDING").toUpperCase() })));
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
            employees: Array<{ id: string; name?: string | null; role?: string | null; employmentStatus?: string | null }>;
          }>(EMPLOYEES_COUNT_QUERY),
          client.request<{ benefits: Array<{ id: string }> }>(ACTIVE_BENEFITS_COUNT_QUERY),
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
              .filter((e) => e.id && e.name)
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
      title: "Total Employees",
      value: String(totalEmployees),
      toneClass: "border-[#2A8BFF]/40 bg-[#2A8BFF]/20 text-[#2A8BFF]",
      icon: <HrTotalEmployeeIcon />,
    },
    {
      key: "benefits",
      title: "All Benefits",
      value: String(activeBenefits),
      toneClass: "border-[#00C95F]/40 bg-[#00C95F]/20 text-[#00C95F]",
      icon: <HrActiveBenefitsIcon />,
    },
  ];

  const normalizedSearch = eligibilitySearch.trim().toLowerCase();
  const apiBaseUrl = getApiBaseUrl().replace(/\/$/, "");
  const employeeSuggestions = useMemo(() => {
    if (!normalizedSearch) return [];
    return employeesForSearch
      .filter(
        (emp) =>
          emp.name.toLowerCase().includes(normalizedSearch) ||
          emp.id.toLowerCase().includes(normalizedSearch) ||
          emp.department.toLowerCase().includes(normalizedSearch)
      )
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(normalizedSearch) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(normalizedSearch) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 12);
  }, [employeesForSearch, normalizedSearch]);

  const displayRequests = requests.filter(
    (req) => !statusFilter || (req.status || "PENDING").toUpperCase() === statusFilter
  );

  const handleApprove = async (requestId: string) => {
    setActionLoadingId(requestId);
    try {
      await confirmBenefitRequest(getAdminClient(), requestId, true);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "APPROVED" } : r)));
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
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "REJECTED" } : r)));
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
        { status: statusFilter ?? undefined }
      );
      setRequests((res.benefitRequests ?? []).map((r) => ({ ...r, status: (r.status || "PENDING").toUpperCase() })));
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setUploadingContractByRequestId((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  if (loading) return <AdminDashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-2 sm:mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">Overview of your HR benefits management system</p>
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-2 lg:col-span-1">
          {statCards.map((card) => (
            <article key={card.title} className="min-w-0 h-[128px] rounded-xl border border-slate-200 bg-white p-3 text-left dark:border-[#2C4264] dark:bg-[#1E293B]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg border text-base ${card.toneClass}`}>{card.icon}</div>
                  <button
                    type="button"
                    onClick={() => router.push(card.key === "employees" ? "/admin/employee-eligibility" : "/admin/add-benefit")}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xl text-blue-600 dark:bg-[#24364F] dark:text-[#2A8BFF]"
                    aria-label={`${card.title} details`}
                  >
                    ›
                  </button>
                </div>
                <p className="flex items-baseline gap-2 text-8 font-medium text-slate-600 dark:text-[#A7B6D3]">
                  <span>{card.title}</span>
                  <span className="text-10 font-semibold text-slate-900 dark:text-white">{card.value}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <article className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 dark:border-[#2C4264] dark:bg-[#1E293B]">
        <div className="mb-4 sm:mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <h2 className="text-11 font-semibold text-slate-900 dark:text-white">Employee Benefit Requests</h2>
          <div className="flex flex-wrap gap-2">
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
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  statusFilter === value
                    ? "bg-blue-600 text-white dark:bg-[#2A8BFF]"
                    : "border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-[#2C4264] dark:text-[#A7B6D3] dark:hover:bg-[#24364F]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-2 text-red-200">{error}</div>}

        {displayRequests.length === 0 ? (
          <p className="py-8 text-center text-slate-600 dark:text-[#A7B6D3]">No benefit requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-5">
              <thead className="border-b border-slate-200 text-slate-600 dark:border-[#2B405F] dark:text-[#A7B6D3]">
                <tr>
                  <th className="px-3 py-3 font-medium sm:px-4 sm:py-4">Request (Benefit)</th>
                  <th className="px-3 py-3 font-medium sm:px-4 sm:py-4">Employee</th>
                  <th className="px-3 py-3 font-medium sm:px-4 sm:py-4">Status</th>
                  <th className="px-3 py-3 font-medium sm:px-4 sm:py-4">Contract</th>
                  <th className="px-3 py-3 font-medium sm:px-4 sm:py-4">Date</th>
                  <th className="px-3 py-3 font-medium sm:px-4 sm:py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayRequests.map((req) => {
                  const status = (req.status || "PENDING").toUpperCase();
                  const isLoading = actionLoadingId === req.id;
                  const hasUploadedSignedContract = Boolean(req.contractTemplateUrl);
                  const canUploadSignedContract =
                    req.requiresContract && status === "APPROVED" && !hasUploadedSignedContract;
                  const isUploadingSignedContract =
                    uploadingContractByRequestId[req.id] ?? false;
                  const signedContractUrl = req.contractTemplateUrl
                    ? req.contractTemplateUrl.startsWith("http")
                      ? req.contractTemplateUrl
                      : `${apiBaseUrl}${req.contractTemplateUrl.startsWith("/") ? "" : "/"}${req.contractTemplateUrl}`
                    : null;

                  return (
                    <tr key={req.id} className="border-b border-slate-200 last:border-b-0 dark:border-[#2B405F]">
                      <td className="px-3 py-3 font-medium text-slate-900 dark:text-white sm:px-4 sm:py-4">{req.benefitName ?? req.benefitId}</td>
                      <td className="px-3 py-3 text-slate-600 dark:text-[#A7B6D3] sm:px-4 sm:py-4">{req.employeeName ?? req.employeeId}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4">{statusBadge(status)}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4">
                        {req.requiresContract ? (
                          hasUploadedSignedContract ? (
                            <a
                              href={signedContractUrl ?? "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-emerald-500 underline"
                            >
                              Signed contract
                            </a>
                          ) : (
                            <span className="text-xs font-medium text-amber-500">
                              Await upload
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500">N/A</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-slate-500 dark:text-[#8FA3C5] sm:px-4 sm:py-4">{formatDate(req.createdAt)}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4">
                        {status === "PENDING" ? (
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <button
                              type="button"
                              onClick={() => handleApprove(req.id)}
                              disabled={isLoading}
                              className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isLoading ? "..." : "Approve"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(req.id)}
                              disabled={isLoading}
                              className="rounded-lg bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            {canUploadSignedContract ? (
                              <>
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(e) =>
                                    setSelectedContractFileByRequestId((prev) => ({
                                      ...prev,
                                      [req.id]: e.target.files?.[0] ?? null,
                                    }))
                                  }
                                  className="text-xs text-slate-600 dark:text-slate-300 file:mr-2 file:rounded-md file:border-0 file:bg-slate-200 file:px-2 file:py-1 file:text-xs file:text-slate-700 dark:file:bg-[#24364F] dark:file:text-[#D1DBEF]"
                                />
                                <button
                                  type="button"
                                  disabled={
                                    !selectedContractFileByRequestId[req.id] ||
                                    isUploadingSignedContract
                                  }
                                  onClick={() => void handleUploadSignedContract(req.id)}
                                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {isUploadingSignedContract ? "Uploading..." : "Upload signed"}
                                </button>
                              </>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">—</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}