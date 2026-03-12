/** @format */

import type { ReactNode } from "react";
import { Header } from "./components/Header";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
	return (
		<main className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-white">
			<Header />
			<section className="mx-auto w-full max-w-[1500px] p-6 xl:p-8">
				{children}
			</section>
		</main>
	);
}
