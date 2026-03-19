/** @format */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import {
  ensureValidActiveUserProfile,
} from "@/app/_lib/activeUser";
import { useCachedCount } from "@/app/_lib/useCachedCount";
import { useOnUserSwitch } from "@/app/_lib/useOnUserSwitch";
import {
  fetchMe,
  fetchMyBenefits,
  fetchMyBenefitRequests,
  uploadSignedContractPdf,
  requestBenefit,
  openBenefitContractPreview,
  openUploadedContract,
  getApiErrorMessage,
} from "../_lib/api";
import { mapMyBenefitsToCardProps } from "../_lib/mapBenefits";
import type { ContractTask } from "../components/ContractTaskCard";
import type { EmployeeStatusFilter } from "../components/EmployeeDashboardOverview";

export function useEmployeeDashboardData() {
  const [me, setMe] = useState<{ name: string; okrSubmitted: boolean } | null>(
    null,
  );
  const [benefits, setBenefits] = useState<BenefitCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<EmployeeStatusFilter>("ALL");

  const [contractTasksByBenefitId, setContractTasksByBenefitId] = useState<
    Record<string, ContractTask>
  >({});
  const [selectedContractFileByRequestId, setSelectedContractFileByRequestId] =
    useState<Record<string, File | null>>({});
  const [uploadingContractByRequestId, setUploadingContractByRequestId] =
    useState<Record<string, boolean>>({});
  const [contractUploadErrorByRequestId, setContractUploadErrorByRequestId] =
    useState<Record<string, string>>({});

  const [cachedBenefitCount, setCachedBenefitCount] = useCachedCount(
    "employee-benefit-count",
    { defaultCount: 3 }
  );

  const load = useCallback(
    async (opts?: { silent?: boolean; retried?: boolean }) => {
      if (!opts?.silent) {
        setLoading(true);
        setError(null);
      }

      try {
        const [meRes, myBenefitsRes] = await Promise.all([fetchMe(), fetchMyBenefits()]);
        setMe({ name: meRes.name, okrSubmitted: meRes.okrSubmitted });

        const mapped = mapMyBenefitsToCardProps(myBenefitsRes);
        setCachedBenefitCount(mapped.length);
        setBenefits((prev) => {
          if (prev.length === 0) return mapped;
          return mapped.map((fresh) => {
            const existing = prev.find((p) => p.benefitId === fresh.benefitId);
            if (existing?.status === "PENDING" && fresh.status === "ELIGIBLE") {
              return existing;
            }
            return fresh;
          });
        });

        try {
          const requests = await fetchMyBenefitRequests();
          const tasks = requests
            .filter(
              (r) =>
                r.requiresContract &&
                (r.status === "PENDING" ||
                  r.status === "ADMIN_APPROVED" ||
                  r.status === "APPROVED"),
            )
            .map((r) => ({
              requestId: r.id,
              benefitId: r.benefitId,
              benefitName: r.benefitName ?? r.benefitId,
              requestStatus: (r.status === "APPROVED"
                ? "APPROVED"
                : "PENDING") as "PENDING" | "APPROVED",
              rawStatus: r.status,
              uploadedUrl: r.contractTemplateUrl ?? null,
              createdAt: r.createdAt,
            }))
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );

          const latestByBenefitId = tasks.reduce<Record<string, ContractTask>>(
            (acc, task) => {
              if (!acc[task.benefitId]) acc[task.benefitId] = task;
              return acc;
            },
            {},
          );
          setContractTasksByBenefitId(latestByBenefitId);
        } catch {
          setContractTasksByBenefitId({});
        }
      } catch (e) {
        const message = getApiErrorMessage(e);
        if (!opts?.retried && message.toLowerCase().includes("employee not found")) {
          try {
            await ensureValidActiveUserProfile();
            await load({ ...opts, retried: true });
            return;
          } catch {
            // fall through
          }
        }

        if (!opts?.silent) {
          setError(message);
          setBenefits([]);
        }
      } finally {
        if (!opts?.silent) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useOnUserSwitch(load);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void load({ silent: true });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [load]);

  const requestBenefitDirect = useCallback(
    async (benefit: BenefitCardProps) => {
      if (!benefit.benefitId) return;
      try {
        await requestBenefit(benefit.benefitId);
        setBenefits((prev) =>
          prev.map((b) =>
            b.benefitId === benefit.benefitId
              ? { ...b, status: "PENDING" as const }
              : b,
          ),
        );
        setStatusFilter("PENDING");
        await load({ silent: true });
        return true;
      } catch (e) {
        alert(getApiErrorMessage(e));
        return false;
      }
    },
    [load],
  );

  const handleViewContract = useCallback(async (benefit: BenefitCardProps) => {
    if (!benefit.benefitId) return;
    try {
      const popup = window.open("", "_blank", "noopener,noreferrer");
      await openBenefitContractPreview(benefit.benefitId, popup);
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  }, []);

  const handleViewUploadedContract = useCallback(
    async (requestId: string) => {
      try {
        await openUploadedContract(requestId);
      } catch (e) {
        alert(getApiErrorMessage(e));
      }
    },
    [],
  );

  const handleUploadSignedContract = useCallback(
    async (requestId: string) => {
      const selected = selectedContractFileByRequestId[requestId];
      if (!selected) {
        setContractUploadErrorByRequestId((prev) => ({
          ...prev,
          [requestId]: "PDF файл сонгоно уу.",
        }));
        return;
      }
      if (selected.type && selected.type !== "application/pdf") {
        setContractUploadErrorByRequestId((prev) => ({
          ...prev,
          [requestId]: "Зөвхөн PDF файл upload хийнэ.",
        }));
        return;
      }

      setContractUploadErrorByRequestId((prev) => ({ ...prev, [requestId]: "" }));
      setUploadingContractByRequestId((prev) => ({ ...prev, [requestId]: true }));
      try {
        await uploadSignedContractPdf(requestId, selected);
        await load({ silent: true });
      } catch (e) {
        setContractUploadErrorByRequestId((prev) => ({
          ...prev,
          [requestId]: getApiErrorMessage(e),
        }));
      } finally {
        setUploadingContractByRequestId((prev) => ({ ...prev, [requestId]: false }));
      }
    },
    [load, selectedContractFileByRequestId],
  );

  const counts = {
    active: benefits.filter((b) => b.status === "ACTIVE").length,
    eligible: benefits.filter((b) => b.status === "ELIGIBLE").length,
    pending: benefits.filter((b) => b.status === "PENDING").length,
    locked: benefits.filter((b) => b.status === "LOCKED").length,
  };

  const filteredBenefits =
    statusFilter === "ALL"
      ? benefits
      : benefits.filter((b) => b.status === statusFilter);

  const orderedBenefits = useMemo(() => {
    const statusOrder: Record<BenefitCardProps["status"], number> = {
      ACTIVE: 0,
      ELIGIBLE: 1,
      PENDING: 2,
      LOCKED: 3,
      REJECTED: 4,
    };
    return [...filteredBenefits].sort((a, b) => {
      const byStatus = statusOrder[a.status] - statusOrder[b.status];
      if (byStatus !== 0) return byStatus;
      return (a.category ?? "").localeCompare(b.category ?? "");
    });
  }, [filteredBenefits]);

  return {
    me,
    loading,
    error,
    benefits,
    cachedBenefitCount,
    statusFilter,
    setStatusFilter,
    counts,
    filteredBenefits,
    orderedBenefits,
    contractTasksByBenefitId,
    selectedContractFileByRequestId,
    uploadingContractByRequestId,
    contractUploadErrorByRequestId,
    setSelectedContractFileByRequestId,
    requestBenefitDirect,
    handleViewContract,
    handleViewUploadedContract,
    handleUploadSignedContract,
  };
}
