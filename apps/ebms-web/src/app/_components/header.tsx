"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HrActiveBenefitsIcon } from "@/app/icons/hrActiveBenefits";
import { HrAuditIcon } from "@/app/icons/hrAudit";
import { HrDashboardIcon } from "@/app/icons/hrDashboard";
import { HrEmployeeIcon } from "@/app/icons/hrEmployee";
import { HrVendorIcon } from "@/app/icons/hrVendor";
import type { ReactNode } from "react";

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

export function Header() {
  const pathname = usePathname();
  const normalizedPath = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  const isActive = (href: string) =>
    normalizedPath === href ||
    (href !== "/admin" && normalizedPath.startsWith(href));

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[#24395C] bg-[#1E293B] px-4">
      <div className="mx-auto flex h-full w-full max-w-[1500px] items-center justify-between gap-4">
        <div className="flex min-w-[220px] items-center gap-3">
          <img src="/logo.png" alt="EBMS Logo" className="h-8 w-auto" />
          <div className="leading-tight">
            <p className="text-lg font-semibold text-white">EBMS</p>
            <p className="text-xs text-[#A7B6D3]">Admin Panel</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isActive(item.href)
                  ? "bg-[#2F66E8] text-white"
                  : "text-[#D1DBEF] hover:bg-[#24364F] hover:text-white"
              }`}
            >
              <span className="scale-90">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex min-w-[220px] items-center justify-end gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F66E8] text-sm font-semibold text-white">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
