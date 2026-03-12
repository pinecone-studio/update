"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineBell, HiOutlineChartPie, HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineDocumentText, HiOutlineXCircle } from "react-icons/hi2";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/app/_components/ThemeToggle";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/finance", icon: <HiOutlineChartPie className="h-4 w-4" /> },
  {
    label: "Rejected Requests",
    href: "/finance/rejected-requests",
    icon: <HiOutlineXCircle className="h-4 w-4" />,
  },
  {
    label: "Budget Overview",
    href: "/finance/budget-overview",
    icon: <HiOutlineCurrencyDollar className="h-4 w-4" />,
  },
  {
    label: "Vendor Payments",
    href: "/finance/vendor-payments",
    icon: <HiOutlineDocumentText className="h-4 w-4" />,
  },
  {
    label: "Audit Trail",
    href: "/finance/audit-trail",
    icon: <HiOutlineClock className="h-4 w-4" />,
  },
];

export function FinanceHeader() {
  const pathname = usePathname();
  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  const isActive = (href: string) =>
    normalizedPath === href ||
    (href !== "/finance" && normalizedPath.startsWith(href));

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white px-4 dark:border-[#24395C] dark:bg-[#1E293B]">
      <div className="mx-auto flex h-full w-full max-w-[1500px] items-center justify-between gap-4">
        <Link
          href="/finance"
          className="flex min-w-[220px] items-center gap-3 transition-opacity hover:opacity-90"
        >
          <img src="/logo.png" alt="EBMS Logo" className="h-8 w-auto" />
          <div className="leading-tight">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">EBMS</p>
            <p className="text-xs text-slate-600 dark:text-[#A7B6D3]">Finance Panel</p>
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
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex min-w-[220px] items-center justify-end gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:bg-[#24364F] dark:hover:text-white"
            aria-label="Notifications"
          >
            <HiOutlineBell className="h-5 w-5" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white dark:bg-[#2F66E8]">
            FM
          </div>
        </div>
      </div>
    </header>
  );
}
