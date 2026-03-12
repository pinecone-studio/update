/** @format */

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Header } from "../components/Header";
import { EmployeeBenefitsSkeleton } from "../components/EmployeeBenefitsSkeleton";
import { BenefitPortfolio } from "@/app/_components/BenefitPortfolio";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import {
	fetchMyBenefits,
	requestBenefit,
	getApiErrorMessage,
	getEmployeeId,
} from "../_lib/api";
import { mapMyBenefitsToCardProps } from "../_lib/mapBenefits";
import { getApprovedBenefitIdsForEmployee } from "@/app/_lib/localBenefitRequests";

export default function EmployeeBenefitsPage() {
	const [benefits, setBenefits] = useState<BenefitCardProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchMyBenefits();
			const mapped = mapMyBenefitsToCardProps(data);
			const approvedIds = getApprovedBenefitIdsForEmployee(getEmployeeId());
			const withApproved = mapped.map((b) =>
				b.status === "PENDING" &&
				b.benefitId &&
				approvedIds.includes(b.benefitId)
					? { ...b, status: "ACTIVE" as const }
					: b,
			);
			setBenefits(withApproved);
		} catch (e) {
			setError(getApiErrorMessage(e));
			setBenefits([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);
	useEffect(() => {
		const applyApproved = () => {
			setBenefits((prev) => {
				const approvedIds = getApprovedBenefitIdsForEmployee(getEmployeeId());
				return prev.map((b) =>
					b.status === "PENDING" &&
					b.benefitId &&
					approvedIds.includes(b.benefitId)
						? { ...b, status: "ACTIVE" as const }
						: b,
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
				});
				await load();
			} catch (e) {
				alert(getApiErrorMessage(e));
			}
		},
		[load],
	);

	const preferredCategoryOrder = [
		"Wellness",
		"Health",
		"Equipment",
		"Financial",
		"Career Development",
		"Flexibility",
		"Tools",
		"Workplace",
		"Performance",
	];

	const categories = useMemo(() => {
		const unique = Array.from(
			new Set(benefits.map((b) => (b.category ?? "").trim()).filter(Boolean)),
		);
		return unique.sort((a, b) => {
			const ai = preferredCategoryOrder.findIndex(
				(p) => p.toLowerCase() === a.toLowerCase(),
			);
			const bi = preferredCategoryOrder.findIndex(
				(p) => p.toLowerCase() === b.toLowerCase(),
			);
			if (ai !== -1 && bi !== -1) return ai - bi;
			if (ai !== -1) return -1;
			if (bi !== -1) return 1;
			return a.localeCompare(b);
		});
	}, [benefits]);

	const filteredBenefits =
		selectedCategory === "ALL"
			? benefits
			: benefits.filter(
					(b) => b.category.toLowerCase() === selectedCategory.toLowerCase(),
				);

	const categoryBuckets = useMemo(() => {
		const visibleCategories =
			selectedCategory === "ALL" ? categories : [selectedCategory];
		return visibleCategories.map((category) => ({
			category,
			items: filteredBenefits
				.filter((b) => b.category.toLowerCase() === category.toLowerCase())
				.sort((a, b) => a.name.localeCompare(b.name)),
		}));
	}, [categories, filteredBenefits, selectedCategory]);

	return (
		<div>
			<div className="bg-slate-50 px-4 py-4 flex flex-col items-center gap-6 text-slate-900 dark:bg-[#0f172A] dark:text-white w-full min-h-screen">
				<div className="flex flex-col gap-6 w-full max-w-[1500px] -mt-4">
					{loading ? (
						<EmployeeBenefitsSkeleton />
					) : (
						<>
					<div className="flex w-full flex-wrap justify-center gap-3 md:gap-6 mt-1">
						{(["ALL", ...categories] as const).map((category) => {
							const isActive = selectedCategory === category;
							return (
								<button
									key={category}
									type="button"
									onClick={() => setSelectedCategory(category)}
									className={`${isActive ? "bg-slate-200 text-slate-900 dark:bg-[#1E293B] dark:text-white" : "text-slate-500 dark:text-[#94A3B8]"} px-4 py-2 rounded-full text-sm`}
								>
									{category === "ALL" ? "All Categories" : category}
								</button>
							);
						})}
					</div>

					{error && <p className="text-sm text-red-400">Error: {error}</p>}

							<div className="w-full max-w-[1500px] flex flex-col gap-8">
								{categoryBuckets.map((bucket) =>
									bucket.items.length === 0 ? null : (
										<section
											key={bucket.category}
											className="flex flex-col gap-3"
										>
											<h2 className="text-sm uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
												{bucket.category}
											</h2>
											<BenefitPortfolio
												benefits={bucket.items}
												onRequestBenefit={handleRequestBenefit}
											/>
										</section>
									),
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
