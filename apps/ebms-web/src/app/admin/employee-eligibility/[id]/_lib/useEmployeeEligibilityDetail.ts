"use client";

import { gql } from "graphql-request";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ensureValidActiveUserProfile } from "@/app/_lib/activeUser";
import type { BenefitRow, BenefitStatus, EmployeeDetail } from "./types";
import {
  formatRoleLabel,
  formatComputedAt,
  getClient,
  getErrorMessage,
  inferReason,
} from "./utils";

const EMPLOYEE_QUERY = gql`
  query Employee($id: ID!) {
    employee(id: $id) {
      id
      name
      role
      employmentStatus
      benefits {
        benefit {
          id
          name
        }
        status
        ruleEvaluations {
          ruleType
          passed
          reason
        }
        computedAt
        overrideApplied
        overrideReason
        rejectedReason
      }
    }
  }
`;

const OVERRIDE_ELIGIBILITY_MUTATION = gql`
  mutation OverrideEligibility($input: OverrideInput!) {
    overrideEligibility(input: $input) {
      benefit {
        id
      }
      status
    }
  }
`;

const CURRENT_ADMIN = "HR Admin";

export function useEmployeeEligibilityDetail() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : null;

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<{
    id: string;
    name: string;
    role: string;
    benefits: BenefitRow[];
  } | null>(null);
  const [activeBenefitKey, setActiveBenefitKey] = useState<string | null>(null);
  const [draftStatusByKey, setDraftStatusByKey] = useState<
    Record<string, BenefitStatus>
  >({});
  const [draftReasonByKey, setDraftReasonByKey] = useState<
    Record<string, string>
  >({});
  const [savedReasonByKey, setSavedReasonByKey] = useState<
    Record<string, string>
  >({});
  const [savingByKey, setSavingByKey] = useState<Record<string, boolean>>({});
  const [errorByKey, setErrorByKey] = useState<Record<string, string>>({});

  const activeBenefit = useMemo(() => {
    if (!employee || !activeBenefitKey) return null;
    return (
      employee.benefits.find(
        (benefit) => `${employee.id}-${benefit.benefitId}` === activeBenefitKey,
      ) ?? null
    );
  }, [activeBenefitKey, employee]);

  const openBenefitModal = (key: string, currentStatus: BenefitStatus) => {
    setActiveBenefitKey(key);
    setDraftStatusByKey((prev) =>
      prev[key] ? prev : { ...prev, [key]: currentStatus },
    );
    setErrorByKey((prev) => ({ ...prev, [key]: "" }));
  };

  const closeBenefitModal = () => {
    setActiveBenefitKey(null);
  };

  const handleSaveStatus = async (
    benefitId: string,
    key: string,
    fallbackReason: string,
  ) => {
    if (!id) return;

    const nextStatus = draftStatusByKey[key] ?? "PENDING";
    const rawReason = draftReasonByKey[key] ?? "";
    const reason = rawReason.trim() || fallbackReason;

    setSavingByKey((prev) => ({ ...prev, [key]: true }));
    setErrorByKey((prev) => ({ ...prev, [key]: "" }));

    try {
      await ensureValidActiveUserProfile();
      const client = getClient();
      try {
        await client.request(OVERRIDE_ELIGIBILITY_MUTATION, {
          input: {
            employeeId: id,
            benefitId,
            status: nextStatus,
            reason,
          },
        });
      } catch (firstError) {
        const msg = getErrorMessage(firstError).toLowerCase();
        if (!msg.includes("employee not found")) throw firstError;

        await ensureValidActiveUserProfile();
        const retryClient = getClient();
        await retryClient.request(OVERRIDE_ELIGIBILITY_MUTATION, {
          input: {
            employeeId: id,
            benefitId,
            status: nextStatus,
            reason,
          },
        });
      }

      const changedAt = new Date().toLocaleString();
      const formattedDate = new Date().toLocaleDateString("en-CA");

      setEmployee((prev) =>
        prev
          ? {
              ...prev,
              benefits: prev.benefits.map((benefit) =>
                benefit.benefitId === benefitId
                  ? {
                      ...benefit,
                      status: nextStatus,
                      reason,
                      lastDate: formattedDate,
                      history: [
                        {
                          status: nextStatus,
                          reason,
                          changedAt,
                          changedBy: CURRENT_ADMIN,
                        },
                        ...benefit.history,
                      ],
                    }
                  : benefit,
              ),
            }
          : null,
      );

      setSavedReasonByKey((prev) => ({ ...prev, [key]: reason }));
      setDraftReasonByKey((prev) => ({ ...prev, [key]: rawReason }));
      setActiveBenefitKey(null);
    } catch (e) {
      setErrorByKey((prev) => ({ ...prev, [key]: getErrorMessage(e) }));
    } finally {
      setSavingByKey((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await ensureValidActiveUserProfile();
        const client = getClient();
        let data: { employee: EmployeeDetail | null };

        try {
          data = await client.request<{ employee: EmployeeDetail | null }>(
            EMPLOYEE_QUERY,
            { id },
          );
        } catch (firstError) {
          const msg = getErrorMessage(firstError).toLowerCase();
          if (!msg.includes("employee not found")) throw firstError;

          await ensureValidActiveUserProfile();
          const retryClient = getClient();
          data = await retryClient.request<{ employee: EmployeeDetail | null }>(
            EMPLOYEE_QUERY,
            { id },
          );
        }

        if (cancelled) return;

        const emp = data.employee;
        if (!emp) {
          setEmployee(null);
          return;
        }

        setEmployee({
          id: emp.id ?? "",
          name: emp.name ?? "Unknown",
          role: formatRoleLabel(emp.role ?? emp.employmentStatus ?? "Employee"),
          benefits: (emp.benefits ?? []).map((benefit) => ({
            benefitId: benefit.benefit?.id ?? "",
            name: benefit.benefit?.name ?? "Unknown",
            status: benefit.status,
            reason: inferReason(benefit),
            lastDate: formatComputedAt(benefit.computedAt),
            history: [],
          })),
        });
      } catch {
        if (!cancelled) setEmployee(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    id,
    loading,
    employee,
    activeBenefit,
    activeBenefitKey,
    draftStatusByKey,
    setDraftStatusByKey,
    draftReasonByKey,
    setDraftReasonByKey,
    savedReasonByKey,
    errorByKey,
    savingByKey,
    openBenefitModal,
    closeBenefitModal,
    handleSaveStatus,
  };
}
