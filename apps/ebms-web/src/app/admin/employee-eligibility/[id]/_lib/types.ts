export type BenefitStatus = "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING";

export type EmployeeBenefit = {
  benefit: { id: string; name: string };
  status: BenefitStatus;
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
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
  history: BenefitHistoryEntry[];
};
