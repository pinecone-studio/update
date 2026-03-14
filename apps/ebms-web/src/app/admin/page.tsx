/** @format */
"use client";

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from 'graphql-request';
import { HrTotalEmployeeIcon } from "../icons/hrTotalEmployee";
import { HrActiveBenefitsIcon } from "../icons/hrActiveBenefits";
import { AdminDashboardSkeleton } from "./components/AdminDashboardSkeleton";
import {
  getAdminClient,
  confirmBenefitRequest,
  fetchBenefitRequestContractHtml,
  getApiErrorMessage,
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

type StatCard = {
  key: 'employees' | 'benefits';
  title: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
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
	const s = styles[status] ?? "bg-[#64748B]/20 text-[#94A3B8]";
	return (
		<span
			className={`inline-flex rounded-xl border px-3 py-1 text-xs font-medium ${s}`}
		>
			{status}
		</span>
	);
}

export default function HrDashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<BenefitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [activeBenefits, setActiveBenefits] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>('PENDING');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [eligibilitySearch, setEligibilitySearch] = useState('');
  const [employeesForSearch, setEmployeesForSearch] = useState<
    Array<{ id: string; name: string; department: string }>
  >([]);

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
          const data = (res.benefitRequests ?? []).map((r) => ({
            ...r,
            status: (r.status || 'PENDING').toUpperCase(),
          }));
          setRequests(data);
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
    async function loadStats() {
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
          client.request<{ benefits: Array<{ id: string; name?: string | null; category?: string | null }> }>(
            ACTIVE_BENEFITS_COUNT_QUERY
          ),
        ]);
        if (!cancelled) {
          const employees = employeesRes.employees ?? [];
          const benefits = benefitsRes.benefits ?? [];
          setTotalEmployees(employees.length);
          setActiveBenefits(benefits.length);
          setEmployeesForSearch(
            employees
              .map((e) => ({
                id: e.id,
                name: (e.name ?? '').trim(),
                department: (e.role ?? e.employmentStatus ?? '').trim(),
              }))
              .filter((e) => e.id.length > 0 && e.name.length > 0)
          );
        }
      } catch {
        if (!cancelled) {
          setTotalEmployees(0);
          setActiveBenefits(0);
          setEmployeesForSearch([]);
        }
      }
    }
    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const statCards: StatCard[] = [
    {
      key: 'employees',
      title: "Total Employees",
      value: String(totalEmployees),
      iconBg: "bg-[#2A8BFF]",
      toneClass: "border-[#2A8BFF]/40 bg-[#2A8BFF]/20 text-[#2A8BFF]",
      icon: <HrTotalEmployeeIcon />,
    },
    {
      key: 'benefits',
      title: "All Benefits",
      value: String(activeBenefits),
      iconBg: "bg-[#00C95F]",
      toneClass: "border-[#00C95F]/40 bg-[#00C95F]/20 text-[#00C95F]",
      icon: <HrActiveBenefitsIcon />,
    },
  ];

	const handleApprove = async (requestId: string) => {
		setActionLoadingId(requestId);
		try {
			const client = getAdminClient();
			await confirmBenefitRequest(client, requestId, true);
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

	const handleReject = async (requestId: string, comment: string) => {
		setActionLoadingId(requestId);
		try {
			const client = getAdminClient();
			await confirmBenefitRequest(
				client,
				requestId,
				false,
				comment.trim() || undefined,
			);
			setRequests((prev) =>
				prev.map((r) =>
					r.id === requestId ? { ...r, status: "REJECTED" } : r,
				),
			);
			setRejectingId(null);
			setRejectComment("");
		} catch (e) {
			setError(getApiErrorMessage(e));
		} finally {
			setActionLoadingId(null);
		}
	};

  const handleViewTemplate = async (requestId: string) => {
    try {
      const html = await fetchBenefitRequestContractHtml(getAdminClient(), requestId);
      const popup = window.open("", "_blank", "noopener,noreferrer");
      if (popup) {
        popup.document.open();
        popup.document.write(html);
        popup.document.close();
      }
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  const displayRequests = requests.filter(
    (req) => !statusFilter || (req.status || 'PENDING').toUpperCase() === statusFilter
  );

  return (
    <>
      {loading ? (
        <AdminDashboardSkeleton />
      ) : (
        <>
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-2 sm:mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
          Overview of your HR benefits management system
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-2 lg:col-span-1">
          {statCards.map((card) => (
            <article
              key={card.title}
              className="min-w-0 h-[128px] rounded-xl border border-slate-200 bg-white p-3 text-left dark:border-[#2C4264] dark:bg-[#1E293B]"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-base ${card.toneClass}`}
                  >
                    {card.icon}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        card.key === 'employees' ? '/admin/employee-eligibility' : '/admin/add-benefit'
                      )
                    }
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

        <section className="self-start rounded-xl border border-[#2C4264] bg-[#1E293B] p-5 lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-11 font-semibold text-slate-900 dark:text-white">
              Employee Eligibility Overview
            </h2>
          </div>
      

        {loading ? (
          <p className="py-8 text-center text-slate-600 dark:text-[#A7B6D3]">Loading requests...</p>
        ) : (
          <div>
            {displayRequests.length === 0 ? (
              <p className="py-8 text-center text-slate-600 dark:text-[#A7B6D3]">
                No benefit requests found.
              </p>
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
                        const status = (req.status || 'PENDING').toUpperCase();
                        const isLoading = actionLoadingId === req.id;
                        const needsSignature = req.requiresContract && !req.contractAcceptedAt;
                        return (
                      <tr
                        key={req.id}
                        className="border-b border-slate-200 last:border-b-0 dark:border-[#2B405F]"
                      >
                        <td className="px-3 py-3 font-medium text-slate-900 dark:text-white sm:px-4 sm:py-4">
                          {req.benefitName ?? req.benefitId}
                        </td>
                        <td className="px-3 py-3 text-slate-600 dark:text-[#A7B6D3] sm:px-4 sm:py-4">
                          {req.employeeName ?? req.employeeId}
                        </td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4">{statusBadge(status)}</td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4">
                          {req.requiresContract ? (
                            <div className="flex flex-col gap-1">
                              <span className={`text-xs font-medium ${needsSignature ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {needsSignature ? 'Not signed' : 'Signed'}
                              </span>
                              {req.contractTemplateUrl ? (
                                <button
                                  type="button"
                                  onClick={() => handleViewTemplate(req.id)}
                                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-300"
                                >
                                  View template
                                </button>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 text-xs">N/A</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-slate-500 dark:text-[#8FA3C5] sm:px-4 sm:py-4">
                          {formatDate(req.createdAt)}
                        </td>
                        <td className="px-3 py-3 sm:px-4 sm:py-4">
                          {status === 'PENDING' ? (
                            <div className="flex flex-wrap items-center gap-2 sm:gap-6">
                              <button
                                type="button"
                                onClick={() => handleApprove(req.id)}
                                disabled={isLoading || needsSignature}
                                className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed sm:rounded-xl sm:px-4 sm:py-2 dark:bg-[#00C95F] dark:hover:bg-[#00B355]"
                              >
                                {needsSignature ? 'Await sign' : isLoading ? '...' : 'Approve'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingId(req.id);
                                  setRejectComment('');
                                }}
                                disabled={isLoading}
                                className="rounded-lg bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed sm:rounded-xl sm:px-4 sm:py-2"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>)}
        </section>
      </section>

					<div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
						{statCards.map((card) => (
							<article
								key={card.title}
								className="min-w-0 flex items-start justify-between rounded-2xl sm:rounded-3xl border border-slate-200 bg-white px-4 py-5 sm:px-8 sm:py-7 dark:border-[#2C4264] dark:bg-[#1E293B]"
							>
								<div>
									<p className="text-5 text-slate-600 dark:text-[#A7B6D3]">
										{card.title}
									</p>
									<p className="mt-2 text-15 leading-none text-slate-900 dark:text-white">
										{card.value}
									</p>
								</div>
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}
								>
									{card.icon}
								</div>
							</article>
						))}
					</div>

					<article className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 dark:border-[#2C4264] dark:bg-[#1E293B]">
						<div className="mb-4 sm:mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
							<h2 className="text-11 font-semibold text-slate-900 dark:text-white">
								Employee Benefit Requests
							</h2>
							<div className="flex flex-wrap gap-2">
								{(
									[
										{ value: "PENDING" as const, label: "Pending" },
										{ value: "APPROVED" as const, label: "Approved" },
										{ value: "REJECTED" as const, label: "Rejected" },
										{ value: undefined, label: "All" },
									] as const
								).map(({ value, label }) => (
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

						{error && (
							<div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-2 text-red-200">
								{error}
							</div>
						)}

						{loading ? (
							<p className="py-8 text-center text-slate-600 dark:text-[#A7B6D3]">
								Loading requests...
							</p>
						) : (
							<>
								{requests.length === 0 ? (
									<p className="py-8 text-center text-slate-600 dark:text-[#A7B6D3]">
										No benefit requests found.
									</p>
								) : (
									<div className="overflow-x-auto">
										<table className="min-w-full text-left text-5">
											<thead className="border-b border-slate-200 text-slate-600 dark:border-[#2B405F] dark:text-[#A7B6D3]">
												<tr>
													<th className="px-3 py-3 font-medium sm:px-4 sm:py-4">
														Request (Benefit)
													</th>
													<th className="px-3 py-3 font-medium sm:px-4 sm:py-4">
														Employee
													</th>
													<th className="px-3 py-3 font-medium sm:px-4 sm:py-4">
														Status
													</th>
													<th className="px-3 py-3 font-medium sm:px-4 sm:py-4">
														Date
													</th>
													<th className="px-3 py-3 font-medium sm:px-4 sm:py-4">
														Action
													</th>
												</tr>
											</thead>
											<tbody>
												{requests.map((req) => {
													const status = (
														req.status || "PENDING"
													).toUpperCase();
													const isLoading = actionLoadingId === req.id;
													return (
														<tr
															key={req.id}
															className="border-b border-slate-200 last:border-b-0 dark:border-[#2B405F]"
														>
															<td className="px-3 py-3 font-medium text-slate-900 dark:text-white sm:px-4 sm:py-4">
																{req.benefitName ?? req.benefitId}
															</td>
															<td className="px-3 py-3 text-slate-600 dark:text-[#A7B6D3] sm:px-4 sm:py-4">
																{req.employeeName ?? req.employeeId}
															</td>
															<td className="px-3 py-3 sm:px-4 sm:py-4">
																{statusBadge(status)}
															</td>
															<td className="px-3 py-3 text-slate-500 dark:text-[#8FA3C5] sm:px-4 sm:py-4">
																{formatDate(req.createdAt)}
															</td>
															<td className="px-3 py-3 sm:px-4 sm:py-4">
																{status === "PENDING" ? (
																	<div className="flex flex-wrap items-center gap-2 sm:gap-6">
																		<button
																			type="button"
																			onClick={() => handleApprove(req.id)}
																			disabled={isLoading}
																			className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed sm:rounded-xl sm:px-4 sm:py-2 dark:bg-[#00C95F] dark:hover:bg-[#00B355]"
																		>
																			{isLoading ? "..." : "Approve"}
																		</button>
																		<button
																			type="button"
																			onClick={() => {
																				setRejectingId(req.id);
																				setRejectComment("");
																			}}
																			disabled={isLoading}
																			className="rounded-lg bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed sm:rounded-xl sm:px-4 sm:py-2"
																		>
																			Reject
																		</button>
																	</div>
																) : (
																	<span className="text-slate-400 dark:text-slate-500">
																		—
																	</span>
																)}
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								)}
							</>
						)}
					</article>

					{rejectingId !== null && (
						<div className="fixed inset-0 z-50 grid place-items-center bg-black/20 backdrop-blur-sm dark:bg-black/45 p-4">
							<div className="w-full max-w-[560px] rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-[#2C4264] dark:bg-[#1E293B]">
								<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
									Reject Request
								</h3>
								<p className="mt-2 text-sm text-slate-600 dark:text-[#A7B6D3]">
									Please provide a reason for rejecting this benefit request.
								</p>
								<textarea
									value={rejectComment}
									onChange={(e) => setRejectComment(e.target.value)}
									placeholder="Enter rejection reason..."
									rows={4}
									className="mt-4 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-[#2C4264] dark:bg-[#0F172A] dark:text-white dark:placeholder-[#64748B] dark:focus:border-[#2A8BFF] dark:focus:ring-[#2A8BFF]"
								/>
								<div className="mt-6 flex justify-end gap-3">
									<button
										type="button"
										onClick={() => {
											setRejectingId(null);
											setRejectComment("");
										}}
										className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-[#2C4264] dark:text-[#A7B6D3] dark:hover:bg-[#24364F]"
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={() => handleReject(rejectingId, rejectComment)}
										disabled={
											!rejectComment.trim() || actionLoadingId === rejectingId
										}
										className="rounded-xl bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
									>
										{actionLoadingId === rejectingId ? "..." : "Confirm Reject"}
									</button>
								</div>
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}
