"use client";

import type { Contract } from "../types";

type EmployeeOption = { id: string; name: string | null };

type ContractTableSectionProps = {
  contracts: Contract[];
  search: string;
  onSearchChange: (v: string) => void;
  filterByEmployeeId: string;
  onFilterByEmployeeChange: (v: string) => void;
  employeeOptions: EmployeeOption[];
  onAddContract: () => void;
};

export function ContractTableSection({
  contracts,
  search,
  onSearchChange,
  filterByEmployeeId,
  onFilterByEmployeeChange,
  employeeOptions,
  onAddContract,
}: ContractTableSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)] dark:border-[rgba(38,38,38,1)] dark:bg-[rgba(13,94,85,0.1)] dark:shadow-none">
      <div className="flex flex-col gap-12">
        <div className="flex items-center justify-between">
          <h2 className="text-[26px] font-semibold text-slate-900 dark:text-[var(--text-primary)]">
            Contracts
          </h2>
          <button
            type="button"
            onClick={onAddContract}
            className="inline-flex h-11 min-w-[170px] flex-[0_0_auto] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-blue-600 px-4 text-[18px] font-medium text-white transition hover:bg-blue-700 dark:bg-[#0057ADCC]/80 dark:hover:bg-[#3E82F7]"
          >
            + <span className="text-[18px] font-normal">Add Contract</span>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <select
            aria-label="Filter by employee"
            value={filterByEmployeeId}
            onChange={(e) => onFilterByEmployeeChange(e.target.value)}
            className="h-11 min-w-[94px] rounded-lg border border-slate-200 bg-white px-3 text-5 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-white/10 dark:text-white"
          >
            <option value="">All</option>
            {employeeOptions.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name || emp.id}
              </option>
            ))}
          </select>
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
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
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by contract name"
              className="h-11 w-[368px] rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-transparent dark:bg-[#FFFFFF]/10 dark:text-slate-200 dark:placeholder:text-slate-200 dark:focus:border-white/70"
            />
          </div>
        </div>

        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-900 dark:text-[var(--text-primary)]">
                №
              </th>
              <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-white/70">
                Contract name
              </th>
              <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-white/70">
                Contract code
              </th>
              <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-900 dark:text-[var(--text-primary)]">
                Start date
              </th>
              <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-900 dark:text-[var(--text-primary)]">
                End date
              </th>
              <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-900 dark:text-[var(--text-primary)]">
                Contract URL
              </th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, index) => (
              <tr key={contract.id}>
                <td className="px-5 py-5 text-5 text-slate-900 dark:text-[var(--text-primary)]">
                  {index + 1}
                </td>
                <td className="px-5 py-5 text-5 font-semibold text-slate-900 dark:text-[var(--text-primary)]">
                  {contract.contractNumber}
                </td>
                <td className="px-5 py-5 text-5 text-slate-900 dark:text-[var(--text-primary)]">
                  {contract.contractName}
                </td>
                <td className="px-5 py-5 text-5 text-slate-600 dark:text-white/70">
                  {contract.startDate}
                </td>
                <td className="px-5 py-5 text-5 text-slate-600 dark:text-white/70">
                  {contract.endDate}
                </td>
                <td className="px-5 py-5 text-5">
                  <a
                    href={contract.contractUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline decoration-blue-600/40 underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:decoration-blue-400/50 dark:hover:text-blue-300"
                  >
                    {contract.contractUrl}
                  </a>
                </td>
              </tr>
            ))}
            {contracts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-center text-5 text-slate-600 dark:text-white/70"
                >
                  Contract not found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
