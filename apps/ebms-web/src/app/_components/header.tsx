"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
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
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const normalizedPath = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  const isActive = (href: string) =>
    normalizedPath === href ||
    (href !== "/admin" && normalizedPath.startsWith(href));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                ? "text-white bg-blue-600"
                    : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="scale-90">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex min-w-[220px] items-center justify-end gap-3">
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F66E8] text-sm font-semibold text-white ring-1 ring-transparent transition hover:ring-blue-300 hover:bg-[#2563EB]"
              aria-label="Profile"
            >
              AD
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-[280px] rounded-xl border border-[#243041] bg-[#242A38] shadow-xl overflow-hidden z-50">
                <div className="p-4">
                  <p className="text-lg font-semibold text-white">John Doe</p>
                  <p className="mt-0.5 text-sm text-[#A7B6D3]">john.doe@company.com</p>
                  <p className="mt-1 text-xs text-[#8B9BB8]">EMP-2024-1234</p>
                </div>
                <div className="border-t border-dotted border-[#3D4A5C] px-2 py-2">
                  <Link
                    href="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-white transition hover:bg-[#2F3A4A]"
                  >
                    <HiOutlineUserCircle className="text-lg" />
                    My Profile
                  </Link>
                  <Link
                    href="/admin/"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-white transition hover:bg-[#2F3A4A]"
                  >
                    <HiOutlineCog6Tooth className="text-lg" />
                    Settings
                  </Link>
                </div>
                <div className="border-t border-dotted border-[#3D4A5C] px-2 py-2">
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[#F87171] transition hover:bg-red-500/10"
                  >
                    <HiOutlineArrowRightOnRectangle className="text-lg" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
