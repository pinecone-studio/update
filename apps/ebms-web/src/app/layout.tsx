/** @format */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import { ThemeProvider } from "./_components/ThemeProvider";
import { GeistSans } from "geist/font/sans";

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
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){var t=localStorage.getItem('theme')||'dark';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.classList.add(r)})()`,
					}}
				/>
			</head>
			<body
				className={`${GeistSans.className} font-sans bg-[var(--bg-page)] text-[var(--text-primary)] antialiased`}
			>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
