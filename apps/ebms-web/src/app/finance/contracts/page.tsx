"use client";

import { useState } from "react";
import { EmployeeContracts } from "./EmployeeContracts";
import { VendorContracts } from "./VendorContracts";

export default function FinanceContractsPage() {
  const [activeTab, setActiveTab] = useState<"employee" | "vendor">("employee");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div
          className="flex flex-wrap items-center gap-2 sm:gap-3"
          role="tablist"
          aria-label="Contract type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "employee"}
            onClick={() => setActiveTab("employee")}
            className={`rounded-xl px-3 py-2 text-base font-medium transition sm:text-lg lg:text-[24px] ${
              activeTab === "employee"
                ? "text-slate-900 border-b border-[#2A9BFF] rounded-b-none dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            Employee contract
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "vendor"}
            onClick={() => setActiveTab("vendor")}
            className={`rounded-xl px-3 py-2 text-base font-medium transition sm:text-lg lg:text-[24px] ${
              activeTab === "vendor"
                ? "text-slate-900 border-b border-[#2A9BFF] rounded-b-none dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            Vendor contract
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-base dark:text-[#A7B6D3]">
          {activeTab === "employee"
            ? "Manage employee contracts and track lifecycle status"
            : "Manage vendor contracts and track lifecycle status"}
        </p>
      </div>

      {activeTab === "employee" ? <EmployeeContracts /> : <VendorContracts />}
    </div>
  );
}
