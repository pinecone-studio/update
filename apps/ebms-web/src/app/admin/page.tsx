'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { HrTotalEmployeeIcon } from "../icons/hrTotalEmployee";
import { HrActiveBenefitsIcon } from "../icons/hrActiveBenefits";
import {
  getLocalBenefitRequests,
  updateLocalBenefitRequestStatus,
  addApprovedBenefit,
  getApprovedRequestIds,
  type LocalBenefitRequest,
} from "@/app/_lib/localBenefitRequests";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

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
};

type StatCard = {
  title: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
};

const statCards: StatCard[] = [
  {
    title: "Total Employees",
    value: "1,247",
    iconBg: "bg-[#2A8BFF]",
    icon: <HrTotalEmployeeIcon />,
  },
  {
    title: "Active Benefits",
    value: "3,892",
    iconBg: "bg-[#00C95F]",
    icon: <HrActiveBenefitsIcon />,
  },
];
function getErrorMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'response' in e) {
    const res = (e as { response?: { errors?: Array<{ message?: string }> } }).response;
    const msg = res?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    PENDING: 'bg-[#FFAD0F]/20 text-[#FFAD0F] border-[#FFAD0F]/40',
    APPROVED: 'bg-[#00C95F]/20 text-[#00C95F] border-[#00C95F]/40',
    REJECTED: 'bg-red-500/20 text-red-400 border-red-500/40',
    CANCELLED: 'bg-[#64748B]/20 text-[#94A3B8] border-[#64748B]/40',
  };
  const s = styles[status] ?? 'bg-[#64748B]/20 text-[#94A3B8]';
  return (
    <span className={`inline-flex rounded-xl border px-3 py-1 text-xs font-medium ${s}`}>
      {status}
    </span>
  );
}

export default function HrDashboardPage() {
  const [requests, setRequests] = useState<BenefitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>('PENDING');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [sessionApprovedIds, setSessionApprovedIds] = useState<Set<string>>(new Set());
  const [sessionRejectedIds, setSessionRejectedIds] = useState<Set<string>>(new Set());
  const [sessionProcessedRequests, setSessionProcessedRequests] = useState<BenefitRequest[]>([]);

  useEffect(() => {
    let cancelled = false;
    const base = API_URL.replace(/\/$/, '');
    const url = base.endsWith('/graphql') ? base : `${base}/graphql`;
    const client = new GraphQLClient(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-employee-id': 'admin',
        'x-role': 'admin',
      },
    });

    async function load() {
      setLoading(true);
      setError(null);
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
          setSessionApprovedIds(getApprovedRequestIds(data));
          setSessionRejectedIds(new Set());
        }
      } catch (e) {
        if (!cancelled) {
          setError(getErrorMessage(e));
          const local = getLocalBenefitRequests().map((r) => ({
            ...r,
            status: (r.status || 'PENDING').toUpperCase(),
          }));
          const filtered = statusFilter
            ? local.filter((r) => r.status === statusFilter)
            : local;
          setRequests(filtered);
          setSessionApprovedIds(getApprovedRequestIds(filtered));
          setSessionRejectedIds(new Set());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  const handleApprove = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (req) {
      addApprovedBenefit(req.employeeId, req.benefitId);
      setSessionProcessedRequests((prev) => {
        const updated = { ...req, status: 'APPROVED' };
        return prev.filter((r) => r.id !== requestId).concat(updated);
      });
    }
    setSessionApprovedIds((prev) => new Set(prev).add(requestId));
    setSessionRejectedIds((prev) => {
      const next = new Set(prev);
      next.delete(requestId);
      return next;
    });
    if (requestId.startsWith('local-')) {
      updateLocalBenefitRequestStatus(requestId, 'APPROVED');
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'APPROVED' } : r))
    );
  };

  const handleReject = (requestId: string, _comment: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (req) {
      setSessionProcessedRequests((prev) => {
        const updated = { ...req, status: 'REJECTED' };
        return prev.filter((r) => r.id !== requestId).concat(updated);
      });
    }
    setSessionRejectedIds((prev) => new Set(prev).add(requestId));
    setSessionApprovedIds((prev) => {
      const next = new Set(prev);
      next.delete(requestId);
      return next;
    });
    if (requestId.startsWith('local-')) {
      updateLocalBenefitRequestStatus(requestId, 'REJECTED');
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'REJECTED' } : r))
    );
    setRejectingId(null);
    setRejectComment('');
  };

  const getEffectiveStatus = (req: BenefitRequest) =>
    sessionApprovedIds.has(req.id)
      ? 'APPROVED'
      : sessionRejectedIds.has(req.id)
        ? 'REJECTED'
        : (req.status || 'PENDING').toUpperCase();

  const displayRequests = (() => {
    const fromApi = requests.filter(
      (req) => !statusFilter || getEffectiveStatus(req) === statusFilter
    );
    if (statusFilter === 'APPROVED') {
      const sessionApproved = sessionProcessedRequests.filter((r) => r.status === 'APPROVED');
      const seen = new Set(fromApi.map((r) => r.id));
      const extra = sessionApproved.filter((r) => !seen.has(r.id));
      return [...fromApi, ...extra];
    }
    if (statusFilter === 'REJECTED') {
      const sessionRejected = sessionProcessedRequests.filter((r) => r.status === 'REJECTED');
      const seen = new Set(fromApi.map((r) => r.id));
      const extra = sessionRejected.filter((r) => !seen.has(r.id));
      return [...fromApi, ...extra];
    }
    if (statusFilter === undefined) {
      const seen = new Set(fromApi.map((r) => r.id));
      const extra = sessionProcessedRequests.filter((r) => !seen.has(r.id));
      return [...fromApi, ...extra];
    }
    return fromApi;
  })();

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
          Overview of your HR benefits management system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {statCards.map((card) => (
          <article
            key={card.title}
            className="flex items-start justify-between rounded-3xl border border-slate-200 bg-white px-8 py-7 dark:border-[#2C4264] dark:bg-[#1E293B]"
          >
            <div>
              <p className="text-5 text-slate-600 dark:text-[#A7B6D3]">{card.title}</p>
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

      <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 dark:border-[#2C4264] dark:bg-[#1E293B]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-11 font-semibold text-slate-900 dark:text-white">
            Employee Benefit Requests
          </h2>
          <div className="flex gap-2">
            {(
              [
                { value: 'PENDING' as const, label: 'Pending' },
                { value: 'APPROVED' as const, label: 'Approved' },
                { value: 'REJECTED' as const, label: 'Rejected' },
                { value: undefined, label: 'All' },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value ?? 'all'}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  statusFilter === value
                    ? 'bg-blue-600 text-white dark:bg-[#2A8BFF]'
                    : 'border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-[#2C4264] dark:text-[#A7B6D3] dark:hover:bg-[#24364F]'
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
          <p className="py-8 text-center text-slate-600 dark:text-[#A7B6D3]">Loading requests...</p>
        ) : (
          <>
            {displayRequests.length === 0 ? (
              <p className="py-8 text-center text-slate-600 dark:text-[#A7B6D3]">
                No benefit requests found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-5">
                  <thead className="border-b border-slate-200 text-slate-600 dark:border-[#2B405F] dark:text-[#A7B6D3]">
                    <tr>
                      <th className="px-4 py-4 font-medium">Request (Benefit)</th>
                      <th className="px-4 py-4 font-medium">Employee</th>
                      <th className="px-4 py-4 font-medium">Status</th>
                      <th className="px-4 py-4 font-medium">Date</th>
                      <th className="px-4 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRequests.map((req) => {
                        const effectiveStatus = getEffectiveStatus(req);
                        return (
                      <tr
                        key={req.id}
                        className="border-b border-slate-200 last:border-b-0 dark:border-[#2B405F]"
                      >
                        <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                          {req.benefitName ?? req.benefitId}
                        </td>
                        <td className="px-4 py-4 text-slate-600 dark:text-[#A7B6D3]">
                          {req.employeeName ?? req.employeeId}
                        </td>
                        <td className="px-4 py-4">{statusBadge(effectiveStatus)}</td>
                        <td className="px-4 py-4 text-slate-500 dark:text-[#8FA3C5]">
                          {formatDate(req.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          {effectiveStatus === 'PENDING' ? (
                            <div className="flex items-center gap-6">
                              <button
                                type="button"
                                onClick={() => handleApprove(req.id)}
                                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 dark:bg-[#00C95F] dark:hover:bg-[#00B355]"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingId(req.id);
                                  setRejectComment('');
                                }}
                                className="rounded-xl bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
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

          </>
        )}
      </article>

      {rejectingId !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
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
                  setRejectComment('');
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-[#2C4264] dark:text-[#A7B6D3] dark:hover:bg-[#24364F]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReject(rejectingId, rejectComment)}
                disabled={!rejectComment.trim()}
                className="rounded-xl bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
