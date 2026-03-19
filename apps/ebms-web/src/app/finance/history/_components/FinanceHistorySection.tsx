/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useOnUserSwitch } from "@/app/_lib/useOnUserSwitch";
import { getFinanceClient, fetchBenefitRequests, fetchBenefits } from "../../_lib/api";
import type { BenefitRequest } from "../../_lib/api";
import { FinanceHistoryFilters } from "./FinanceHistoryFilters";
import { FinanceHistoryTable } from "./FinanceHistoryTable";
import { Skeleton } from "@/app/_components/Skeleton";

export function FinanceHistorySection() {
  const [requests, setRequests] = useState<BenefitRequest[]>([]);
  const [benefitNames, setBenefitNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [requestIdFilter, setRequestIdFilter] = useState("");
  const [benefitFilter, setBenefitFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | BenefitRequest["status"]
  >("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useOnUserSwitch(() => setRefreshKey((k) => k + 1));

  useEffect(() => {
    let cancelled = false;
    const client = getFinanceClient();
    Promise.all([fetchBenefitRequests(client), fetchBenefits(client)])
      .then(([reqs, benefits]) => {
        if (cancelled) return;
        const approvedOrRejected = reqs.filter(
          (r) => r.status === "APPROVED" || r.status === "REJECTED",
        );
        setRequests(approvedOrRejected);
        const names: Record<string, string> = {};
        benefits.forEach((b) => {
          names[b.id] = b.name;
        });
        reqs.forEach((r) => {
          if (r.benefitName) names[r.benefitId] = r.benefitName;
        });
        setBenefitNames(names);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const getBenefitName = (benefitId: string) =>
    benefitNames[benefitId] ?? benefitId;

  const benefitOptions = useMemo(
    () =>
      Array.from(new Set(requests.map((r) => getBenefitName(r.benefitId)))).sort(),
    [requests, benefitNames],
  );

  const filteredEntries = useMemo(() => {
    return requests
      .filter((entry) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const normalizedRequestId = requestIdFilter.trim().toLowerCase();
        const benefitName = getBenefitName(entry.benefitId);

        if (
          normalizedSearch &&
          !(
            (entry.employeeName ?? "").toLowerCase().includes(normalizedSearch) ||
            entry.employeeId.toLowerCase().includes(normalizedSearch) ||
            benefitName.toLowerCase().includes(normalizedSearch) ||
            entry.status.toLowerCase().includes(normalizedSearch) ||
            entry.id.toLowerCase().includes(normalizedSearch) ||
            (entry.rejectReason ?? "")
              .toLowerCase()
              .includes(normalizedSearch) ||
            (entry.reviewedByName ?? "")
              .toLowerCase()
              .includes(normalizedSearch)
          )
        ) {
          return false;
        }

        if (benefitFilter !== "ALL" && benefitName !== benefitFilter)
          return false;
        if (
          normalizedRequestId &&
          !entry.id.toLowerCase().includes(normalizedRequestId)
        )
          return false;
        if (statusFilter !== "ALL" && entry.status !== statusFilter)
          return false;

        if (!dateFrom && !dateTo) return true;
        const entryDate = new Date(entry.createdAt);
        if (Number.isNaN(entryDate.getTime())) return false;

        if (dateFrom) {
          const from = new Date(`${dateFrom}T00:00:00`);
          if (entryDate < from) return false;
        }
        if (dateTo) {
          const to = new Date(`${dateTo}T23:59:59`);
          if (entryDate > to) return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [
    requests,
    searchTerm,
    requestIdFilter,
    benefitFilter,
    statusFilter,
    dateFrom,
    dateTo,
    benefitNames,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setRequestIdFilter("");
    setBenefitFilter("ALL");
    setStatusFilter("ALL");
    setDateFrom("");
    setDateTo("");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl p-6 dark:bg-[#20194D80]/50">
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </section>
        <section className="overflow-hidden rounded-3xl dark:bg-[#20194D80]/50 p-2">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-5">
              <thead className="border-b border-white/5 dark:text-[#A7B6D3]">
                <tr>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <th key={i} className="px-4 py-4 sm:px-6">
                      <Skeleton className="h-4 w-16 rounded" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 last:border-b-0"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (
                      <td key={j} className="px-4 py-5 sm:px-6">
                        <Skeleton className="h-4 w-20 rounded" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FinanceHistoryFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        requestIdFilter={requestIdFilter}
        onRequestIdFilterChange={setRequestIdFilter}
        benefitFilter={benefitFilter}
        onBenefitFilterChange={setBenefitFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        benefitOptions={benefitOptions}
        onClearAll={clearFilters}
      />

      <FinanceHistoryTable entries={filteredEntries} onError={setError} />
    </div>
  );
}
