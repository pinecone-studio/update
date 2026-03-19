/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import type { AuditEntry } from "../_lib/types";

type AuditLogHeaderProps = {
	entries: AuditEntry[];
};

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

export function AuditLogHeader({ entries }: AuditLogHeaderProps) {
	const [exportNotice, setExportNotice] = useState<string | null>(null);
	const [exporting, setExporting] = useState(false);
	const [exportMenuOpen, setExportMenuOpen] = useState(false);
	const timerRef = useRef<number | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) window.clearTimeout(timerRef.current);
		};
	}, []);

	useEffect(() => {
		if (!exportMenuOpen) return;
		const handleClickOutside = (event: MouseEvent) => {
			if (!menuRef.current?.contains(event.target as Node)) {
				setExportMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [exportMenuOpen]);

	const resetNotice = (message: string) => {
		setExportNotice(message);
		if (timerRef.current) window.clearTimeout(timerRef.current);
		timerRef.current = window.setTimeout(() => {
			setExportNotice(null);
			setExporting(false);
		}, 2400);
	};

	const buildExportRows = () =>
		entries.map((entry, index) => ({
			no: String(index + 1),
			time: entry.timestamp,
			processedBy: entry.performedBy,
			action: entry.action,
			benefit: entry.benefit,
			result: `${entry.oldStatus ?? "—"} -> ${entry.status}`,
			contract: entry.uploadedContractRequestId ? "Available" : "—",
			logId: entry.id,
		}));

	const handleExportCsv = () => {
		setExporting(true);
		setExportMenuOpen(false);
		const rows = buildExportRows();
		const headers = [
			"№",
			"Time",
			"Processed by",
			"Action",
			"Benefit",
			"Result",
			"Contract",
			"Log ID",
		];
		const csv = [
			headers.join(","),
			...rows.map((row) =>
				[
					row.no,
					row.time,
					row.processedBy,
					row.action,
					row.benefit,
					row.result,
					row.contract,
					row.logId,
				]
					.map((value) => `"${String(value).replaceAll('"', '""')}"`)
					.join(","),
			),
		].join("\n");

		downloadBlob(
			new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }),
			`audit-logs-${new Date().toISOString().slice(0, 10)}.csv`,
		);
		resetNotice("Excel export downloaded.");
	};

	const handleExportPdf = () => {
		setExporting(true);
		setExportMenuOpen(false);
		const rows = buildExportRows();
		const popup = window.open("", "_blank", "noopener,noreferrer,width=1200,height=900");
		if (!popup) {
			resetNotice("Popup blocked. Allow popups to export PDF.");
			return;
		}

		const tableRows = rows
			.map(
				(row) => `
					<tr>
						<td>${escapeHtml(row.no)}</td>
						<td>${escapeHtml(row.time)}</td>
						<td>${escapeHtml(row.processedBy)}</td>
						<td>${escapeHtml(row.action)}</td>
						<td>${escapeHtml(row.benefit)}</td>
						<td>${escapeHtml(row.result)}</td>
						<td>${escapeHtml(row.contract)}</td>
						<td>${escapeHtml(row.logId)}</td>
					</tr>`,
			)
			.join("");

		popup.document.open();
		popup.document.write(`
			<!doctype html>
			<html>
				<head>
					<meta charset="utf-8" />
					<title>Audit Logs Export</title>
					<style>
						body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
						h1 { margin: 0 0 8px; font-size: 24px; }
						p { margin: 0 0 20px; color: #475569; }
						table { width: 100%; border-collapse: collapse; font-size: 12px; }
						th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; vertical-align: top; }
						th { background: #f8fafc; }
					</style>
				</head>
				<body>
					<h1>Audit Logs</h1>
					<p>Exported ${new Date().toLocaleString()}</p>
					<table>
						<thead>
							<tr>
								<th>№</th>
								<th>Time</th>
								<th>Processed by</th>
								<th>Action</th>
								<th>Benefit</th>
								<th>Result</th>
								<th>Contract</th>
								<th>Log ID</th>
							</tr>
						</thead>
						<tbody>${tableRows}</tbody>
					</table>
					<script>
						window.onload = () => {
							window.print();
						};
					</script>
				</body>
			</html>
		`);
		popup.document.close();
		resetNotice("PDF print view opened.");
	};

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
			<div className="min-w-0">
				<h1 className="text-xl font-semibold text-slate-900 sm:text-2xl lg:text-[28px] dark:text-white">
					System Audit Log
				</h1>
				<p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
					Searchable audit trail for all system actions
				</p>
			</div>

			<div className="relative flex flex-col items-stretch gap-2 sm:items-end" ref={menuRef}>
				<button
					type="button"
					onClick={() => {
						if (entries.length === 0) {
							resetNotice("No audit logs to export.");
							return;
						}
						setExportMenuOpen((prev) => !prev);
					}}
					disabled={exporting || entries.length === 0}
					className="flex items-center justify-center gap-2 rounded-2xl bg-[#2F66E8] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3E82F7] disabled:opacity-70 sm:gap-3 sm:px-6 sm:py-3 sm:text-base"
				>
					{exporting ? (
						<>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								className="h-6 w-6 animate-spin"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle
									cx="12"
									cy="12"
									r="9"
									stroke="currentColor"
									strokeOpacity="0.25"
								/>
								<path d="M21 12a9 9 0 0 1-9 9" />
							</svg>
							Exporting...
						</>
					) : (
						<>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								className="h-6 w-6"
								stroke="currentColor"
								strokeWidth="1.8"
							>
								<path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
							</svg>
							Export Logs
						</>
					)}
				</button>
				{exportMenuOpen ? (
					<div className="absolute right-0 top-full z-10 mt-2 min-w-[190px] rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-[#2B3B55] dark:bg-[#111A2A]">
						<button
							type="button"
							onClick={handleExportCsv}
							className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
						>
							Export Excel (.csv)
						</button>
						<button
							type="button"
							onClick={handleExportPdf}
							className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
						>
							Export PDF
						</button>
					</div>
				) : null}
				{exportNotice ? (
					<div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-700 shadow-sm dark:border-[#2B3B55] dark:bg-[#111A2A] dark:text-slate-200">
						{exportNotice}
					</div>
				) : null}
			</div>
		</div>
	);
}
