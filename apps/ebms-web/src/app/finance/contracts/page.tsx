"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { EmployeeContracts } from "./EmployeeContracts";
import { VendorContracts } from "./VendorContracts";

export default function FinanceContractsPage() {
  const [activeTab, setActiveTab] = useState<"employee" | "vendor">("employee");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/finance"
          className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Contracts
        </h1>
        <div
          className="mt-4 flex flex-wrap items-center gap-3"
          role="tablist"
          aria-label="Contract type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "employee"}
            onClick={() => setActiveTab("employee")}
            className={`rounded-xl font-medium transition ${
              activeTab === "employee"
                ? "text-[24px] text-slate-900 border-b border-[#2A9BFF] rounded-b-none dark:text-white"
                : "text-[24px] text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            Employee contract
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "vendor"}
            onClick={() => setActiveTab("vendor")}
            className={`rounded-xl px-3 py-2 font-medium transition ${
              activeTab === "vendor"
                ? "text-[24px] text-slate-900 border-b border-[#2A9BFF] rounded-b-none dark:text-white"
                : "text-[24px] text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            Vendor contract
          </button>
        </div>
        <p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
          {activeTab === "employee"
            ? "Manage employee contracts and track lifecycle status"
            : "Manage vendor contracts and track lifecycle status"}
        </p>
      </div>

      {activeTab === "employee" ? <EmployeeContracts /> : <VendorContracts />}
    </div>
  );
}
