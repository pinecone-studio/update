import { useCallback, useEffect, useMemo, useState } from "react";
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

  const totalAllocated = useMemo(
    () =>
      requests
        .filter((r) => r.status === "APPROVED")
        .reduce((sum, r) => sum + (benefitSubsidyMap[r.benefitId] ?? 0), 0),
    [requests, benefitSubsidyMap]
  );

  const remainingBudgetEstimate = Math.max(0, 100 - totalAllocated);

  const statCards: StatCard[] = useMemo(
    () => [
      {
        key: "pending",
        value: String(pendingRequests.length),
        title: "Pending Requests",
        note: "Requires attention",
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
        key: "allocated",
        value: `${totalAllocated}%`,
        title: "Total Budget Allocated",
        note: "From approved benefit subsidies",
        tone: "blue",
        icon: "wallet",
      },
      {
        key: "remaining",
        value: `${remainingBudgetEstimate}%`,
        title: "Remaining Budget",
        note: "Estimated from configured subsidies",
        tone: "purple",
        icon: "trend",
      },
    ],
    [
      pendingRequests.length,
      approvedThisMonth,
      totalAllocated,
      remainingBudgetEstimate,
    ]
  );

  const setErrorState = useCallback((msg: string | null) => {
    setError(msg);
  }, []);

  return {
    loading,
    error,
    requests,
    employees,
    benefitSubsidyMap,
    statCards,
    loadData,
    setError: setErrorState,
  };
}
