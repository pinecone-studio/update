"use client";

import { useMemo, useState } from "react";

const statCards = [
  {
    key: "pending",
    value: "14",
    title: "Pending Requests",
    note: "Requires attention",
    tone: "yellow" as const,
    icon: "!",
  },
  {
    key: "approved",
    value: "28",
    title: "Approved This Month",
    note: "+12% vs last month",
    tone: "green" as const,
    icon: "check",
  },
  {
    key: "allocated",
    value: "$42,500",
    title: "Total Budget Allocated",
    note: "Year to date",
    tone: "blue" as const,
    icon: "wallet",
  },
  {
    key: "remaining",
    value: "$18,200",
    title: "Remaining Budget",
    note: "42.8% remaining",
    tone: "purple" as const,
    icon: "trend",
  },
];

const requests = [
  {
    id: 1,
    initials: "JC",
    employee: "John Carter",
    benefitType: "Down Payment Assistance",
    amount: "$12,000",
    department: "Engineering",
    date: "May 14",
    status: "Pending",
  },
  {
    id: 2,
    initials: "SK",
    employee: "Sarah Kim",
    benefitType: "OKR Performance Bonus",
    amount: "$2,500",
    department: "Product",
    date: "May 12",
    status: "Pending",
  },
  {
    id: 3,
    initials: "DL",
    employee: "David Lee",
    benefitType: "Travel Subsidy",
    amount: "$1,200",
    department: "Marketing",
    date: "May 10",
    status: "Pending",
  },
];

export default function FinancePage() {
  const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);
  const selectedCard = useMemo(
    () => statCards.find((card) => card.key === selectedCardKey) ?? null,
    [selectedCardKey],
  );

  const toneClass = (tone: "yellow" | "green" | "blue" | "purple") => {
    if (tone === "yellow") {
      return "border-[#816A1A] bg-[#2A280F] text-[#F5C923]";
    }
    if (tone === "green") {
      return "border-[#0E6B4F] bg-[#0F2A25] text-[#00E08B]";
    }
    if (tone === "blue") {
      return "border-[#1B4F95] bg-[#122545] text-[#4EA2FF]";
    }
    return "border-[#593089] bg-[#231A42] text-[#B878FF]";
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">
          Finance Manager Panel
        </h1>
        <p className="mt-2 text-5 text-slate-400">
          Review and approve employee benefits with financial impact
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => setSelectedCardKey(card.key)}
            className="rounded-2xl border border-[#1F345C] bg-[radial-gradient(circle_at_50%_35%,#10234D_0%,#0A1733_60%,#08132B_100%)] p-5 text-left shadow-[inset_0_0_40px_rgba(46,94,204,0.12)] transition hover:border-[#385E9B]"
          >
            <div className="mb-6 flex items-start justify-between">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-semibold ${toneClass(
                  card.tone,
                )}`}
              >
                {card.icon === "check"
                  ? "✓"
                  : card.icon === "wallet"
                    ? "◫"
                    : card.icon === "trend"
                      ? "↗"
                      : "!"}
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#13264B] text-2xl text-[#4C84D8]">
                ›
              </span>
            </div>
            <p className="text-5 font-bold text-white">{card.value}</p>
            <p className="mt-2 text-5 text-slate-300">{card.title}</p>
            <div className="mt-4 h-px bg-[#1F355C]" />
            <p
              className={`mt-4 text-5 ${card.tone === "green" ? "text-[#00D782]" : "text-slate-400"}`}
            >
              {card.note}
            </p>
          </button>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1733]">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <h2 className="text-5 font-semibold text-white">
              Financial Benefit Requests
            </h2>
            <p className="mt-1 text-5 text-slate-400">
              Review and process pending requests
            </p>
          </div>
          <p className="text-5 text-slate-400">
            Showing {requests.length} requests
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-800 uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-4">№</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Benefit Type</th>
                <th className="px-4 py-4 whitespace-nowrap">
                  Requested Amount
                </th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-slate-900/70">
                  <td className="px-6 py-5 text-5 font-semibold text-white">
                    {request.id}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#5B6DFF] to-[#7A2CFF] text-5 font-semibold text-white">
                        {request.initials}
                      </div>
                      <span className="whitespace-nowrap text-5 text-white">
                        {request.employee}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-5 text-slate-200">
                    {request.benefitType}
                  </td>
                  <td className="px-4 py-5 whitespace-nowrap text-5 font-semibold text-white">
                    {request.amount}
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-[#1A2747] px-3 py-1 text-5 text-slate-200">
                      {request.department}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-5 text-slate-300">
                    {request.date}
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-full border border-[#8B7422] bg-[#3D3210] px-4 py-1 text-5 text-[#F3C933]">
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <button className="rounded-xl bg-green-500 px-4 py-2 text-5 font-medium text-white hover:bg-green-400">
                        Approve
                      </button>
                      <button className="rounded-xl bg-red-500 px-4 py-2 text-5 font-medium text-white hover:bg-red-400">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedCard && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[560px] rounded-2xl border border-[#27467A] bg-[#0B1733] p-8 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-5 text-slate-300">{selectedCard.title}</p>
                <p className="mt-3 text-5 font-bold text-white">
                  {selectedCard.value}
                </p>
                <p className="mt-3 text-5 text-slate-400">
                  {selectedCard.note}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCardKey(null)}
                className="rounded-lg border border-[#315188] px-3 py-1 text-5 text-slate-200 hover:bg-[#102244]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
