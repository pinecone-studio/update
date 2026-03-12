/** @format */

import type { ReactNode } from "react";
import { FinanceHeader } from "@/app/_components/finance-header";

export default function FinanceLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-white">
      <FinanceHeader />
      <section className="mx-auto w-full max-w-[1500px] p-8 xl:p-10">
        {children}
      </section>
    </main>
  );
}
