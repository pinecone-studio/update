/** @format */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCachedCount } from "@/app/_lib/useCachedCount";
import { AdminDashboardSkeleton } from "./components/AdminDashboardSkeleton";
import { DashboardStatCard } from "./components/DashboardStatCard";
import { BenefitRequestsSection } from "./components/BenefitRequestsSection";
import { useOnUserSwitch } from "@/app/_lib/useOnUserSwitch";
import {
  getAdminClient,
  confirmBenefitRequest,
  getApiErrorMessage,
} from "./_lib/api";
import {
  fetchBenefitRequests,
  fetchDashboardStats,
} from "./_lib/dashboard-queries";
import type { BenefitRequest } from "./_lib/dashboard-types";

export default function HrDashboardPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<BenefitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeBenefits, setActiveBenefits] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    "PENDING",
  );
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [employeesForSearch, setEmployeesForSearch] = useState<
    Array<{ id: string; name: string; department: string }>
  >([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cachedRequestCount, setCachedRequestCount] = useCachedCount(
    "admin-request-count",
    { defaultCount: 3 }
  );

  useOnUserSwitch(() => setRefreshKey((k) => k + 1));

  useEffect(() => {
    let cancelled = false;
    const client = getAdminClient();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchBenefitRequests(client, statusFilter);
        if (!cancelled) {
          setRequests(data);
          setCachedRequestCount(data.length);
        }
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
  }, [statusFilter, refreshKey]);

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
  }, [refreshKey]);

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
          !statusFilter ||
          (req.status || "PENDING").toUpperCase() === statusFilter,
      ),
    [requests, statusFilter],
  );

  const handleApprove = useCallback(async (requestId: string) => {
    setActionLoadingId(requestId);
    try {
      await confirmBenefitRequest(getAdminClient(), requestId, true);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "APPROVED" } : r,
        ),
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
          r.id === requestId ? { ...r, status: "REJECTED" } : r,
        ),
      );
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setActionLoadingId(null);
    }
  }, []);

  if (loading) return <AdminDashboardSkeleton requestRowCount={cachedRequestCount} />;

  return (
    <div className="flex min-h-min flex-1 flex-col gap-4 sm:gap-6 lg:gap-8">
      <section className="grid min-h-min flex-1 grid-cols-1 grid-rows-[auto_1fr] gap-4 sm:gap-6 lg:h-[672px] lg:grid-cols-[auto_1fr] lg:grid-rows-1 lg:items-stretch lg:gap-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:flex lg:flex-col lg:min-w-[280px] lg:gap-8 xl:min-w-[454px]">
          <DashboardStatCard
            keyType="employees"
            title="Total-Employees"
            value={String(totalEmployees)}
            onClick={() => router.push("/admin/employee-eligibility")}
            icon={
              <div className="h-[60px] w-[60px] rounded-[12px] bg-[rgba(10,18,45,0.22)] p-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                <div className="h-full w-full overflow-hidden rounded-[10px] bg-white">
                  <img
                    src="/Total-employee.png"
                    alt="Total employees"
                    className="h-full w-full object-contain p-0"
                  />
                </div>
              </div>
            }
          />
          <DashboardStatCard
            keyType="benefits"
            title="All-Benefits"
            value={String(activeBenefits)}
            onClick={() => router.push("/admin/add-benefit")}
            icon={
              <div className="h-[60px] w-[60px] rounded-[12px] bg-[rgba(10,18,45,0.22)] p-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                <div className="h-full w-full overflow-hidden rounded-[10px] bg-white">
                  <img
                    src="/All-benefit.png"
                    alt="All benefits"
                    className="h-full w-full object-contain p-0"
                  />
                </div>
              </div>
            }
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
