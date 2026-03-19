/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GraphQLClient, gql } from "graphql-request";
import {
  ensureValidActiveUserProfile,
  getActiveUserHeaders,
} from "@/app/_lib/activeUser";
import { BenefitStatusModal } from "./_components/BenefitStatusModal";

type BenefitStatus =
  | "ACTIVE"
  | "ELIGIBLE"
  | "LOCKED"
  | "PENDING"
  | "REJECTED";

type EmployeeBenefit = {
  benefit: {
    id: string;
    name: string;
    subsidyPercent?: number | null;
    vendorName?: string | null;
    activeContract?: {
      effectiveDate?: string | null;
      expiryDate?: string | null;
    } | null;
  };
  status: BenefitStatus;
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
  computedAt?: string | null;
  overrideApplied?: boolean;
  overrideReason?: string | null;
};

type EmployeeDetail = {
  id: string;
  name?: string | null;
  role?: string | null;
  employmentStatus?: string | null;
  benefits: EmployeeBenefit[];
};

type BenefitHistoryEntry = {
  status: string;
  reason: string;
  changedAt: string;
  changedBy: string;
};

type BenefitRow = {
  benefitId: string;
  name: string;
  status: BenefitStatus;
  reason: string;
  lastDate: string;
  subsidyPercent?: number | null;
  vendorName?: string | null;
  effectiveDate?: string | null;
  expiryDate?: string | null;
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
  overrideApplied?: boolean;
  overrideReason?: string | null;
  history: BenefitHistoryEntry[];
};

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
          subsidyPercent
          vendorName
          activeContract {
            effectiveDate
            expiryDate
          }
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

const statusOptions: BenefitStatus[] = [
  "ACTIVE",
  "PENDING",
  "ELIGIBLE",
  "LOCKED",
];

const statusCopy: Record<BenefitStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  ELIGIBLE: "Eligible",
  LOCKED: "Locked",
  REJECTED: "Rejected",
};

const statusButtonClass: Record<BenefitStatus, string> = {
  ACTIVE: "border-[#ffffff]/10 bg-[#0f5540] text-white",
  PENDING: "border-[#ffffff]/50 bg-[#8a5212] text-white",
  ELIGIBLE: "border-[#ffffff]/50 bg-[#1a4a82] text-white",
  LOCKED: "border-[#ffffff]/50 bg-[#851618] text-white",
  REJECTED: "border-[#ffffff]/50 bg-[#7d2338] text-white",
};

function getStatusSegmentClass(option: BenefitStatus, selected: boolean) {
  const base =
    "inline-flex h-[54px] items-center justify-center rounded-[8px] border text-[16px] font-medium transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A9BFF]/70";
  if (selected) {
    return `${base} ${statusButtonClass[option]} hover:brightness-110 hover:saturate-125`;
  }
  return `${base} border-white/10 bg-[rgba(255,255,255,0.03)] text-white hover:border-[#4D78B8] hover:bg-[rgba(38,87,165,0.34)]`;
}

function getClient(): GraphQLClient {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const base =
    raw.replace(/\/graphql\/?$/, "").trim() || "http://localhost:8787";
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      ...getActiveUserHeaders("admin"),
    },
  });
}

function getErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "response" in e) {
    const res = (e as { response?: { errors?: Array<{ message?: string }> } })
      .response;
    const msg = res?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

function formatRoleLabel(value: string): string {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function inferReason(benefit: EmployeeBenefit): string {
  if (benefit.overrideApplied && benefit.overrideReason?.trim()) {
    return benefit.overrideReason.trim();
  }
  const failedRule = benefit.ruleEvaluations?.find((e) => !e.passed);
  if (failedRule?.reason) return failedRule.reason;
  if (benefit.status === "ELIGIBLE" || benefit.status === "ACTIVE") {
    return "Meets all requirements";
  }
  return "See eligibility rules";
}

function formatComputedAt(computedAt: string | null | undefined): string {
  if (!computedAt?.trim()) return "—";
  try {
    const d = new Date(computedAt);
    if (Number.isNaN(d.getTime())) return computedAt;
    const dateStr = d.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${dateStr} ${timeStr}`;
  } catch {
    return computedAt;
  }
}

function getModalStatusMeta(status: BenefitStatus) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Active",
        message: "Benefit is currently active",
        icon: "check" as const,
        accent: "bg-[#2B8A69]",
        panel:
          "border-[rgba(65,140,122,0.55)] bg-[linear-gradient(135deg,rgba(36,107,95,0.42)_0%,rgba(32,83,98,0.28)_100%)]",
      };
    case "ELIGIBLE":
      return {
        label: "Eligible",
        message: "All requirements satisfied",
        icon: "check" as const,
        accent: "bg-[#2B8A69]",
        panel:
          "border-[rgba(90,132,196,0.55)] bg-[linear-gradient(135deg,rgba(48,82,133,0.40)_0%,rgba(45,68,122,0.28)_100%)]",
      };
    case "LOCKED":
      return {
        label: "Locked",
        message: "Eligibility requirements not satisfied",
        icon: "x" as const,
        accent: "bg-[#8B4762]",
        panel:
          "border-[rgba(146,90,118,0.60)] bg-[linear-gradient(135deg,rgba(97,52,93,0.34)_0%,rgba(78,45,95,0.24)_100%)]",
      };
    default:
      return {
        label: "Pending",
        message: "Request is under review",
        icon: "clock" as const,
        accent: "bg-[#8C6437]",
        panel:
          "border-[rgba(146,120,96,0.60)] bg-[linear-gradient(135deg,rgba(124,86,54,0.34)_0%,rgba(90,66,54,0.26)_100%)]",
      };
  }
}

function formatStatusDate(value: string | null | undefined): string {
  if (!value?.trim() || value === "—") return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EmployeeEligibilityDetailClient() {
  const reasonTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const params = useParams();
  const router = useRouter();
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
  const currentAdmin = "HR Admin";

  const activeBenefit = useMemo(() => {
    if (!employee || !activeBenefitKey) return null;
    return (
      employee.benefits.find(
        (benefit) => `${employee.id}-${benefit.benefitId}` === activeBenefitKey,
      ) ?? null
    );
  }, [activeBenefitKey, employee]);

  const normalizeDialogStatus = (status: BenefitStatus): BenefitStatus =>
    statusOptions.includes(status) ? status : "PENDING";

  const activeDraftStatus = activeBenefit
    ? normalizeDialogStatus(
        draftStatusByKey[activeBenefitKey ?? ""] ?? activeBenefit.status,
      )
    : "ACTIVE";
  const activeStatusMeta = getModalStatusMeta(activeDraftStatus);
  const activeRuleRows = activeBenefit
    ? activeBenefit.ruleEvaluations.length > 0
      ? activeBenefit.ruleEvaluations.map((rule) => ({
          title:
            rule.ruleType
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase()) ||
            "Eligibility Rule",
          passed: rule.passed,
          detail: rule.reason,
        }))
      : [
          {
            title: activeBenefit.reason,
            passed: activeBenefit.status !== "LOCKED",
            detail: activeBenefit.overrideReason ?? "",
          },
        ]
    : [];
  const activeDraftReason = activeBenefitKey
    ? (draftReasonByKey[activeBenefitKey] ?? "")
    : "";
  const activeError = activeBenefitKey
    ? (errorByKey[activeBenefitKey] ?? "")
    : "";
  const activeSavedReason = activeBenefitKey
    ? (savedReasonByKey[activeBenefitKey] ?? "")
    : "";
  const activeSaving = activeBenefitKey
    ? (savingByKey[activeBenefitKey] ?? false)
    : false;

  useEffect(() => {
    const el = reasonTextareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(el.scrollHeight, 112)}px`;
  }, [activeDraftReason, activeBenefitKey]);

  const openBenefitModal = (key: string, currentStatus: BenefitStatus) => {
    const initialStatus = normalizeDialogStatus(currentStatus);
    setActiveBenefitKey(key);
    setDraftStatusByKey((prev) => ({ ...prev, [key]: initialStatus }));
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

    const nextStatus = normalizeDialogStatus(draftStatusByKey[key] ?? "PENDING");
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
                          changedBy: currentAdmin,
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
            subsidyPercent: benefit.benefit?.subsidyPercent ?? null,
            vendorName: benefit.benefit?.vendorName ?? null,
            effectiveDate: benefit.benefit?.activeContract?.effectiveDate ?? null,
            expiryDate: benefit.benefit?.activeContract?.expiryDate ?? null,
            ruleEvaluations: benefit.ruleEvaluations ?? [],
            overrideApplied: benefit.overrideApplied ?? false,
            overrideReason: benefit.overrideReason ?? null,
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

  if (!id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/70">
        Employee not found.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] animate-pulse px-6 pb-10 pt-10">
        <div className="mb-10 h-24 w-80 rounded-3xl bg-white/10" />
        <div className="h-[540px] rounded-[28px] bg-white/10" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/70">
        Employee not found.
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[80vh] px-[28px] pb-12 pt-[34px] text-white">
        <div className="mx-auto max-w-[1512px]">
          <div className="mb-[42px] flex items-start gap-[22px]">
            <button
              type="button"
              onClick={() => router.push("/admin/employee-eligibility")}
              aria-label="Back"
              className="mt-[6px] inline-flex h-[64px] w-[64px] items-center justify-center rounded-[16px] bg-[#FFFFFF1A] text-white/88 transition hover:bg-[rgba(40,58,92,0.92)]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 6L9 12L15 18" />
              </svg>
            </button>

            <div className="ml-auto flex flex-col items-end text-right">
              <h1 className="text-[42px] font-normal leading-[1.02] tracking-[-0.04em] text-white">
                {employee.name}
              </h1>
              <p className="mt-[8px] text-[26px] font-light text-[#9AA8AB80] tracking-[-0.02em] text-white/48">
                Role
                <span className="text-[#9AA8AB] font-light">
                  : {employee.role}
                </span>
              </p>
            </div>
          </div>

          <section className="overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,rgba(36,24,56,0.78),rgba(22,15,39,0.54))] shadow-[0_18px_70px_rgba(5,3,16,0.34)] backdrop-blur-[3px]">
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[2.2fr_1.1fr_1.45fr_1.2fr_0.65fr] items-center bg-[linear-gradient(90deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08),rgba(255,255,255,0.12))] px-4 py-4 text-sm text-white/50 sm:px-[20px] sm:py-[20px] sm:text-[17px]">
                  <div className="whitespace-nowrap">Benefit</div>
                  <div className="whitespace-nowrap">Status</div>
                  <div className="whitespace-nowrap">Reason</div>
                  <div className="whitespace-nowrap">Last Date</div>
                  <div className="whitespace-nowrap">Action</div>
                </div>

                <div className="px-4 sm:px-[20px]">
                  {employee.benefits.map((benefit) => {
                    const key = `${employee.id}-${benefit.benefitId}`;

                    return (
                      <div
                        key={benefit.benefitId || benefit.name}
                        className="grid min-h-[68px] grid-cols-[2.2fr_1.1fr_1.45fr_1.2fr_0.65fr] items-center border-b border-white/14 font-light text-sm text-white/92 last:border-b-0 sm:text-[16px]"
                      >
                        <div className="min-w-0 pr-4 font-regular sm:pr-6">
                          <span className="block truncate">{benefit.name}</span>
                        </div>
                        <div className="shrink-0 whitespace-nowrap">{statusCopy[benefit.status]}</div>
                        <div className="min-w-0 pr-4 text-white/90 sm:pr-6">
                          <span className="line-clamp-2">{benefit.reason}</span>
                        </div>
                        <div className="shrink-0 whitespace-nowrap text-xs sm:text-base">{benefit.lastDate}</div>
                        <button
                          type="button"
                          onClick={() => openBenefitModal(key, benefit.status)}
                          className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-[#1E78FF] transition hover:text-[#56A5FF] sm:gap-[10px] sm:text-[16px]"
                        >
                          <span>Fix</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-[18px] w-[18px]"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M10 7h7v7" />
                      </svg>
                    </button>
                      </div>
                    );
                  })}

                  {employee.benefits.length === 0 && (
                    <div className="py-12 text-center text-sm text-white/58 sm:text-[18px]">
                      Benefit information not found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {activeBenefit && activeBenefitKey && (
        <BenefitStatusModal
          open={true}
          benefit={activeBenefit}
          employeeName={employee.name}
          employeeRole={employee.role}
          draftStatus={activeDraftStatus}
          draftReason={activeDraftReason}
          error={activeError}
          savedReason={activeSavedReason}
          saving={activeSaving}
          onDraftStatusChange={(status) =>
            setDraftStatusByKey((prev) => ({
              ...prev,
              [activeBenefitKey]: status,
            }))
          }
          onDraftReasonChange={(reason) =>
            setDraftReasonByKey((prev) => ({
              ...prev,
              [activeBenefitKey]: reason,
            }))
          }
          onClose={closeBenefitModal}
          onSave={() =>
            void handleSaveStatus(
              activeBenefit.benefitId,
              activeBenefitKey,
              activeBenefit.reason,
            )
          }
        />
      )}
    </>
  );
}
