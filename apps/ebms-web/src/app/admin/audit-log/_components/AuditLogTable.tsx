"use client";

import type { AuditEntry } from "../_lib/types";

function formatTime(raw: string) {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

type AuditLogTableProps = {
  entries: AuditEntry[];
};

export function AuditLogTable({ entries }: AuditLogTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-[#2C4264] dark:bg-[#112349]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-5">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-[#2B405F] dark:text-[#A7B6D3]">
            <tr>
              <th className="px-4 py-4 font-medium sm:px-6">№</th>
              <th className="px-4 py-4 font-medium sm:px-6">Time</th>
              <th className="px-4 py-4 font-medium sm:px-6">User</th>
              <th className="px-4 py-4 font-medium sm:px-6">Action</th>
              <th className="px-4 py-4 font-medium sm:px-6">Benefit</th>
              <th className="px-4 py-4 font-medium sm:px-6">Contract Start</th>
              <th className="px-4 py-4 font-medium sm:px-6">Contract End</th>
              <th className="px-4 py-4 font-medium sm:px-6">Result</th>
              <th className="px-4 py-4 font-medium sm:px-6">Log ID</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr
                key={entry.id}
                className="border-b border-slate-200 last:border-b-0 dark:border-[#22395A]"
              >
                <td className="px-4 py-5 font-semibold text-slate-900 dark:text-white sm:px-6">
                  {idx + 1}
                </td>
                <td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
                  {formatTime(entry.timestamp)}
                </td>
                <td className="px-4 py-5 sm:px-6">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {entry.employee}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-[#8FA3C5]">
                    {entry.employeeId}
                  </p>
                </td>
                <td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
                  {entry.action}
                </td>
                <td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
                  {entry.benefit}
                </td>
                <td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
                  {entry.contractStartDate}
                </td>
                <td className="px-4 py-5 text-slate-700 dark:text-[#C7D6EF] sm:px-6">
                  {entry.contractEndDate}
                </td>
                <td className="px-4 py-5 sm:px-6">
                  <span className="inline-flex rounded-xl border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:border-[#4B5D83] dark:bg-[#334160] dark:text-[#D4DEEF]">
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-5 text-slate-500 dark:text-[#8FA3C5] sm:px-6">
                  {entry.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {entries.length === 0 && (
        <p className="border-t border-slate-200 px-4 py-3 text-5 text-slate-500 dark:border-[#22395A] dark:text-[#A7B6D3] sm:px-6">
          Таны сонгосон хайлт/шүүлтүүрт тохирох audit log олдсонгүй.
        </p>
      )}
    </section>
  );
}
