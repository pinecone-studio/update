/** @format */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
	FiCheck,
	FiStar,
	FiActivity,
	FiLock,
	FiMessageCircle,
	FiHelpCircle,
	FiSend,
} from "react-icons/fi";
import { BenefitPortfolio } from "@/app/_components/BenefitPortfolio";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import { Header } from "./components/Header";
import { EmployeeDashboardSkeleton } from "./components/EmployeeDashboardSkeleton";
import {
	fetchMe,
	fetchMyBenefits,
	requestBenefit,
	getApiErrorMessage,
} from "./_lib/api";
import { mapMyBenefitsToCardProps } from "./_lib/mapBenefits";
import { IoClose } from "react-icons/io5";

const CardIcon = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className: string;
}) => (
	<div
		className={`flex items-center justify-center w-12 h-12 rounded-lg ${className}`}
	>
		{children}
	</div>
);

export default function EmployeeDashboardPage() {
	const [me, setMe] = useState<{ name: string; okrSubmitted: boolean } | null>(
		null,
	);
	const [benefits, setBenefits] = useState<BenefitCardProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [feedbackPanelOpen, setFeedbackPanelOpen] = useState(false);
	const [panelTab, setPanelTab] = useState<"ask" | "feedback">("ask");
	const [feedbackMessage, setFeedbackMessage] = useState("");
	const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
	const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
	const [chatQuestion, setChatQuestion] = useState("");
	const [chatMessages, setChatMessages] = useState<
		{ role: "user" | "assistant"; text: string }[]
	>([
		{
			role: "assistant",
			text: "Hi! I can help you understand how the benefits portal works. Ask me anything—for example: How do I request a benefit? What does Active vs Eligible mean?",
		},
	]);
	const [statusFilter, setStatusFilter] = useState<
		"ACTIVE" | "ELIGIBLE" | "PENDING" | "LOCKED" | "ALL"
	>("ACTIVE");

	const load = useCallback(async (opts?: { silent?: boolean }) => {
		if (!opts?.silent) {
			setLoading(true);
			setError(null);
		}
		try {
			const [meRes, myBenefitsRes] = await Promise.all([
				fetchMe(),
				fetchMyBenefits(),
			]);
			setMe({ name: meRes.name, okrSubmitted: meRes.okrSubmitted });
			const mapped = mapMyBenefitsToCardProps(myBenefitsRes);
			setBenefits((prev) => {
				// Preserve optimistic PENDING (backend may still return ELIGIBLE for requested benefits)
				if (prev.length === 0) return mapped;
				return mapped.map((fresh) => {
					const existing = prev.find((p) => p.benefitId === fresh.benefitId);
					if (existing?.status === "PENDING" && fresh.status === "ELIGIBLE") {
						return existing;
					}
					return fresh;
				});
			});
		} catch (e) {
			if (!opts?.silent) {
				setError(getApiErrorMessage(e));
				setBenefits([]);
			}
		} finally {
			if (!opts?.silent) {
				setLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	// Refetch when tab becomes visible (e.g. after admin approves)
	useEffect(() => {
		const onVisibility = () => {
			if (document.visibilityState === "visible") load({ silent: true });
		};
		document.addEventListener("visibilitychange", onVisibility);
		return () => document.removeEventListener("visibilitychange", onVisibility);
	}, [load]);

	const handleRequestBenefit = useCallback(
		async (benefit: BenefitCardProps) => {
			if (!benefit.benefitId) return;
			const confirmed = window.confirm(
				`Та "${benefit.name}" benefit-ийг хүсэхдээ итгэлтэй байна уу?`,
			);
			if (!confirmed) return;
			try {
				const popup =
					benefit.requiresContract
						? window.open("", "_blank", "noopener,noreferrer")
						: null;
				await requestBenefit(benefit.benefitId, {
					benefitName: benefit.name,
					employeeName: me?.name ?? undefined,
					contractPopup: popup,
				});
				// Optimistically update and switch to PENDING so user sees their request
				setBenefits((prev) =>
					prev.map((b) =>
						b.benefitId === benefit.benefitId
							? { ...b, status: "PENDING" as const }
							: b,
					),
				);
				setStatusFilter("PENDING");
				// Silent refresh to sync with backend (no loading spinner)
				await load({ silent: true });
			} catch (e) {
				alert(getApiErrorMessage(e));
			}
		},
		[load, me?.name],
	);

	const activeCount = benefits.filter((b) => b.status === "ACTIVE").length;
	const eligibleCount = benefits.filter((b) => b.status === "ELIGIBLE").length;
	const lockedCount = benefits.filter((b) => b.status === "LOCKED").length;
	const pendingCount = benefits.filter((b) => b.status === "PENDING").length;

	const filteredBenefits =
		statusFilter === "ALL"
			? benefits
			: benefits.filter((b) => b.status === statusFilter);

	const statusOrder: Record<BenefitCardProps["status"], number> = {
		ACTIVE: 0,
		ELIGIBLE: 1,
		PENDING: 2,
		LOCKED: 3,
		REJECTED: 4,
	};
	const orderedBenefits = [...filteredBenefits].sort((a, b) => {
		const byStatus = statusOrder[a.status] - statusOrder[b.status];
		if (byStatus !== 0) return byStatus;
		return (a.category ?? "").localeCompare(b.category ?? "");
	});

	const handleFeedbackSubmit = useCallback(async () => {
		if (!feedbackMessage.trim()) return;
		setFeedbackSubmitting(true);
		try {
			// Placeholder: wire to feedback API when available
			await new Promise((r) => setTimeout(r, 500));
			setFeedbackSubmitted(true);
			setFeedbackMessage("");
		} finally {
			setFeedbackSubmitting(false);
		}
	}, [feedbackMessage]);

	const FAQ_RESPONSES: Record<string, string> = {
		request:
			"To request a benefit: 1) Click on an Eligible benefit card, 2) Click 'Request benefit', 3) Confirm. Your request goes to the admin for approval. You'll see it as Pending until approved.",
		active:
			"Active benefits are ones you're already enrolled in. You can manage them from the benefit card.",
		eligible:
			"Eligible means you meet the requirements and can request this benefit. Click 'Request benefit' to apply.",
		pending:
			"Pending benefits are requests you've submitted that are awaiting admin approval. Check back later or you'll get notified when approved.",
		locked:
			"Locked benefits are ones you don't qualify for yet (e.g., tenure, OKR score). Click a card to see why it's locked and what you need to do.",
		dashboard:
			"The dashboard shows your benefit counts (Active, Eligible, Pending, Locked). Click a stat card to filter the list. Use the 'All' button to see everything.",
		default:
			"I'm here to help with the benefits portal. Try asking: How do I request a benefit? What does Active vs Eligible mean? What are Pending benefits?",
	};

	const handleAskSubmit = useCallback(() => {
		if (!chatQuestion.trim()) return;
		const q = chatQuestion.trim().toLowerCase();
		setChatMessages((prev) => [...prev, { role: "user", text: chatQuestion }]);
		setChatQuestion("");

		// Simple keyword matching for FAQ
		let reply = FAQ_RESPONSES.default;
		if (q.includes("request") || q.includes("how do i") || q.includes("apply"))
			reply = FAQ_RESPONSES.request;
		else if (q.includes("active")) reply = FAQ_RESPONSES.active;
		else if (q.includes("eligible")) reply = FAQ_RESPONSES.eligible;
		else if (q.includes("pending")) reply = FAQ_RESPONSES.pending;
		else if (q.includes("locked")) reply = FAQ_RESPONSES.locked;
		else if (
			q.includes("dashboard") ||
			q.includes("how does") ||
			q.includes("work")
		)
			reply = FAQ_RESPONSES.dashboard;

		setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
	}, [chatQuestion]);

	return (
		<div>
			<div className="min-h-screen w-full bg-slate-50 p-8 dark:bg-[#0f172a] flex flex-col items-center">
				<div className="flex flex-col w-full max-w-[1500px]">
					<div className="flex flex-col mb-8">
						<h1 className="text-[24px] font-bold text-slate-900 leading-tight dark:text-white">
							Welcome back, {me?.name ?? "..."}!
						</h1>
						<p className="text-base text-slate-600 mt-1 dark:text-[#AAAAAA]">
							Your complete benefits portfolio and eligibility status
						</p>
						{error && (
							<p className="mt-2 text-sm text-red-400">Error: {error}</p>
						)}
					</div>

					{loading ? (
						<EmployeeDashboardSkeleton benefitCount={benefits.length || 4} />
					) : (
						<>
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-12 w-full min-h-0">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-7 min-h-0">
									<button
										type="button"
										onClick={() => setStatusFilter("ACTIVE")}
										className={`min-w-0 rounded-[10px] bg-white border p-6 flex flex-col min-h-[134px] text-left transition-all dark:bg-[#334155] ${
											statusFilter === "ACTIVE"
												? "border-[#4CAF50] ring-2 ring-[#4CAF50]/30 dark:border-[#4CAF50]"
												: "border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-slate-600"
										}`}
									>
										<div className="flex justify-between items-start">
											<div>
												<p className="text-sm text-slate-600 dark:text-[#99A1AF]">
													Active Benefits
												</p>
												<p className="text-[48px] font-bold text-slate-900 leading-none mt-1 dark:text-white">
													{activeCount}
												</p>
												<p className="text-sm text-slate-600 mt-1 dark:text-[#99A1AF]">
													Currently enrolled
												</p>
											</div>
											<CardIcon className="bg-[#4CAF50]/20">
												<FiCheck size={24} color="#4CAF50" strokeWidth={2.5} />
											</CardIcon>
										</div>
									</button>

									<button
										type="button"
										onClick={() => setStatusFilter("ELIGIBLE")}
										className={`min-w-0 rounded-[10px] bg-white border p-6 flex flex-col min-h-[134px] text-left transition-all dark:bg-[#334155] ${
											statusFilter === "ELIGIBLE"
												? "border-[#2196F3] ring-2 ring-[#2196F3]/30 dark:border-[#2196F3]"
												: "border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-slate-600"
										}`}
									>
										<div className="flex justify-between items-start">
											<div>
												<p className="text-sm text-slate-600 dark:text-[#99A1AF]">
													Eligible Benefits
												</p>
												<p className="text-[48px] font-bold text-slate-900 leading-none mt-1 dark:text-white">
													{eligibleCount}
												</p>
												<p className="text-sm text-slate-600 mt-1 dark:text-[#99A1AF]">
													Ready to request
												</p>
											</div>
											<CardIcon className="bg-[#2196F3]/20">
												<FiStar size={24} color="#2196F3" strokeWidth={2} />
											</CardIcon>
										</div>
									</button>

									<button
										type="button"
										onClick={() => setStatusFilter("PENDING")}
										className={`min-w-0 rounded-[10px] bg-white border p-6 flex flex-col min-h-[134px] text-left transition-all dark:bg-[#334155] ${
											statusFilter === "PENDING"
												? "border-[#f59e0b] ring-2 ring-[#f59e0b]/30 dark:border-[#f59e0b]"
												: "border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-slate-600"
										}`}
									>
										<div className="flex justify-between items-start">
											<div>
												<p className="text-sm text-slate-600 dark:text-[#99A1AF]">
													Pending Benefits
												</p>
												<p className="text-[48px] font-bold text-slate-900 leading-none mt-1 dark:text-white">
													{pendingCount}
												</p>
												<p className="text-sm text-slate-600 mt-1 dark:text-[#99A1AF]">
													Awaiting approval
												</p>
											</div>
											<CardIcon className="bg-[#f59e0b]/20">
												<FiActivity size={24} color="#f59e0b" strokeWidth={2} />
											</CardIcon>
										</div>
									</button>

									<button
										type="button"
										onClick={() => setStatusFilter("LOCKED")}
										className={`min-w-0 rounded-[10px] bg-white border p-6 flex flex-col min-h-[134px] text-left transition-all dark:bg-[#334155] ${
											statusFilter === "LOCKED"
												? "border-[#dc2626] ring-2 ring-[#dc2626]/30 dark:border-[#dc2626]"
												: "border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-slate-600"
										}`}
									>
										<div className="flex justify-between items-start">
											<div>
												<p className="text-sm text-slate-600 dark:text-[#99A1AF]">
													Locked Benefits
												</p>
												<p className="text-[48px] font-bold text-slate-900 leading-none mt-1 dark:text-white">
													{lockedCount}
												</p>
												<p className="text-sm text-slate-600 mt-1 dark:text-[#99A1AF]">
													Requirements not met
												</p>
											</div>
											<CardIcon className="bg-[#dc2626]/20">
												<FiLock size={24} color="#dc2626" strokeWidth={2} />
											</CardIcon>
										</div>
									</button>
								</div>

								<div className="rounded-2xl bg-white border border-slate-200/80 p-5 dark:bg-slate-800/50 dark:border-slate-700/80 lg:col-span-5 h-[480px] flex flex-col overflow-hidden">
									<div className="flex-shrink-0 mb-4 flex flex-wrap items-center justify-between gap-3">
										<h2 className="text-lg font-semibold text-slate-900 dark:text-white">
											Benefit Portfolio
										</h2>
										<button
											type="button"
											onClick={() => setStatusFilter("ALL")}
											className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
												statusFilter === "ALL"
													? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
													: "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
											}`}
										>
											All
										</button>
									</div>
									<div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden -mx-1 px-1">
										<BenefitPortfolio
											benefits={orderedBenefits}
											onRequestBenefit={handleRequestBenefit}
											compact
										/>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
				{!feedbackPanelOpen && (
					<button
						type="button"
						className="fixed bottom-14 right-14 w-16 h-16 bg-slate-800 border border-gray-300 rounded-full flex justify-center items-center hover:bg-slate-700 duration-200 cursor-pointer text-white shadow-lg dark:bg-[#1E293B] dark:hover:bg-[#334155]"
						onClick={() => setFeedbackPanelOpen(true)}
						aria-label="Help & Feedback"
					>
						<FiMessageCircle size={28} />
					</button>
				)}
				{feedbackPanelOpen && (
					<div className="fixed bottom-14 right-14 w-[340px] h-[420px] bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
						<div className="bg-[#2196F3] dark:bg-[#1976D2] w-full rounded-t-2xl flex flex-col">
							<div className="flex items-center justify-between px-4 h-14">
								<div className="flex items-center gap-2">
									<FiMessageCircle size={22} className="text-white" />
									<span className="font-semibold text-white">
										Help & Feedback
									</span>
								</div>
								<button
									type="button"
									className="w-9 h-9 rounded-full flex justify-center items-center hover:bg-white/20 transition-colors text-white"
									onClick={() => setFeedbackPanelOpen(false)}
									aria-label="Close"
								>
									<IoClose size={24} />
								</button>
							</div>
							<div className="flex gap-0 px-2 pb-2">
								<button
									type="button"
									onClick={() => setPanelTab("ask")}
									className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-t-lg text-sm font-medium transition ${
										panelTab === "ask"
											? "bg-white/20 text-white"
											: "text-white/80 hover:text-white hover:bg-white/10"
									}`}
								>
									<FiHelpCircle size={18} />
									Ask a question
								</button>
								<button
									type="button"
									onClick={() => setPanelTab("feedback")}
									className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-t-lg text-sm font-medium transition ${
										panelTab === "feedback"
											? "bg-white/20 text-white"
											: "text-white/80 hover:text-white hover:bg-white/10"
									}`}
								>
									<FiMessageCircle size={18} />
									Send feedback
								</button>
							</div>
						</div>
						<div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-slate-50 dark:bg-[#0f172a]">
							{panelTab === "ask" ? (
								<>
									<div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
										{chatMessages.map((m, i) => (
											<div
												key={i}
												className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
											>
												<div
													className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
														m.role === "user"
															? "bg-[#2196F3] text-white rounded-br-md"
															: "bg-white dark:bg-[#334155] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-md"
													}`}
												>
													{m.text}
												</div>
											</div>
										))}
									</div>
									<div className="flex-shrink-0 p-3 border-t border-slate-200 dark:border-slate-700">
										<div className="flex gap-2">
											<input
												type="text"
												value={chatQuestion}
												onChange={(e) => setChatQuestion(e.target.value)}
												onKeyDown={(e) =>
													e.key === "Enter" && !e.shiftKey && handleAskSubmit()
												}
												placeholder="Ask how the portal works..."
												className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] dark:border-slate-600 dark:bg-[#1E293B] dark:text-white dark:placeholder:text-slate-500"
											/>
											<button
												type="button"
												onClick={handleAskSubmit}
												disabled={!chatQuestion.trim()}
												className="px-4 py-2.5 rounded-lg bg-[#2196F3] text-white hover:bg-[#1976D2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
											>
												<FiSend size={18} />
											</button>
										</div>
									</div>
								</>
							) : (
								<div className="flex-1 min-h-0 overflow-hidden p-4 flex flex-col">
									{feedbackSubmitted ? (
										<div className="flex flex-col items-center justify-center py-6 text-center">
											<CardIcon className="bg-[#4CAF50]/20 mb-4">
												<FiCheck size={24} color="#4CAF50" strokeWidth={2.5} />
											</CardIcon>
											<p className="text-slate-900 font-medium dark:text-white">
												Thank you for your feedback!
											</p>
											<p className="text-sm text-slate-600 mt-1 dark:text-[#99A1AF]">
												We appreciate you taking the time to share your
												thoughts.
											</p>
											<button
												type="button"
												onClick={() => setFeedbackSubmitted(false)}
												className="mt-4 text-sm text-[#2196F3] hover:text-[#1976D2] dark:text-[#60A5FA] dark:hover:text-[#93C5FD] underline"
											>
												Submit another feedback
											</button>
										</div>
									) : (
										<div className="flex flex-col gap-3 min-h-0">
											<p className="text-sm text-slate-600 dark:text-[#94A3B8] flex-shrink-0">
												Share your thoughts to help us improve the benefits
												experience.
											</p>
											<div>
												<label className="block text-sm font-medium text-slate-700 dark:text-[#E2E8F0] mb-1">
													Your feedback
												</label>
												<textarea
													value={feedbackMessage}
													onChange={(e) => setFeedbackMessage(e.target.value)}
													placeholder="Tell us what we can improve..."
													rows={4}
													className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#2196F3] focus:outline-none focus:ring-1 focus:ring-[#2196F3] dark:border-slate-600 dark:bg-[#0f172a] dark:text-white dark:placeholder:text-slate-500 resize-none"
												/>
											</div>
											<button
												type="button"
												onClick={handleFeedbackSubmit}
												disabled={!feedbackMessage.trim() || feedbackSubmitting}
												className="w-full px-5 py-2.5 rounded-lg bg-[#2196F3] text-white font-medium hover:bg-[#1976D2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 flex-shrink-0"
											>
												<FiMessageCircle size={18} />
												{feedbackSubmitting
													? "Submitting..."
													: "Submit Feedback"}
											</button>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
