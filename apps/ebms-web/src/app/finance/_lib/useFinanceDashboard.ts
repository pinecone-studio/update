import { useCallback, useEffect, useMemo, useState } from "react";
import { useOnUserSwitch } from "@/app/_lib/useOnUserSwitch";
import { useCachedCount } from "@/app/_lib/useCachedCount";
import {
  fetchBenefitRequests,
  fetchBenefits,
  fetchEmployees,
  getApiErrorMessage,
  getFinanceClient,
  type BenefitRequest,
  type EmployeeLite,
} from "./api";
import type { StatCard } from "./dashboard-types";

export function useFinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<BenefitRequest[]>([]);
  const [employees, setEmployees] = useState<Record<string, EmployeeLite>>({});
  const [benefitSubsidyMap, setBenefitSubsidyMap] = useState<
    Record<string, number>
  >({});
  const [cachedRequestCount, setCachedRequestCount] = useCachedCount(
    "finance-request-count",
    { defaultCount: 3 }
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = getFinanceClient();
      const [reqList, employeeList, benefits] = await Promise.all([
        fetchBenefitRequests(client),
        fetchEmployees(client),
        fetchBenefits(client),
      ]);
      setRequests(reqList);
      setCachedRequestCount(reqList.length);
      setEmployees(Object.fromEntries(employeeList.map((e) => [e.id, e])));
      setBenefitSubsidyMap(
        Object.fromEntries(
          benefits.map((b) => [b.id, Number(b.subsidyPercent ?? 0)])
        )
      );
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useOnUserSwitch(loadData);

  const pendingRequests = useMemo(
    () =>
      requests.filter(
        (r) =>
          (r.status ?? "").toUpperCase() === "PENDING" ||
          (r.status ?? "").toUpperCase() === "ADMIN_APPROVED"
      ),
    [requests]
  );

  const approvedThisMonth = useMemo(() => {
    const now = new Date();
    return requests.filter((r) => {
      if (r.status !== "APPROVED") return false;
      const d = new Date(r.createdAt);
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    }).length;
  }, [requests]);

  const rejectedRequests = useMemo(
    () =>
      requests.filter((r) => (r.status ?? "").toUpperCase() === "REJECTED")
        .length,
    [requests]
  );

  const totalAllocated = useMemo(
    () =>
      requests
        .filter((r) => r.status === "APPROVED")
        .reduce((sum, r) => sum + (benefitSubsidyMap[r.benefitId] ?? 0), 0),
    [requests, benefitSubsidyMap]
  );

  const totalBudgetInMillions = 50;
  const allocatedBudgetInMillions = Number(
    ((totalAllocated / 100) * totalBudgetInMillions).toFixed(1)
  );

  const statCards: StatCard[] = useMemo(
    () => [
      {
        key: "pending",
        value: String(pendingRequests.length),
        title: "Pending Requests",
        note:
          pendingRequests.length === 0
            ? "All requests are processed"
            : "Requires attention",
        tone: "yellow",
        icon: "!",
      },
      {
        key: "approved",
        value: String(approvedThisMonth),
        title: "Approved This Month",
        note: "Based on current month data",
        tone: "green",
        icon: "check",
      },
      {
        key: "rejected",
        value: String(rejectedRequests),
        title: "Rejected Requests",
        note:
          rejectedRequests === 0 ? "No rejected requests" : "Needs attention",
        tone: "purple",
        icon: "!",
      },
      {
        key: "budget",
        value: `₮${allocatedBudgetInMillions}M / ₮${totalBudgetInMillions}M`,
        title: "Budget",
        note: `${totalAllocated}% this month`,
        tone: "blue",
        icon: "wallet",
      },
    ],
    [
      pendingRequests.length,
      approvedThisMonth,
      rejectedRequests,
      totalAllocated,
      allocatedBudgetInMillions,
      totalBudgetInMillions,
    ]
  );

  const setErrorState = useCallback((msg: string | null) => {
    setError(msg);
  }, []);

  return {
    loading,
    error,
    requests,
    cachedRequestCount,
    employees,
    benefitSubsidyMap,
    statCards,
    loadData,
    setError: setErrorState,
  };
}
