'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import { HrTotalEmployeeIcon } from "../icons/hrTotalEmployee";
import { HrActiveBenefitsIcon } from "../icons/hrActiveBenefits";
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

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = new GraphQLClient(`${API_URL}/graphql`, {
        headers: {
          'x-employee-id': 'admin',
          'x-role': 'admin',
        },
      });
      const res = await client.request<{ benefitRequests: BenefitRequest[] }>(
        BENEFIT_REQUESTS_QUERY,
        { status: statusFilter }
      );
      setRequests(res.benefitRequests ?? []);
    } catch (e) {
      setError(getErrorMessage(e));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-3 text-5 text-[#A7B6D3]">
          Overview of your HR benefits management system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {statCards.map((card) => (
          <article
            key={card.title}
            className="flex items-start justify-between rounded-3xl border border-[#2C4264] bg-[#1E293B] px-8 py-7"
          >
            <div>
              <p className="text-5 text-[#A7B6D3]">{card.title}</p>
              <p className="mt-2 text-15 leading-none text-white">
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

      <article className="mt-8 rounded-3xl border border-[#2C4264] bg-[#1E293B] p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-11 font-semibold text-white">
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
                    ? 'bg-[#2A8BFF] text-white'
                    : 'border border-[#2C4264] text-[#A7B6D3] hover:bg-[#24364F]'
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
          <p className="py-8 text-center text-[#A7B6D3]">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="py-8 text-center text-[#A7B6D3]">
            No benefit requests found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-5">
              <thead className="border-b border-[#2B405F] text-[#A7B6D3]">
                <tr>
                  <th className="px-4 py-4 font-medium">Request (Benefit)</th>
                  <th className="px-4 py-4 font-medium">Employee</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-[#2B405F] last:border-b-0"
                  >
                    <td className="px-4 py-4 font-medium text-white">
                      {req.benefitName ?? req.benefitId}
                    </td>
                    <td className="px-4 py-4 text-[#A7B6D3]">
                      {req.employeeName ?? req.employeeId}
                    </td>
                    <td className="px-4 py-4">{statusBadge(req.status)}</td>
                    <td className="px-4 py-4 text-[#8FA3C5]">
                      {formatDate(req.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </>
  );
}
