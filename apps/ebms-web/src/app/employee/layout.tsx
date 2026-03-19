/** @format */

import type { ReactNode } from "react";
import { Header } from "./components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "EBMS — Employee Dashboard",
	description: "Pinequest S3 Ep1 — Employee Benefits Management System",
};

export default function EmployeeLayout({ children }: { children: ReactNode }) {
	return (
		<main className="relative min-h-screen w-full overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)]">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute inset-0 bg-[linear-gradient(160deg,#faf9f7_0%,#f1f5f9_40%,#e8ecf4_100%)] dark:bg-[linear-gradient(135deg,#0f0a1e_0%,#1a0e2e_52%,#0a1628_100%)]" />
				<div className="absolute left-[10%] top-[-6%] h-[620px] w-[620px] rounded-full bg-[linear-gradient(135deg,rgba(147,51,234,0.06),rgba(59,130,246,0.04))] blur-3xl dark:bg-[linear-gradient(135deg,rgba(147,51,234,0.22),rgba(59,130,246,0.14))]" />
				<div className="absolute right-[14%] top-[24%] h-[520px] w-[520px] rounded-full bg-[linear-gradient(135deg,rgba(59,130,246,0.05),rgba(6,182,212,0.04))] blur-3xl dark:bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(6,182,212,0.12))]" />
				<div className="absolute bottom-[-10%] left-[36%] h-[720px] w-[720px] rounded-full bg-[linear-gradient(135deg,rgba(79,70,229,0.05),rgba(147,51,234,0.05))] blur-3xl dark:bg-[linear-gradient(135deg,rgba(79,70,229,0.18),rgba(147,51,234,0.18))]" />
			</div>
			<Header />
			<section className="relative z-10 mx-auto w-full max-w-[1512px] px-3 py-4 sm:px-5 sm:py-6 lg:px-6 xl:px-8">
				{children}
			</section>
		</main>
	);
}
