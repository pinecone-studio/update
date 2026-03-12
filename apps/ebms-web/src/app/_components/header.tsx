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
import { ThemeToggle } from "@/app/_components/ThemeToggle";
import type { ReactNode } from "react";
import { fetchMe } from "../employee/_lib/api";

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
  const [me, setMe] = useState<{ name: string; id: string } | null>(null);
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
  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((data) => {
        if (!cancelled) setMe({ name: data.name, id: data.id });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white px-4 dark:border-[#24395C] dark:bg-[#1E293B]">
      <div className="mx-auto flex h-full w-full max-w-[1500px] items-center justify-between gap-4">
        <Link
          href="/admin"
          className="flex min-w-[220px] items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <img src="/logo.png" alt="EBMS Logo" className="h-8 w-auto" />
          <div className="leading-tight">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">EBMS</p>
            <p className="text-xs text-slate-600 dark:text-[#A7B6D3]">Admin Panel</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isActive(item.href)
                  ? "bg-blue-600 text-white dark:bg-[#2F66E8]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:bg-[#24364F] dark:hover:text-white"
              }`}
            >
              <span className="scale-90">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex min-w-[220px] items-center justify-end gap-3">
          <ThemeToggle />
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-500 dark:bg-[#2F66E8] dark:hover:bg-[#3d73f0]"
              aria-label="Profile"
            >
            {me?.name?.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase() ?? "AD"}
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#243041] dark:bg-[#1A2333] z-50">
                <div className="border-b border-slate-200 p-4 dark:border-[#243041]">
                  <p className="font-semibold text-slate-900 dark:text-white">{me?.name ?? "—"}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  {me?.id ?? "—"}
                  </p>
                </div>
                <div className="p-2">
                  <Link
                    href="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <HiOutlineUserCircle className="text-lg" />
                    My Profile
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <HiOutlineCog6Tooth className="text-lg" />
                    Settings
                  </Link>
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition hover:bg-red-500/10 dark:text-red-400"
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
