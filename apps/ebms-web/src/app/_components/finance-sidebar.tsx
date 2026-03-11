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
    <aside className="flex min-h-screen w-[280px] flex-col border-r border-slate-800 bg-[#060E22]">
      <div className="border-b border-slate-800 p-8">
        <p className="text-2xl font-semibold tracking-wide text-white">UPDATE</p>
        <p className="mt-2 text-lg text-slate-400">BETTER TOGETHER</p>
      </div>

      <nav className="flex-1 space-y-2 px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl px-4 py-3 text-lg transition ${
              isActive(item.href)
                ? "bg-[#1A1F52] text-[#5EA2FF]"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-6">
        <button className="w-full rounded-xl px-4 py-3 text-left text-lg text-slate-300 hover:bg-slate-900 hover:text-white">
          Sign Out
        </button>
      </div>
    </aside>
  );
}
