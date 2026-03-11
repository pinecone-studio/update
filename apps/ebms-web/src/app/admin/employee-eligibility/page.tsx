"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchEmployees,
  fetchEmployee,
  getApiErrorMessage,
  type EmployeeListItem,
  type EmployeeWithBenefits,
  type BenefitEligibilityItem,
} from "../_lib/api";

const statusClass: Record<string, string> = {
  ACTIVE: "border-[#166534] bg-[#052E25] text-[#34D399]",
  ELIGIBLE: "border-[#1D4ED8] bg-[#122B4C] text-[#60A5FA]",
  LOCKED: "border-[#9F1239] bg-[#3A1026] text-[#FB7185]",
  PENDING: "border-[#B45309] bg-[#3B2A12] text-[#FBBF24]",
};

export default function EmployeeEligibilityPage() {
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithBenefits | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const list = await fetchEmployees();
      setEmployees(list);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setEmployees([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const searchOrSelect = useCallback(async () => {
    const q = searchInput.trim();
    if (!q) return;
    setLoadingDetail(true);
    setError(null);
    try {
      const emp = await fetchEmployee(q);
      setSelectedEmployee(emp);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setSelectedEmployee(null);
    } finally {
      setLoadingDetail(false);
    }
  }, [searchInput]);

  const filtered = employees.filter(
    (e) =>
      !searchInput.trim() ||
      e.id.toLowerCase().includes(searchInput.toLowerCase()) ||
      (e.name && e.name.toLowerCase().includes(searchInput.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">
          Employee Eligibility Overview
        </h1>
        <p className="mt-3 text-2xl text-[#A7B6D3]">
          Search and view employee benefit eligibility with rule evaluation
        </p>
      </div>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#93A4C3]">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by employee name or ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchOrSelect()}
              className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] pl-14 pr-4 text-lg text-white outline-none placeholder:text-[#8FA3C5] focus:border-[#4B6FA8]"
            />
          </div>
          <button
            type="button"
            onClick={searchOrSelect}
            disabled={loadingDetail || !searchInput.trim()}
            className="h-14 rounded-2xl bg-[#0F172A] px-10 text-4 font-medium text-white transition hover:bg-[#3E82F7] disabled:opacity-50"
          >
            {loadingDetail ? "Loading..." : "Search"}
          </button>
        </div>
        {!loadingList && filtered.length > 0 && !selectedEmployee && (
          <ul className="mt-4 space-y-2 rounded-xl border border-[#324A70] bg-[#0F172A] p-2 max-h-48 overflow-y-auto">
            {filtered.slice(0, 20).map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput(e.id);
                    setLoadingDetail(true);
                    fetchEmployee(e.id)
                      .then(setSelectedEmployee)
                      .catch(() => setSelectedEmployee(null))
                      .finally(() => setLoadingDetail(false));
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-white hover:bg-[#1E293B]"
                >
                  {e.name} ({e.id})
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error && <p className="text-sm text-red-400">Error: {error}</p>}

      {selectedEmployee && (
        <>
          <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-7">
            <h2 className="text-xl font-semibold text-white">{selectedEmployee.name}</h2>
            <p className="mt-4 text-4 text-[#9FB0CF]">
              ID: {selectedEmployee.id} • {selectedEmployee.role} • Status: {selectedEmployee.employmentStatus}
            </p>
          </section>

          <div className="space-y-5">
            {(selectedEmployee.benefits ?? []).map((be: BenefitEligibilityItem) => (
              <article
                key={be.benefit.id}
                className="flex items-center justify-between rounded-3xl border border-[#2C4264] bg-[#1E293B] px-7 py-8"
              >
                <div className="flex items-center gap-5">
                  <h3 className="text-2 font-medium text-white">{be.benefit.name}</h3>
                  <span
                    className={`rounded-lg border px-2 py-0.5 text-sm font-medium ${statusClass[be.status] ?? "bg-[#334155] text-white"}`}
                  >
                    {be.status}
                  </span>
                </div>
                <div className="text-5 text-[#A7B6D3]">
                  {be.ruleEvaluations?.length
                    ? be.ruleEvaluations.map((r, i) => (
                        <div key={i}>
                          {r.ruleType}: {r.passed ? "✓" : "✗"} {r.reason}
                        </div>
                      ))
                    : "—"}
                </div>
              </article>
            ))}
            {selectedEmployee.benefits?.length === 0 && (
              <p className="text-[#A7B6D3]">No benefits configured for this employee.</p>
            )}
          </div>
        </>
      )}

      {!selectedEmployee && !loadingDetail && searchInput.trim() && employees.length > 0 && (
        <p className="text-[#A7B6D3]">Enter employee ID and click Search, or pick from the list.</p>
      )}
    </div>
  );
}
