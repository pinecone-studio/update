/** @format */

"use client";

import { useEffect, useState, useCallback } from "react";
import { FiCheck, FiStar, FiActivity, FiLock } from "react-icons/fi";
import { BenefitPortfolio } from "@/app/_components/BenefitPortfolio";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import { Header } from "./components/Header";
import {
	fetchMe,
	fetchMyBenefits,
	requestBenefit,
	getApiErrorMessage,
	getEmployeeId,
} from "./_lib/api";
import { mapMyBenefitsToCardProps } from "./_lib/mapBenefits";
import { getApprovedBenefitIdsForEmployee } from "@/app/_lib/localBenefitRequests";
import { BsChat } from "react-icons/bs";
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
	const [chatbot, setChatbot] = useState(false);

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
			const approvedIds = getApprovedBenefitIdsForEmployee(getEmployeeId());
			const withApproved = mapped.map((b) =>
				b.status === "PENDING" &&
				b.benefitId &&
				approvedIds.includes(b.benefitId)
					? { ...b, status: "ACTIVE" as const }
					: b
			);
			setBenefits((prev) => {
				// Preserve optimistic PENDING (backend may still return ELIGIBLE for requested benefits)
				if (prev.length === 0) return withApproved;
				return withApproved.map((fresh) => {
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

	// Admin approves → PENDING → ACTIVE (storage, visibility, custom event)
	useEffect(() => {
		const applyApproved = () => {
			setBenefits((prev) => {
				const approvedIds = getApprovedBenefitIdsForEmployee(getEmployeeId());
				return prev.map((b) =>
					b.status === "PENDING" &&
					b.benefitId &&
					approvedIds.includes(b.benefitId)
						? { ...b, status: "ACTIVE" as const }
						: b
				);
			});
		};
		window.addEventListener("storage", applyApproved);
		window.addEventListener("admin-approved-benefit", applyApproved);
		const onVisibility = () => {
			if (document.visibilityState === "visible") applyApproved();
		};
		document.addEventListener("visibilitychange", onVisibility);
		return () => {
			window.removeEventListener("storage", applyApproved);
			window.removeEventListener("admin-approved-benefit", applyApproved);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, []);

	const handleRequestBenefit = useCallback(
		async (benefit: BenefitCardProps) => {
			if (!benefit.benefitId) return;
			try {
				await requestBenefit(benefit.benefitId, {
					benefitName: benefit.name,
					employeeName: me?.name ?? undefined,
				});
				// Optimistically update button to "Request sent" (visible immediately)
				setBenefits((prev) =>
					prev.map((b) =>
						b.benefitId === benefit.benefitId
							? { ...b, status: "PENDING" as const }
							: b,
					),
				);
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

	return (
		<div>
			<div className="min-h-screen w-full bg-slate-50 p-8 dark:bg-[#0f172a] flex flex-col items-center">
				<div className="flex flex-col w-full max-w-[1500px]">
					<div className="flex flex-col mb-8">
						<h1 className="text-[32px] font-bold text-slate-900 leading-tight dark:text-white">
							Welcome back, {me?.name ?? "..."}!
						</h1>
						<p className="text-base text-slate-600 mt-1 dark:text-[#AAAAAA]">
							Your complete benefits portfolio and eligibility status
						</p>
						{error && <p className="mt-2 text-sm text-red-400">Error: {error}</p>}
					</div>

					{loading ? (
					<p className="text-slate-600 dark:text-[#94A3B8]">Loading...</p>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
							<div className="min-w-0 rounded-[10px] bg-white border border-slate-200 p-6 flex flex-col min-h-[134px] dark:bg-[#334155] dark:border-transparent">
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
							</div>

							<div className="min-w-0 rounded-[10px] bg-white border border-slate-200 p-6 flex flex-col min-h-[134px] dark:bg-[#334155] dark:border-transparent">
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
							</div>

							<div className="min-w-0 rounded-[10px] bg-white border border-slate-200 p-6 flex flex-col min-h-[134px] dark:bg-[#334155] dark:border-transparent">
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
							</div>

							<div className="min-w-0 rounded-[10px] bg-white border border-slate-200 p-6 flex flex-col min-h-[134px] dark:bg-[#334155] dark:border-transparent">
								<div className="flex justify-between items-start">
									<div>
										<p className="text-sm text-slate-600 dark:text-[#99A1AF]">
											OKR Performance
										</p>
										<p className="text-[48px] font-bold text-slate-900 leading-none mt-1 dark:text-white">
											{me?.okrSubmitted ? "—" : "—"}
										</p>
										<p className="text-sm text-slate-600 mt-1 dark:text-[#99A1AF]">
											{me?.okrSubmitted ? "OKR submitted" : "OKR not submitted"}
										</p>
									</div>
									<CardIcon className="bg-[#9C27B0]/20">
										<FiActivity size={24} color="#9C27B0" strokeWidth={2} />
									</CardIcon>
								</div>
							</div>
						</div>

						<div className="mt-8 mb-6">
							<h2 className="text-xl text-slate-900 font-semibold dark:text-white">
								Benefit Portfolio
							</h2>
						</div>

						<BenefitPortfolio
							benefits={benefits}
							onRequestBenefit={handleRequestBenefit}
						/>
					</>
				)}
				</div>
				{!chatbot && (
					<div
						className="fixed bottom-14 right-14 w-16 h-16 bg-[#1E293B] border border-gray-300 rounded-full flex justify-center items-center hover:bg-white duration-200 cursor-pointer hover:text-black"
						onClick={() => setChatbot(true)}
					>
						{" "}
						<BsChat size={25} />{" "}
					</div>
				)}
				{chatbot && (
					<div className="fixed bottom-14 right-14 w-[350px] h-[500px] bg-white rounded-2xl">
						<div className="bg-[#99A1AF] w-full h-[70px] rounded-t-2xl flex items-center justify-between pl-3 pr-3">
							<div className="w-12 h-12 bg-[#1E293B] rounded-full flex justify-center items-center">
								{" "}
								<BsChat size={20} />{" "}
							</div>
							<button
								className="w-[40px] h-[40px] bg-[#1E293B] rounded-full flex justify-center items-center hover:bg-white hover:text-black duration-200"
								onClick={() => setChatbot(false)}
							>
								{" "}
								<IoClose size={28} />{" "}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
