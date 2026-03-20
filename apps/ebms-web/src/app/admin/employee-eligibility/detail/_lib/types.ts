export type BenefitStatus =
  | "ACTIVE"
  | "ELIGIBLE"
  | "LOCKED"
  | "PENDING"
  | "REJECTED";

export type EmployeeBenefit = {
  benefit: { id: string; name: string };
  status: BenefitStatus;
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
  computedAt?: string | null;
  overrideApplied?: boolean;
  overrideReason?: string | null;
  rejectedReason?: string | null;
};

export type EmployeeDetail = {
  id: string;
  name?: string | null;
  role?: string | null;
  employmentStatus?: string | null;
  benefits: EmployeeBenefit[];
};

export type BenefitHistoryEntry = {
  status: string;
  reason: string;
  changedAt: string;
  changedBy: string;
};

export type BenefitRow = {
  benefitId: string;
  name: string;
  status: BenefitStatus;
  reason: string;
  lastDate: string;
  subsidyPercent?: number | null;
  vendorName?: string | null;
  effectiveDate?: string | null;
  expiryDate?: string | null;
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
  overrideApplied?: boolean;
  overrideReason?: string | null;
  history: BenefitHistoryEntry[];
};
