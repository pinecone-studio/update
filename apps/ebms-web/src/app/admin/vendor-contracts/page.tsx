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
            className={`rounded-xl px-3 py-2 text-5 font-semibold transition ${
              activeTab === "employee"
                ? "bg-blue-600 text-white dark:bg-[#2F66E8]"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#24364F] dark:hover:text-white"
            }`}
          >
            Employee contract
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "vendor"}
            onClick={() => setActiveTab("vendor")}
            className={`rounded-xl px-3 py-2 text-5 font-semibold transition ${
              activeTab === "vendor"
                ? "bg-blue-600 text-white dark:bg-[#2F66E8]"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#24364F] dark:hover:text-white"
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
