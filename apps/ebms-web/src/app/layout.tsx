/** @format */

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "./_components/ThemeProvider";

export const metadata: Metadata = {
	title: "EBMS — Employee Benefits Management",
	description: "Pinequest S3 Ep1 — Employee Benefits Management System",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={GeistSans.variable} suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){var t=localStorage.getItem('theme')||'light';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.classList.add(r)})()`,
					}}
				/>
			</head>
			<body className="font-sans bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-white">
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
