import type { ReactNode } from "react";
import { Header } from "@/app/_components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: 'EBMS — Admin Dashboard',
	description: 'Pinequest S3 Ep1 — Employee Benefits Management System',
  };
  

export default function HrAdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#0f0a1e] text-slate-900 dark:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f0a1e_0%,#1a0e2e_52%,#0a1628_100%)]" />
        <div className="absolute left-[10%] top-[-6%] h-[620px] w-[620px] rounded-full bg-[linear-gradient(135deg,rgba(147,51,234,0.22),rgba(59,130,246,0.14))] blur-3xl" />
        <div className="absolute right-[14%] top-[24%] h-[520px] w-[520px] rounded-full bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(6,182,212,0.12))] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[36%] h-[720px] w-[720px] rounded-full bg-[linear-gradient(135deg,rgba(79,70,229,0.18),rgba(147,51,234,0.18))] blur-3xl" />
      </div>
      <Header />
      <section className="relative z-10 mx-auto flex min-h-0 flex-1 flex-col w-full max-w-[1500px] p-4 sm:p-6 xl:p-8">
        {children}
      </section>
    </main>
  );
}
