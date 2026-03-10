'use client';
import { ApproveIcon } from '@/app/icons/approve';
import { DocumentIcon } from '@/app/icons/document';
import { PendingIcon } from '@/app/icons/pending';
import { RejectedIcon } from '@/app/icons/rejected';
import { useState } from 'react';
type TabFilter = 'all' | 'pending' | 'approved';
type RequestStatus = 'approved' | 'pending' | 'rejected';
type BenefitRequest = {
  id: string;
  title: string;
  requestedDate: string;
  status: RequestStatus;
  message: string;
  reviewedDate?: string;
};

const MOCK_REQUESTS: BenefitRequest[] = [
  {
    id: '1',
    title: 'Transit Pass',
    requestedDate: '2026-03-05',
    status: 'approved',
    message: 'Request approved. Benefit active from March 10, 2026.',
    reviewedDate: '2026-03-07',
  },
  {
    id: '2',
    title: 'Health Insurance',
    requestedDate: '2026-03-09',
    status: 'pending',
    message: 'Under review by HR department',
  },
  {
    id: '3',
    title: 'Gym Membership',
    requestedDate: '2026-02-28',
    status: 'rejected',
    message: 'Not eligible - OKR score requirement not met (68% vs required 75%)',
    reviewedDate: '2026-03-01',
  },
];

const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const config = {
    approved: {
      className: 'bg-[#F0FDF4] text-[#008236] border-[#B9F8CF] border font-medium',
      icon: (
        <ApproveIcon />
      ),
      label: 'Approved',
    },
    pending: {
      className: 'bg-[#f0fdf4] text-[#CA3500] border-[#FFD6A8] border font-medium',
      icon: (
        <PendingIcon />
      ),
      label: 'Pending',
    },
    rejected: {
      className: 'bg-[#FEF2F2] text-[#C10007] border-[#FFC9C9] border font-medium',
      icon: (
        <RejectedIcon />
      ),
      label: 'Rejected',
    },
  };

  const { className, icon, label } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${className}`}>
      {icon}
      {label}
    </span>
  );
};

export const NewRequest = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const filteredRequests = MOCK_REQUESTS.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'approved') return r.status === 'approved';
    return true;
  });

  const counts = {
    all: MOCK_REQUESTS.length,
    pending: MOCK_REQUESTS.filter((r) => r.status === 'pending').length,
    approved: MOCK_REQUESTS.filter((r) => r.status === 'approved').length,
  };

  return (
    <div className="flex flex-col min-h-full w-full bg-[#0f172a] text-slate-200 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-[16px] font-normal text-[#A2A2A2]">
          Request new benefits or view your request history
        </h1>
        <button className="self-start sm:self-center bg-[#3B82F6] hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-full transition-colors flex items-center gap-2 text-[14px] ">
          <span className="text-lg leading-none">+</span>
          New Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-700/60">
        {[
          { key: 'all' as TabFilter, label: `All Requests (${counts.all})` },
          { key: 'pending' as TabFilter, label: `Pending (${counts.pending})` },
          { key: 'approved' as TabFilter, label: `Approved (${counts.approved})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === key
                ? 'text-white border-white bg-slate-800/50'
                : 'text-slate-400 border-transparent hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Request cards */}
      <div className="flex flex-col gap-4 mb-8">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="rounded-xl bg-slate-800/80 border border-slate-700/50 p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center sm:block">
              <h2 className="text-[18px] font-medium  text-white flex items-center gap-2">{req.title}</h2>
              <div className="sm:hidden">
              <StatusBadge status={req.status} />
              </div>
              </div >
              <p className="text-[16px] text-[#94A3B8] font-normal mt-1">Requested on {req.requestedDate}</p>
              <p className="text-slate-300 mt-2 font-normal text-[14px]">{req.message}</p>
              {req.reviewedDate && (
                <p className="text-sm text-slate-500 italic mt-2">
                  {req.status === 'approved' ? 'Approved' : 'Reviewed'} on {req.reviewedDate}
                </p>
              )}
            </div>
            <div className="shrink-0  hidden sm:block">
              <StatusBadge status={req.status} />
            </div>
          </div>
        ))}
      </div>

      {/* Request Process info */}
      <div className="rounded-xl bg-[#EFF6FF] border border-slate-700/50 p-5">
        <div className="flex items-center gap-2 mb-3">
         <DocumentIcon />
          <h3 className="font-medium text-[#1C398E]">Request Process</h3>
        </div>
        <p className="text-[#1447E6] text-sm leading-relaxed">
          All benefit requests are reviewed based on your automatic eligibility status. You can only
          request benefits you&apos;re currently eligible for. Requests are typically processed
          within 3-5 business days.
        </p>
      </div>
    </div>
  );
};
