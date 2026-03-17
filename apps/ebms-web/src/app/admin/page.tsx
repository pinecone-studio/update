/** @format */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HrTotalEmployeeIcon } from "../icons/hrTotalEmployee";
import { HrActiveBenefitsIcon } from "../icons/hrActiveBenefits";
import { AdminDashboardSkeleton } from "./components/AdminDashboardSkeleton";
import { DashboardStatCard } from "./components/DashboardStatCard";
import { BenefitRequestsSection } from "./components/BenefitRequestsSection";
import { getAdminClient, confirmBenefitRequest, getApiErrorMessage } from "./_lib/api";
import {
  fetchBenefitRequests,
  fetchDashboardStats,
} from "./_lib/dashboard-queries";
import type { BenefitRequest } from "./_lib/dashboard-types";

export default function HrDashboardPage() {
  const [requests, setRequests] = useState<BenefitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeBenefits, setActiveBenefits] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>("PENDING");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
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
        const data = await fetchBenefitRequests(client, statusFilter);
        if (!cancelled) setRequests(data);
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

    (async () => {
      try {
        const stats = await fetchDashboardStats(client);
        if (!cancelled) {
          setTotalEmployees(stats.totalEmployees);
          setActiveBenefits(stats.activeBenefits);
          setEmployeesForSearch(stats.employeesForSearch);
        }
      } catch {
        if (!cancelled) {
          setTotalEmployees(0);
          setActiveBenefits(0);
          setEmployeesForSearch([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const employeeIdToDepartment = useMemo(() => {
    const map: Record<string, string> = {};
    for (const e of employeesForSearch) {
      if (e.id && e.department) map[e.id] = e.department;
    }
    return map;
  }, [employeesForSearch]);

  const displayRequests = useMemo(
    () =>
      requests.filter(
        (req) =>
          !statusFilter || (req.status || "PENDING").toUpperCase() === statusFilter
      ),
    [requests, statusFilter]
  );

  const handleApprove = useCallback(async (requestId: string) => {
    setActionLoadingId(requestId);
    try {
      await confirmBenefitRequest(getAdminClient(), requestId, true);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "APPROVED" } : r
        )
      );
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setActionLoadingId(null);
    }
  }, []);

  const handleReject = useCallback(async (requestId: string) => {
    const reason = window.prompt("Reject reason")?.trim();
    if (!reason) return;
    setActionLoadingId(requestId);
    try {
      await confirmBenefitRequest(getAdminClient(), requestId, false, reason);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "REJECTED" } : r
        )
      );
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setActionLoadingId(null);
    }
  }, []);

  if (loading) return <AdminDashboardSkeleton />;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden">
      <section className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_1fr] gap-8 px-6 py-6 overflow-hidden lg:grid-cols-[auto_1fr] lg:grid-rows-1">
        <div className="flex flex-col gap-8 lg:min-w-[454px]">
          <DashboardStatCard
            keyType="employees"
            title="Total-Employees"
            value={String(totalEmployees)}
            icon={<HrTotalEmployeeIcon />}
          />
          <DashboardStatCard
            keyType="benefits"
            title="All-Benefits"
            value={String(activeBenefits)}
            icon={<HrActiveBenefitsIcon />}
          />
        </div>

        <BenefitRequestsSection
          requests={displayRequests}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          error={error}
          actionLoadingId={actionLoadingId}
          employeeIdToDepartment={employeeIdToDepartment}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </section>
    </div>
  );
}
