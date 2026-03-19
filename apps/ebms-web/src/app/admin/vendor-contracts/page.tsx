"use client";

import { useState } from "react";
import { EmployeeContracts } from "./EmployeeContracts";
import { VendorContracts } from "./VendorContracts";

export default function VendorContractsPage() {
  const [activeTab, setActiveTab] = useState<"employee" | "vendor">("employee");

  return (
    <div className="space-y-6">
      <div>
        <div
          className="flex flex-wrap items-center gap-3"
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
                ? "text-[24px] text-slate-900 border-b-2 border-blue-600 rounded-b-none dark:text-white dark:border-[#2A9BFF]"
                : "text-[24px] text-slate-600 hover:text-slate-800 dark:hover:text-white/80"
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
                ? "text-[24px] text-slate-900 border-b-2 border-blue-600 rounded-b-none dark:text-white dark:border-[#2A9BFF]"
                : "text-[24px] text-slate-600 hover:text-slate-800 dark:hover:text-white/80"
            }`}
          >
            Vendor contract
          </button>
        </div>
        <p className="mt-3 text-5 text-slate-600 dark:text-[var(--text-secondary)]">
          {activeTab === "employee"
            ? "Manage employee contracts and track lifecycle status"
            : "Manage vendor contracts and track lifecycle status"}
        </p>
      </div>

      {activeTab === "employee" ? <EmployeeContracts /> : <VendorContracts />}
    </div>
  );
}
