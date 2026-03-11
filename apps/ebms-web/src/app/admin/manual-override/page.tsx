"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchBenefitsList,
  overrideEligibility,
  getApiErrorMessage,
  type BenefitOption,
} from "../_lib/api";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "ELIGIBLE", label: "Eligible" },
  { value: "LOCKED", label: "Locked" },
  { value: "PENDING", label: "Pending" },
];

export default function ManualOverridePage() {
  const [benefits, setBenefits] = useState<BenefitOption[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [benefitId, setBenefitId] = useState("");
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBenefits, setLoadingBenefits] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadBenefits = useCallback(async () => {
    setLoadingBenefits(true);
    try {
      const list = await fetchBenefitsList();
      setBenefits(list);
      if (list.length > 0 && !benefitId) setBenefitId(list[0].id);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoadingBenefits(false);
    }
  }, []);

  useEffect(() => {
    loadBenefits();
  }, [loadBenefits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim() || !benefitId || !status) {
      setError("Employee ID, Benefit, and Status are required.");
      return;
    }
    if (reason.trim().length < 20) {
      setError("Reason must be at least 20 characters.");
      return;
    }
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await overrideEligibility({
        employeeId: employeeId.trim(),
        benefitId,
        status,
        reason: reason.trim() || null,
        expiresAt: expiresAt.trim() || null,
      });
      setSuccess(true);
      setReason("");
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Manual Eligibility Override
        </h1>
        <p className="mt-3 text-5 text-[#A7B6D3]">
          Override benefit eligibility with required documentation
        </p>
      </div>

      {error && <p className="text-sm text-red-400">Error: {error}</p>}
      {success && <p className="text-sm text-green-400">Override saved successfully.</p>}

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-8">
        <h2 className="text-10 font-semibold text-white">Create Override</h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-4 font-medium text-white">Employee ID *</label>
              <input
                type="text"
                placeholder="e.g. emp-1"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-4 font-medium text-white">Benefit *</label>
              <div className="relative">
                <select
                  value={benefitId}
                  onChange={(e) => setBenefitId(e.target.value)}
                  disabled={loadingBenefits}
                  className="h-14 w-full appearance-none rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 pr-14 text-l text-[#8595B6] outline-none focus:border-[#4B6FA8]"
                >
                  <option value="">Select a benefit</option>
                  {benefits.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#8595B6]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-4 font-medium text-white">Override Status *</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-14 w-full appearance-none rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 pr-14 text-l text-[#8595B6] outline-none focus:border-[#4B6FA8]"
              >
                <option value="">Select status</option>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#8595B6]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-4 font-medium text-white">Expires at (optional)</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 text-l text-white outline-none focus:border-[#4B6FA8]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-4 font-medium text-white">
              Reason for Override * (minimum 20 characters)
            </label>
            <textarea
              rows={4}
              placeholder="Provide a detailed reason for this manual override. This will be recorded in the audit log."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 py-3 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
            />
            <p className="text-xl text-[#7F90B1]">{reason.length} characters</p>
          </div>

          {status && (
            <div className="rounded-2xl border border-[#6B4A1A] bg-[#31261F] px-5 py-4 text-[#F2C548]">
              <div className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-6 w-6 shrink-0" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3 2 20h20L12 3Z" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
                <p className="text-l leading-snug">
                  This action will create an audit log entry and override the automatic eligibility rules. Ensure you have proper authorization before proceeding.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-[#2F66E8] text-4 font-medium text-white transition hover:bg-[#3E82F7] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Override Request"}
          </button>
        </form>
      </section>
    </div>
  );
}
