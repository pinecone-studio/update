"use client";

import { useState } from "react";

export default function ManualOverridePage() {
  const [overrideType, setOverrideType] = useState("");

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

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-8">
        <h2 className="text-10 font-semibold text-white">Create Override</h2>

        <form className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-4 font-medium text-white">
                Employee ID *
              </label>
              <input
                type="text"
                placeholder="EMP-XXXX"
                className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-4 font-medium text-white">
                Employee Name
              </label>
              <input
                type="text"
                placeholder="Optional"
                className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-4 font-medium text-white">Benefit *</label>
            <div className="relative">
              <select className="h-14 w-full appearance-none rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 pr-14 text-l text-[#8595B6] outline-none focus:border-[#4B6FA8]">
                <option>Select a benefit</option>
                <option>Health Insurance</option>
                <option>401(k) Match</option>
                <option>Stock Options</option>
                <option>Commuter Benefits</option>
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#8595B6]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-4 font-medium text-white">
              Override Type *
            </label>
            <div className="relative">
              <select
                value={overrideType}
                onChange={(e) => setOverrideType(e.target.value)}
                className="h-14 w-full appearance-none rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 pr-14 text-l text-[#8595B6] outline-none focus:border-[#4B6FA8]"
              >
                <option value="">Select override type</option>
                <option value="temporary_exception">Temporary Exception</option>
                <option value="eligibility_grant">Eligibility Grant</option>
                <option value="eligibility_restriction">
                  Eligibility Restriction
                </option>
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#8595B6]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-4 font-medium text-white">
              Reason for Override * (minimum 20 characters)
            </label>
            <textarea
              rows={4}
              placeholder="Provide a detailed reason for this manual override. This will be recorded in the audit log."
              className="w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 py-3 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
            />
            <p className="text-xl text-[#7F90B1]">0 characters</p>
          </div>

          {overrideType && (
            <div className="rounded-2xl border border-[#6B4A1A] bg-[#31261F] px-5 py-4 text-[#F2C548]">
              <div className="flex items-start gap-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-0.5 h-6 w-6 shrink-0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3 2 20h20L12 3Z" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
                <p className="text-l leading-snug">
                  This action will create an audit log entry and override the
                  automatic eligibility rules. Ensure you have proper
                  authorization before proceeding.
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            className="h-14 w-full rounded-2xl bg-[#2F66E8] text-4 font-medium text-white transition hover:bg-[#3E82F7]"
          >
            Submit Override Request
          </button>
        </form>
      </section>
    </div>
  );
}
