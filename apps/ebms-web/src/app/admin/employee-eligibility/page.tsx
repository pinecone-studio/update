/** @format */

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { GraphQLClient, gql } from "graphql-request";

type BenefitStatus = "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING";

type EmployeeListItem = {
  id: string;
  name?: string | null;
  role?: string | null;
  employmentStatus?: string | null;
};

type EmployeeBenefit = {
  benefit: { id: string; name: string };
  status: BenefitStatus;
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
};

type EmployeeDetail = EmployeeListItem & {
  benefits: EmployeeBenefit[];
};

const EMPLOYEES_QUERY = gql`
  query Employees {
    employees {
      id
      name
      role
      employmentStatus
    }
  }
`;

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
  ACTIVE: "border-[#166534] bg-[#052E25] text-[#34D399]",
  ELIGIBLE: "border-[#1D4ED8] bg-[#122B4C] text-[#60A5FA]",
  LOCKED: "border-[#9F1239] bg-[#3A1026] text-[#FB7185]",
  PENDING: "border-[#B45309] bg-[#3B2A12] text-[#FBBF24]",
};

const statusOptions: BenefitStatus[] = ["ACTIVE", "PENDING", "ELIGIBLE", "LOCKED"];

function getClient(): GraphQLClient {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const base = raw.replace(/\/graphql\/?$/, "").trim() || "http://localhost:8787";
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      "x-employee-id": "admin",
      "x-role": "admin",
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

export default function EmployeeEligibilityPage() {
  const [employeeList, setEmployeeList] = useState<EmployeeListItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetail | null>(null);
  const [expandedBenefitKey, setExpandedBenefitKey] = useState<string | null>(null);
  const [draftStatusByKey, setDraftStatusByKey] = useState<Record<string, BenefitStatus>>({});
  const [draftReasonByKey, setDraftReasonByKey] = useState<Record<string, string>>({});
  const [savedReasonByKey, setSavedReasonByKey] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await getClient().request<{ employees: EmployeeListItem[] }>(EMPLOYEES_QUERY);
      setEmployeeList(res.employees ?? []);
    } catch (e) {
      setError(getErrorMessage(e));
      setEmployeeList([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadEmployeeDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    setError(null);
    try {
      const res = await getClient().request<{ employee: EmployeeDetail | null }>(EMPLOYEE_QUERY, { id });
      setSelectedEmployee(res.employee ?? null);
    } catch (e) {
      setError(getErrorMessage(e));
      setSelectedEmployee(null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employeeList;
    return employeeList.filter(
      (emp) =>
        String(emp.name ?? "").toLowerCase().includes(q) ||
        String(emp.id ?? "").toLowerCase().includes(q) ||
        String(emp.role ?? "").toLowerCase().includes(q),
    );
  }, [search, employeeList]);

  const getInitials = (name: string) =>
    (name || "NA")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const handleCloseModal = () => {
    setSelectedId(null);
    setSelectedEmployee(null);
    setExpandedBenefitKey(null);
  };

  const handleSelectEmployee = async (id: string) => {
    setSelectedId(id);
    await loadEmployeeDetail(id);
  };

  const handleSearchSubmit = async () => {
    const q = search.trim().toLowerCase();
    if (!q) return;
    const exactByName = filteredEmployees.find(
      (e) => String(e.name ?? "").toLowerCase() === q,
    );
    const firstMatch = exactByName ?? filteredEmployees[0];
    if (!firstMatch) {
      setError("Хайлтад тохирох ажилтан олдсонгүй.");
      return;
    }
    await handleSelectEmployee(firstMatch.id);
  };

  const handleShowToggle = (key: string, currentStatus: BenefitStatus) => {
    setExpandedBenefitKey((prev) => (prev === key ? null : key));
    setDraftStatusByKey((prev) => (prev[key] ? prev : { ...prev, [key]: currentStatus }));
  };

  const handleSaveStatus = async (benefitId: string, key: string) => {
    if (!selectedEmployee) return;
    const reason = (draftReasonByKey[key] ?? "").trim();
    if (!reason) return;

    const nextStatus = draftStatusByKey[key] ?? "PENDING";
    setSavingKey(key);
    setError(null);
    try {
      await getClient().request(OVERRIDE_ELIGIBILITY_MUTATION, {
        input: {
          employeeId: selectedEmployee.id,
          benefitId,
          status: nextStatus,
          reason,
        },
      });
      setSavedReasonByKey((prev) => ({ ...prev, [key]: reason }));
      setDraftReasonByKey((prev) => ({ ...prev, [key]: "" }));
      setExpandedBenefitKey(null);
      await loadEmployeeDetail(selectedEmployee.id);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Employee Eligibility Overview</h1>
        <p className="mt-3 text-5 text-[#A7B6D3]">
          Нэрээр хайж, ажилтан дээр дарахад benefit eligibility-г төв popup дээр харна.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#93A4C3]">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleSearchSubmit();
              }
            }}
            placeholder="Ажилтны нэрээр хайх..."
            className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] pl-14 pr-4 text-5 text-white outline-none placeholder:text-[#8FA3C5] focus:border-[#4B6FA8]"
          />
          <button
            type="button"
            onClick={() => void handleSearchSubmit()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#2F66E8] px-3 py-2 text-xs text-white hover:bg-[#3E82F7]"
          >
            Хайх
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
        <h2 className="text-10 font-semibold text-white">Ажилтнуудын жагсаалт</h2>
        <div className="mt-4 space-y-2">
          {loadingList ? (
            <p className="rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 py-3 text-5 text-[#9FB0CF]">
              Ажилтнууд татаж байна...
            </p>
          ) : (
            <>
              {filteredEmployees.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handleSelectEmployee(emp.id)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 py-3 text-left transition hover:bg-[#142544]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7B7FFF] to-[#6B35FF] text-5 font-semibold text-white">
                    {getInitials(emp.name ?? "NA")}
                  </span>
                  <div>
                    <p className="text-5 font-medium text-white">{emp.name ?? "Unknown"}</p>
                    <p className="text-5 text-[#8FA3C5]">{emp.role ?? "—"}</p>
                  </div>
                </button>
              ))}
              {filteredEmployees.length === 0 && (
                <p className="rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 py-3 text-5 text-[#9FB0CF]">
                  Хайлтад тохирох ажилтан олдсонгүй.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {selectedEmployee &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100dvh",
              minHeight: "100vh",
            }}
            onClick={handleCloseModal}
          >
            <div
              className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-[#2C4264] bg-[#0F172A] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedEmployee.name}</h2>
                  <p className="mt-2 text-5 text-[#9FB0CF]">
                    {selectedEmployee.id} • {selectedEmployee.role}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-[#324A70] bg-[#1E293B] px-4 py-2 text-5 text-[#C9D5EA] hover:text-white"
                >
                  Хаах
                </button>
              </div>

              {loadingDetail ? (
                <p className="rounded-2xl border border-[#324A70] bg-[#1E293B] px-6 py-5 text-5 text-[#9FB0CF]">
                  Benefit eligibility татаж байна...
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedEmployee.benefits.map((benefit) => {
                    const key = `${selectedEmployee.id}-${benefit.benefit.id}`;
                    const isExpanded = expandedBenefitKey === key;
                    const draftStatus = draftStatusByKey[key] ?? benefit.status;
                    const draftReason = draftReasonByKey[key] ?? "";
                    const canSave = draftReason.trim().length > 0;
                    const lastReason = savedReasonByKey[key];
                    const failedReason =
                      benefit.ruleEvaluations.find((r) => !r.passed)?.reason ?? null;

                    return (
                      <article
                        key={benefit.benefit.id}
                        className="rounded-3xl border border-[#2C4264] bg-[#1E293B] px-7 py-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <h3 className="text-2 font-medium text-white">{benefit.benefit.name}</h3>
                            <span
                              className={`rounded-lg border px-2 py-0.5 text-sm font-medium ${statusClass[benefit.status]}`}
                            >
                              {benefit.status}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleShowToggle(key, benefit.status)}
                            className="flex items-center gap-3 text-5 text-[#A7B6D3] hover:text-white"
                          >
                            <span className="rounded-lg border border-[#324A70] bg-[#0F172A] px-2 py-1 text-5 text-[#C9D5EA]">
                              Override
                            </span>
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-6 w-6"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d={isExpanded ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
                            </svg>
                            <span>Show</span>
                          </button>
                        </div>

                        {failedReason && (
                          <p className="mt-2 text-xs text-[#fca5a5]">Locked reason: {failedReason}</p>
                        )}

                        {isExpanded && (
                          <div className="mt-4 rounded-2xl border border-[#324A70] bg-[#0F172A] p-4">
                            <p className="text-5 text-[#C9D5EA]">Status сонголт</p>
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
                                  className={`rounded-lg border px-3 py-1.5 text-5 transition ${
                                    draftStatus === option
                                      ? statusClass[option]
                                      : "border-[#324A70] text-[#C9D5EA] hover:text-white"
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                            <label className="mt-4 block text-5 text-[#C9D5EA]">
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
                              className="mt-2 w-full rounded-xl border border-[#324A70] bg-[#1E293B] px-3 py-2 text-5 text-white outline-none"
                            />
                            <div className="mt-3 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleSaveStatus(benefit.benefit.id, key)}
                                disabled={!canSave || savingKey === key}
                                className="rounded-xl bg-[#2F66E8] px-4 py-2 text-5 text-white disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {savingKey === key ? "Saving..." : "Save"}
                              </button>
                            </div>
                            {lastReason && (
                              <p className="mt-3 text-5 text-[#8FA3C5]">
                                Сүүлд хадгалсан тайлбар: {lastReason}
                              </p>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                  {selectedEmployee.benefits.length === 0 && (
                    <p className="rounded-2xl border border-[#324A70] bg-[#1E293B] px-6 py-5 text-5 text-[#9FB0CF]">
                      Benefit мэдээлэл олдсонгүй.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
