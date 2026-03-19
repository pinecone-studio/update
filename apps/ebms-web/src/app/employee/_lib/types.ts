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
    requestDeadline?: string | null;
    usageLimitCount?: number;
    usageLimitPeriod?: string | null;
    activeContract?: {
      id: string;
      expiryDate?: string | null;
      effectiveDate?: string | null;
    } | null;
  };
  status: "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING" | "REJECTED";
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
  computedAt: string;
  rejectedReason?: string | null;
  overrideApplied: boolean;
  overrideReason?: string | null;
  /** When status is PENDING: "admin" or "finance" — who must approve next */
  pendingApprovalBy?: string | null;
  /** When status is ACTIVE and contract was uploaded: request ID to view/download */
  uploadedContractRequestId?: string | null;
  /** Computed start date (from contract or config period) — ACTIVE only */
  effectiveDate?: string | null;
  /** Computed end date (from contract or config period) — ACTIVE only */
  expiryDate?: string | null;
};
