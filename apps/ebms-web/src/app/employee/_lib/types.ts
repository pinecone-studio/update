/**
 * Backend me / Employee
 *
 * @format
 */

export type Me = {
	id: string;
	name: string;
	role: string;
	responsibilityLevel: number;
	employmentStatus: string;
	okrSubmitted: boolean;
	lateArrivalCount: number;
	benefits: MyBenefitEligibility[];
};

/** Backend BenefitEligibility (myBenefits item) */
export type MyBenefitEligibility = {
	benefit: {
		id: string;
		name: string;
		description?: string | null;
		category: string;
		subsidyPercent: number;
		requiresContract: boolean;
		vendorName?: string | null;
		activeContract?: { id: string; expiryDate?: string | null; effectiveDate?: string | null } | null;
	};
	status: "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING" | "REJECTED";
	ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
	computedAt: string;
	rejectedReason?: string | null;
};
