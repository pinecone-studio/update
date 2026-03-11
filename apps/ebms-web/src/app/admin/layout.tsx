import type { ReactNode } from "react";
import { HrSidebar } from "@/app/_components/hr-sidebar";

export default function HrAdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen w-full bg-[#0F172A] text-white">
      <HrSidebar />
      <section className="flex-1">
        <div className="mx-auto w-full max-w-[1200px] p-8 xl:p-10">{children}</div>
      </section>
    </main>
  );
}
