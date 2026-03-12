/** @format */

import type { ReactNode } from "react";
import { FinanceSidebar } from "@/app/_components/finance-sidebar";

export default function FinanceLayout({ children }: { children: ReactNode }) {
	return (
		<main className="flex min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-white">
			<FinanceSidebar />
			<section className="flex-1">
				<div className="mx-auto w-full max-w-[1300px] p-8 xl:p-10">
					{children}
				</div>
			</section>
		</main>
	);
}
