/** @format */

"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "../components/Header";
import { BenefitPortfolio } from "@/app/_components/BenefitPortfolio";
import type {
	BenefitCardProps,
	BenefitStatus,
} from "@/app/_components/BenefitCard";
import {
	fetchMyBenefits,
	requestBenefit,
	getApiErrorMessage,
} from "../_lib/api";
import { mapMyBenefitsToCardProps } from "../_lib/mapBenefits";

export default function EmployeeBenefitsPage() {
	const [benefits, setBenefits] = useState<BenefitCardProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<BenefitStatus | "ALL">(
		"ALL",
	);
	const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchMyBenefits();
			setBenefits(mapMyBenefitsToCardProps(data));
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

	const handleRequestBenefit = useCallback(
		async (benefit: BenefitCardProps) => {
			if (!benefit.benefitId) return;
			try {
				await requestBenefit(benefit.benefitId);
				await load();
			} catch (e) {
				alert(getApiErrorMessage(e));
			}
		},
		[load],
	);

	const activeCount = benefits.filter((b) => b.status === "ACTIVE").length;
	const filteredByStatus =
		selectedStatus === "ALL"
			? benefits
			: benefits.filter((b) => b.status === selectedStatus);
	const filteredBenefits =
		selectedCategory === "ALL"
			? filteredByStatus
			: filteredByStatus.filter(
					(b) => b.category.toLowerCase() === selectedCategory.toLowerCase(),
				);

	const categoryOrder = [
		"Wellness",
		"Equipment",
		"Financial",
		"Career Development",
		"Flexibility",
	];

	const categoryBuckets = categoryOrder.map((category) => ({
		category,
		items: filteredBenefits.filter(
			(b) => b.category.toLowerCase() === category.toLowerCase(),
		),
	}));

	return (
		<div>
			<div className="bg-[#0f172A] px-4 py-4 flex flex-col items-center gap-6 text-white w-full min-h-screen">
				<div className="flex flex-col gap-6 w-full max-w-[1500px] -mt-4">
					<div className="flex flex-wrap gap-3 md:gap-6 mt-1">
						{(["ALL", ...categoryOrder] as const).map((category) => {
							const isActive = selectedCategory === category;
							return (
								<button
									key={category}
									type="button"
									onClick={() => setSelectedCategory(category)}
									className={`${isActive ? "bg-[#1E293B] text-white" : "text-[#94A3B8]"} px-4 py-2 rounded-full text-sm`}
								>
									{category === "ALL" ? "All Categories" : category}
								</button>
							);
						})}
					</div>

					<div className="flex flex-wrap gap-3 md:gap-6 mt-1">
						{(
							[
								{ label: "All", value: "ALL" },
								{ label: `Active (${activeCount})`, value: "ACTIVE" },
								{ label: "Eligible", value: "ELIGIBLE" },
								{ label: "Pending", value: "PENDING" },
								{ label: "Locked", value: "LOCKED" },
							] as const
						).map((tab) => {
							const isActive = selectedStatus === tab.value;
							return (
								<button
									key={tab.value}
									type="button"
									onClick={() => setSelectedStatus(tab.value)}
									className={`${isActive ? "bg-[#1E293B] text-white" : "text-[#94A3B8]"} px-4 py-2 rounded-full text-sm`}
								>
									{tab.label}
								</button>
							);
						})}
					</div>

					{error && <p className="text-sm text-red-400">Error: {error}</p>}

					{loading ? (
						<p className="text-slate-600 dark:text-[#94A3B8]">
							Loading benefits...
						</p>
					) : (
						<>
							<div className="w-full max-w-[1500px] flex flex-col gap-8">
								{categoryBuckets.map((bucket) =>
									bucket.items.length === 0 ? null : (
										<section
											key={bucket.category}
											className="flex flex-col gap-3"
										>
											<h2 className="text-sm uppercase tracking-wider text-[#94A3B8]">
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
