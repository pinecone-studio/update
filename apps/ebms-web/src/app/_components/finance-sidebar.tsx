"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/finance" },
  { label: "Rejected Requests", href: "/finance/rejected-requests" },
  { label: "Budget Overview", href: "/finance/budget-overview" },
  { label: "Vendor Payments", href: "/finance/vendor-payments" },
  { label: "Audit Trail", href: "/finance/audit-trail" },
];

export function FinanceSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/finance" && pathname.startsWith(href));

  return (
    <aside className="flex min-h-screen w-[280px] flex-col border-r border-slate-200 bg-white dark:border-[#2C4264] dark:bg-[#1E293B]">
      <div className="border-b border-slate-200 p-8 dark:border-[#2B405F]">
        <Link
          href="/finance"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <img src="/logo.png" alt="EBMS Logo" className="h-8 w-auto" />
          <div>
            <p className="text-2xl font-semibold tracking-wide text-slate-900 dark:text-white">UPDATE</p>
            <p className="mt-0.5 text-lg text-slate-600 dark:text-[#A7B6D3]">BETTER TOGETHER</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl px-4 py-3 text-lg transition ${
              isActive(item.href)
                ? "bg-blue-600 text-white dark:bg-[#2A8BFF]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#A7B6D3] dark:hover:bg-[#24364F] dark:hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-6 dark:border-[#2B405F]">
        <button className="w-full rounded-xl px-4 py-3 text-left text-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#A7B6D3] dark:hover:bg-[#24364F] dark:hover:text-white">
          Sign Out
        </button>
      </div>
    </aside>
  );
}
