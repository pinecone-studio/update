"use client";

import { useState } from "react";

export default function TemporaryExceptionsPage() {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5 font-semibold text-white">
          Temporary Exception Management
        </h1>
        <p className="mt-3 text-5 text-[#A7B6D3]">
          Grant temporary exemptions from benefit eligibility rules
        </p>
      </div>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-8">
        <h2 className="text-5 font-semibold text-white">
          Create Temporary Exception
        </h2>

        <form className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-5 font-medium text-white">
                Employee ID *
              </label>
              <input
                type="text"
                placeholder="EMP-XXXX"
                className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-5 font-medium text-white">
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
            <label className="text-5 font-medium text-white">
              Exception Type *
            </label>
            <div className="relative">
              <select className="h-14 w-full appearance-none rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 pr-14 text-5 text-[#8595B6] outline-none focus:border-[#4B6FA8]">
                <option>Select exception type</option>
                <option>Medical Leave Exception</option>
                <option>Coverage Grace Period</option>
                <option>Policy Eligibility Waiver</option>
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-5 font-medium text-white">
                Start Date *
              </label>
              <div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 pr-4 text-l text-white outline-none [color-scheme:dark] focus:border-[#4B6FA8]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-5 font-medium text-white">
                Expiry Date *
              </label>
              <div>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 pr-4 text-l text-white outline-none [color-scheme:dark] focus:border-[#4B6FA8]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-5 font-medium text-white">
              Reason for Exception * (minimum 20 characters)
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a detailed reason for this temporary exception. This will be recorded in the audit log."
              className="w-full rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 py-3 text-l text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
            />
            <p className="text-5 text-[#7F90B1]">{reason.length} characters</p>
          </div>

          <button
            type="button"
            className="h-14 w-full rounded-2xl bg-[#2F66E8] text-5 font-medium text-white transition hover:bg-[#3E82F7]"
          >
            Create Exception
          </button>
        </form>
      </section>
    </div>
  );
}
