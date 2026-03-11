"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HrAuditIcon } from "@/app/icons/hrAudit";
import { HrDashboardIcon } from "@/app/icons/hrDashboard";
import { HrEmployeeIcon } from "@/app/icons/hrEmployee";
import { HrManualIcon } from "@/app/icons/hrManual";
import { HrRulesIcon } from "@/app/icons/hrRules";
import { HrTemporaryIcon } from "@/app/icons/hrTemporary";
import { HrVendorIcon } from "@/app/icons/hrVendor";
import { HrActiveBenefitsIcon } from "@/app/icons/hrActiveBenefits";
import type { ReactNode } from "react";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <HrDashboardIcon /> },
  {
    label: "Employee Eligibility",
    href: "/admin/employee-eligibility",
    icon: <HrEmployeeIcon />,
  },
  {
    label: "Manual Override",
    href: "/admin/manual-override",
    icon: <HrManualIcon />,
  },
  {
    label: "Temporary Exceptions",
    href: "/admin/temporary-exceptions",
    icon: <HrTemporaryIcon />,
  },
  {
    label: "Rules Configuration",
    href: "/admin/rules-configuration",
    icon: <HrRulesIcon />,
  },
  {
    label: "Vendor Contracts",
    href: "/admin/vendor-contracts",
    icon: <HrVendorIcon />,
  },
  {
    label: "Add Benefit",
    href: "/admin/add-benefit",
    icon: <HrActiveBenefitsIcon />,
  },
  { label: "Audit Log", href: "/admin/audit-log", icon: <HrAuditIcon /> },
];

export function HrSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden min-h-screen flex-col border-r border-[#24395C] bg-[#1E293B] transition-all duration-300 xl:flex ${
        collapsed ? "w-[92px]" : "w-[360px]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#24395C] p-4">
        {!collapsed && (
          <div>
            <p className="text-xl font-semibold leading-none text-white">
              HR Admin Panel
            </p>
            <p className="mt-3 text-base font-medium leading-tight text-[#A7B6D3]">
              Benefits Management
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#32486A] text-[#D2DAEC] hover:bg-[#24364F]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            {collapsed ? <path d="m9 6 6 6-6 6" /> : <path d="m15 6-6 6 6 6" />}
          </svg>
        </button>
      </div>

      <nav className={`flex-1 space-y-2 overflow-y-auto py-6 ${collapsed ? "px-3" : "px-5"}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center rounded-2xl py-3 text-left font-medium transition ${
                collapsed ? "justify-center px-0" : "gap-4 px-5"
              } ${
                isActive
                  ? "bg-[#061541] text-white"
                  : "text-[#A7B6D3] hover:bg-[#061541] hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="whitespace-nowrap text-lg">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className={`mt-auto border-t border-[#24395C] ${collapsed ? "p-3" : "p-7"}`}
      >
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "gap-4"}`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2F66E8] text-lg font-semibold text-white">
            AD
          </div>
          {!collapsed && (
            <div>
              <p className="text-lg font-medium text-white">Admin User</p>
              <p className="text-base text-[#A7B6D3]">HR Administrator</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
