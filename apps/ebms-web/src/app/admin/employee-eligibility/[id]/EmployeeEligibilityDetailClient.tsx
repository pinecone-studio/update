/** @format */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GraphQLClient, gql } from "graphql-request";
import { ensureValidActiveUserProfile, getActiveUserHeaders } from "@/app/_lib/activeUser";

type BenefitStatus = "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING";

type EmployeeBenefit = {
  benefit: { id: string; name: string };
  status: BenefitStatus;
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
};

type EmployeeDetail = {
  id: string;
  name?: string | null;
  role?: string | null;
  employmentStatus?: string | null;
  benefits: EmployeeBenefit[];
};

type BenefitRow = {
  benefitId: string;
  name: string;
  status: BenefitStatus;
  history: Array<{
    status: string;
    reason: string;
    changedAt: string;
    changedBy: string;
  }>;
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

const statusClass: Record<BenefitStatus, string> = {
  ACTIVE: "border-[#166534] dark:bg-[#052E25] text-[#34D399]",
  ELIGIBLE: "border-[#1D4ED8] dark:bg-[#122B4C] text-[#60A5FA]",
  LOCKED: "border-[#9F1239] dark:bg-[#3A1026] text-[#FB7185]",
  PENDING: "border-[#B45309] dark:bg-[#3B2A12] text-[#FBBF24]",
};

const statusOptions: BenefitStatus[] = ["ACTIVE", "PENDING", "ELIGIBLE", "LOCKED"];

function getClient(): GraphQLClient {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const base = raw.replace(/\/graphql\/?$/, "").trim() || "http://localhost:8787";
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      ...getActiveUserHeaders("admin"),
    },
  });
}

function getErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "response" in e) {
    const res = (e as { response?: { errors?: Array<{ message?: string }> } }).response;
    const msg = res?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

export default function EmployeeEligibilityDetailClient() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<{
    id: string;
    name: string;
    department: string;
    benefits: BenefitRow[];
  } | null>(null);
  const [expandedBenefitKey, setExpandedBenefitKey] = useState<string | null>(null);
  const [draftStatusByKey, setDraftStatusByKey] = useState<Record<string, BenefitStatus>>({});
  const [draftReasonByKey, setDraftReasonByKey] = useState<Record<string, string>>({});
  const [savedReasonByKey, setSavedReasonByKey] = useState<Record<string, string>>({});
  const [savingByKey, setSavingByKey] = useState<Record<string, boolean>>({});
  const [errorByKey, setErrorByKey] = useState<Record<string, string>>({});
  const currentAdmin = "HR Admin";

  const handleBack = () => {
    router.push("/admin");
  };

  const handleShowToggle = (key: string, currentStatus: BenefitStatus) => {
    setExpandedBenefitKey((prev) => (prev === key ? null : key));
    setDraftStatusByKey((prev) =>
      prev[key] ? prev : { ...prev, [key]: currentStatus }
    );
  };

  const handleSaveStatus = async (
    benefitId: string,
    benefitName: string,
    key: string
  ) => {
    if (!id) return;
    const reason = (draftReasonByKey[key] ?? "").trim();
    if (!reason) return;

    const nextStatus = draftStatusByKey[key] ?? "PENDING";
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
        if (!msg.includes("employee not found")) {
          throw firstError;
        }
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
      setEmployee((prev) =>
        prev
          ? {
              ...prev,
              benefits: prev.benefits.map((benefit) =>
                benefit.benefitId === benefitId
                  ? {
                      ...benefit,
                      status: nextStatus,
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
                  : benefit
              ),
            }
          : null
      );
      setSavedReasonByKey((prev) => ({ ...prev, [key]: reason }));
      setDraftReasonByKey((prev) => ({ ...prev, [key]: "" }));
      setExpandedBenefitKey(null);
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
          data = await client.request<{ employee: EmployeeDetail | null }>(EMPLOYEE_QUERY, { id });
        } catch (firstError) {
          const msg = getErrorMessage(firstError).toLowerCase();
          if (!msg.includes("employee not found")) {
            throw firstError;
          }
          await ensureValidActiveUserProfile();
          const retryClient = getClient();
          data = await retryClient.request<{ employee: EmployeeDetail | null }>(EMPLOYEE_QUERY, { id });
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
          department: emp.role ?? emp.employmentStatus ?? "—",
          benefits: (emp.benefits ?? []).map((b) => ({
            benefitId: b.benefit?.id ?? "",
            name: b.benefit?.name ?? "Unknown",
            status: b.status,
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-slate-500 dark:text-[#9FB0CF]">Ажилтан олдсонгүй.</p>
        <button
          type="button"
          onClick={handleBack}
          className="mt-4 text-[#2F66E8] hover:underline"
        >
          Буцах
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-16 w-64 rounded-2xl bg-slate-200 dark:bg-[#1E293B]" />
        <div className="h-96 rounded-3xl bg-slate-200 dark:bg-[#1E293B]" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-slate-500 dark:text-[#9FB0CF]">Ажилтан олдсонгүй.</p>
        <button
          type="button"
          onClick={handleBack}
          className="mt-4 text-[#2F66E8] hover:underline"
        >
          Буцах
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-[#324A70] dark:bg-[#1E293B] dark:text-[#C9D5EA] dark:hover:bg-[#142544]"
            aria-label="Буцах"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {employee.name}
            </h1>
            <p className="mt-1 text-slate-500 dark:text-[#9FB0CF]">
              {employee.id} • {employee.department}
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <section className="max-w-[1500px] mx-auto ">
        <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
          Benefit eligibility
        </h2>
        <div className="flex flex-row gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {employee.benefits.map((benefit) => {
            const key = `${employee.id}-${benefit.benefitId}`;
            const isExpanded = expandedBenefitKey === key;
            const draftStatus = draftStatusByKey[key] ?? benefit.status;
            const draftReason = draftReasonByKey[key] ?? "";
            const isSaving = savingByKey[key] ?? false;
            const canSave = draftReason.trim().length > 0;
            const lastReason = savedReasonByKey[key];
            const saveError = errorByKey[key];

            return (
              <article
                key={benefit.benefitId || benefit.name}
                className="rounded-lg border border-slate-200 bg-slate-50 px-6 py-5 dark:border-[#324A70] dark:bg-[#1E293B] "
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {benefit.name}
                    </h3>
                    <span
                      className={`rounded border px-2 py-0.5 text-xs font-medium ${statusClass[benefit.status]}`}
                    >
                      {benefit.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleShowToggle(key, benefit.status)}
                    className="group flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-[#C9D5EA] dark:hover:border-[#4B6FA8] dark:hover:bg-[#142544]"
                  >
                    <span className="text-sm font-medium">
                      Change {benefit.history.length}
                    </span>
                  </button>
                </div>
                  <div className="mt-5 rounded-lg border border-slate-300 bg-white p-5 dark:border-[#324A70] dark:bg-[#0F172A]">
                    <p className="text-sm font-medium text-slate-600 dark:text-[#C9D5EA]">
                      Status сонголт
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setDraftStatusByKey((prev) => ({
                              ...prev,
                              [key]: option,
                            }))
                          }
                          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                            draftStatus === option
                              ? statusClass[option]
                              : "border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-[#324A70] dark:text-[#C9D5EA] dark:hover:border-[#4B6FA8] dark:hover:text-white"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <label className="mt-4 block text-sm font-medium text-slate-600 dark:text-[#C9D5EA]">
                      Яагаад өөрчилснөө бичнэ үү
                    </label>
                    <textarea
                      rows={3}
                      value={draftReason}
                      onChange={(e) =>
                        setDraftReasonByKey((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      placeholder="Шалтгаан..."
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 dark:border-[#324A70] dark:bg-[#1E293B] dark:text-white dark:placeholder:text-[#8FA3C5] dark:focus:border-[#4B6FA8]"
                    />
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          void handleSaveStatus(
                            benefit.benefitId,
                            benefit.name,
                            key
                          )
                        }
                        disabled={!canSave || isSaving}
                        className="rounded-xl bg-[#2F66E8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? "Хадгалж байна..." : "Save"}
                      </button>
                    </div>
                    {saveError && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-300">
                        {saveError}
                      </p>
                    )}
                    {lastReason && (
                      <p className="mt-3 text-sm text-slate-500 dark:text-[#8FA3C5]">
                        Сүүлд хадгалсан тайлбар: {lastReason}
                      </p>
                    )}

                    <div className="mt-5">
                      <p className="text-sm font-medium text-slate-600 dark:text-[#C9D5EA]">
                        Өөрчлөлтийн түүх
                      </p>
                      {benefit.history.length === 0 ? (
                        <p className="mt-2 text-sm text-slate-500 dark:text-[#8FA3C5]">
                          Түүх алга.
                        </p>
                      ) : (
                        <div className="mt-3 space-y-2">
                          {benefit.history.map((entry, idx) => (
                            <div
                              key={`${entry.changedAt}-${idx}`}
                              className="rounded-none border border-slate-300 bg-slate-50 px-4 py-3 dark:border-[#324A70] dark:bg-[#1E293B]"
                            >
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {entry.changedBy} • {entry.changedAt}
                              </p>
                              <p className="mt-1 text-sm text-slate-600 dark:text-[#A7B6D3]">
                                Status: {entry.status}
                              </p>
                              <p className="mt-1 text-sm text-slate-500 dark:text-[#8FA3C5]">
                                Шалтгаан: {entry.reason}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
              
              </article>
            );
          })}
          {employee.benefits.length === 0 && (
            <p className="rounded-none border border-slate-300 bg-slate-50 px-6 py-8 text-center text-slate-500 dark:border-[#324A70] dark:bg-[#1E293B] dark:text-[#9FB0CF]">
              Benefit мэдээлэл олдсонгүй.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
