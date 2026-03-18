/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GraphQLClient, gql } from "graphql-request";
import {
  ensureValidActiveUserProfile,
  getActiveUserHeaders,
} from "@/app/_lib/activeUser";
import { BackIcon } from "@/app/icons/back";

type BenefitStatus = "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING" | "REJECTED";

type EmployeeBenefit = {
  benefit: { id: string; name: string };
  status: BenefitStatus;
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
  computedAt?: string | null;
  overrideApplied?: boolean;
  overrideReason?: string | null;
  rejectedReason?: string | null;
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

const statusOptions: BenefitStatus[] = [
  "ACTIVE",
  "PENDING",
  "ELIGIBLE",
  "LOCKED",
];

const modalStatusOptions: BenefitStatus[] = [
  "ACTIVE",
  "PENDING",
  "ELIGIBLE",
  "LOCKED",
  "REJECTED",
];

const statusCopy: Record<BenefitStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  ELIGIBLE: "Eligible",
  LOCKED: "Locked",
  REJECTED: "Rejected",
};

const statusButtonClass: Record<BenefitStatus, string> = {
  ACTIVE:
    "border-[#365C70] bg-[linear-gradient(180deg,rgba(30,60,79,0.95),rgba(24,47,63,0.95))] text-white",
  PENDING:
    "border-[#48405D] bg-[linear-gradient(180deg,rgba(52,48,73,0.95),rgba(42,38,60,0.95))] text-white",
  ELIGIBLE:
    "border-[#36527C] bg-[linear-gradient(180deg,rgba(41,63,101,0.95),rgba(33,51,82,0.95))] text-white",
  LOCKED:
    "border-[#5E3849] bg-[linear-gradient(180deg,rgba(81,42,57,0.95),rgba(63,34,45,0.95))] text-white",
  REJECTED:
    "border-[#5E3849] bg-[linear-gradient(180deg,rgba(81,42,57,0.95),rgba(63,34,45,0.95))] text-white",
};

function getStatusSegmentClass(option: BenefitStatus, selected: boolean) {
  const base =
    "inline-flex h-[54px] items-center justify-center rounded-[8px] border text-[16px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A9BFF]/70";
  if (selected) return `${base} ${statusButtonClass[option]}`;
  return `${base} border-white/10 bg-[rgba(255,255,255,0.03)] text-white`;
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
  if (benefit.rejectedReason?.trim()) {
    return benefit.rejectedReason.trim();
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

  const activeDraftStatus = activeBenefit
    ? (draftStatusByKey[activeBenefitKey ?? ""] ?? activeBenefit.status)
    : "ACTIVE";
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
        Ажилтан олдсонгүй.
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
        Ажилтан олдсонгүй.
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[80vh] px-[28px] pb-12 pt-[34px] text-white">
        <div className="mx-auto max-w-[1512px]">
          <div className="mb-[42px] flex items-start gap-[22px] justify-between">
            <button
              type="button"
              onClick={() => router.push("/admin/employee-eligibility")}
              aria-label="Back"
              className="mt-[6px] inline-flex h-[74px] w-[74px] items-center justify-center rounded-[16px]  border-[#35527A] bg-[#FFFFFF1A] text-white/88 transition hover:bg-[rgba(40,58,92,0.92)]"
            >
              <BackIcon />
            </button>

            <div className=" flex flex-col justify-end">
              <h1 className="text-[12px] font-normal leading-[1.02] tracking-[-0.04em] text-white">
                {employee.name}
              </h1>
              <p className="mt-[12px] text-[27px] font-normal text-[#9AA8AB80] tracking-[-0.02em] text-white/48">
                Role <span className="text-[#9AA8AB]">: {employee.role}</span>
              </p>
            </div>
          </div>

          <section className="overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,rgba(36,24,56,0.78),rgba(22,15,39,0.54))] shadow-[0_18px_70px_rgba(5,3,16,0.34)] backdrop-blur-[3px]">
            <div className="grid grid-cols-[2.2fr_1.1fr_1.45fr_1.2fr_0.65fr] items-center bg-[linear-gradient(90deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08),rgba(255,255,255,0.12))] px-[20px] py-[22px] text-[20px] text-white/50">
              <div>Benefit</div>
              <div>Status</div>
              <div>Reason</div>
              <div>Last Date</div>
              <div>Action</div>
            </div>

            <div className="px-[20px]">
              {employee.benefits.map((benefit) => {
                const key = `${employee.id}-${benefit.benefitId}`;

                return (
                  <div
                    key={benefit.benefitId || benefit.name}
                    className="grid min-h-[72px] grid-cols-[2.2fr_1.1fr_1.45fr_1.2fr_0.65fr] items-center border-b border-white/14 text-[18px] text-white/92 last:border-b-0"
                  >
                    <div className="pr-6 font-medium">{benefit.name}</div>
                    <div>{statusCopy[benefit.status]}</div>
                    <div className="pr-6 text-white/90">{benefit.reason}</div>
                    <div>{benefit.lastDate}</div>
                    <button
                      type="button"
                      onClick={() => openBenefitModal(key, benefit.status)}
                      className="inline-flex items-center gap-[10px] text-[18px] font-medium text-[#1E78FF] transition hover:text-[#56A5FF]"
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
                <div className="py-12 text-center text-[18px] text-white/58">
                  Benefit мэдээлэл олдсонгүй.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {activeBenefit && activeBenefitKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,10,20,0.50)] px-6 backdrop-blur-[4px]">
          <div className="h-[480px] w-full max-w-[700px] rounded-[30px]  border-white/18 bg-[#1F2744]/[0.98] px-[34px] pb-[32px] pt-[44px] shadow-[0_40px_140px_rgba(3,6,15,0.58)]">
            <div>
              <h2 className="text-[22px] font-normal tracking-[-0.03em] text-white">
                {activeBenefit.name}
              </h2>
              <p className="mt-[2px] text-[16px] text-white/45">
                Edit benefit status
              </p>
            </div>

            <div className="mt-[22px] grid grid-cols-[1.04fr_1.62fr] gap-[12px]">
              <div className="rounded-[16px] border border-white/10 bg-[#0B102B1A] px-[22px] py-[14px]">
                <p className="text-[20px] font-normal leading-[1.05] tracking-[-0.03em] text-white">
                  {employee.name}
                </p>
                <p className="mt-[4px] text-[12px] text-white/63">
                  {employee.role}
                </p>
              </div>

              <div className="rounded-[16px] border border-white/10 bg-[#0B102B1A] p-[20px]">
                <div className="grid grid-cols-4 gap-[10px]">
                  {modalStatusOptions.map((option) => {
                    const selected = activeDraftStatus === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setDraftStatusByKey((prev) => ({
                            ...prev,
                            [activeBenefitKey]: option,
                          }))
                        }
                        className={getStatusSegmentClass(option, selected)}
                        aria-pressed={selected}
                      >
                        {statusCopy[option]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <label className="mt-[20px] block pl-[24px] text-[13px] text-white/50">
              *Reason for change (optional)
            </label>
            <textarea
              ref={reasonTextareaRef}
              rows={6}
              value={activeDraftReason}
              onChange={(e) => {
                setDraftReasonByKey((prev) => ({
                  ...prev,
                  [activeBenefitKey]: e.target.value,
                }));
                e.target.style.height = "0px";
                e.target.style.height = `${Math.max(e.target.scrollHeight, 112)}px`;
              }}
              placeholder="Comment..."
              className="mt-[10px] min-h-[50px] w-full resize-none overflow-hidden rounded-[22px] border border-white/10 bg-[#0B102B1A] px-[24px] py-[18px] text-[18px] font-normal text-white outline-none placeholder:text-white/36 focus:border-[#2A9BFF]"
            />

            {activeError && (
              <p className="mt-3 text-sm text-red-300">{activeError}</p>
            )}

            {activeSavedReason && !activeError && (
              <p className="mt-3 text-sm text-white/48">
                Last saved reason: {activeSavedReason}
              </p>
            )}

            <div className="mt-[16px] flex justify-end gap-[20px]">
              <button
                type="button"
                onClick={closeBenefitModal}
                className="h-[46px] w-34 rounded-[10px] bg-[#C3C3C3] px-[20px] py-[10px]  text-[16px] font-ligth text-[#16346E] transition hover:bg-[#D1D1D1]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  void handleSaveStatus(
                    activeBenefit.benefitId,
                    activeBenefitKey,
                    activeBenefit.reason,
                  )
                }
                disabled={activeSaving}
                className="h-[46px] w-50 rounded-[10px] bg-[#1a83ed] px-[28px] py-[10px] text-[16px] font-light text-white transition hover:bg-[#2A74BC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {activeSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
