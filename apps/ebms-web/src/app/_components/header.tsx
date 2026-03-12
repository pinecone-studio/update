"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBell,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { HrAuditIcon } from "@/app/icons/hrAudit";
import { HrBenefitsRuleIcon } from "@/app/icons/hrBenefitsRule";
import { HrDashboardIcon } from "@/app/icons/hrDashboard";
import { HrEmployeeIcon } from "@/app/icons/hrEmployee";
import { HrVendorIcon } from "@/app/icons/hrVendor";
import { ThemeToggle } from "@/app/_components/ThemeToggle";
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
    label: "Benefits&Rule",
    href: "/admin/add-benefit",
    icon: <HrBenefitsRuleIcon />,
  },
  { label: "Audit Log", href: "/admin/audit-log", icon: <HrAuditIcon /> },
];

export function Header() {
  const adminName = "Admin User";
  const adminId = "admin-1";
  const pathname = usePathname();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  const isActive = (href: string) =>
    normalizedPath === href ||
    (href !== "/admin" && normalizedPath.startsWith(href));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              EBMS
            </p>
            <p className="text-xs text-slate-600 dark:text-[#A7B6D3]">
              Admin Panel
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isActive(item.href)
                  ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-[#2F66E8] dark:hover:bg-[#3E82F7]"
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
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:bg-[#24364F] dark:hover:text-white"
              aria-label="Notifications"
            >
              <HiOutlineBell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            {notificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-[#24395C] dark:bg-[#1E293B]">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Notifications
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-[#A7B6D3]">
                  No new admin notifications.
                </p>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setNotificationOpen(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white dark:bg-[#2F66E8]"
              aria-label="Profile"
            >
              AD
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#24395C] dark:bg-[#1E293B]">
                <div className="border-b border-slate-200 p-4 dark:border-[#24395C]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white dark:bg-[#2F66E8]">
                      AD
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {adminName}
                      </p>
                      <p className="mt-1 text-4 text-slate-500 dark:text-[#A7B6D3]">
                        {adminId}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-[#D1DBEF] dark:hover:bg-[#24364F]"
                  >
                    <HiOutlineUserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                  <div className="my-2 h-px bg-slate-200 dark:bg-[#24395C]" />
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                  >
                    <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                    Sign out
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
