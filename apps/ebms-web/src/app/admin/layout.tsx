import type { ReactNode } from "react";
import { HrSidebar } from "./_components/hr-sidebar";

export default function HrAdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen w-full bg-[#0F172A] text-white">
      <HrSidebar />
      <section className="flex-1 p-8 xl:p-10">{children}</section>
    </main>
  );
}
