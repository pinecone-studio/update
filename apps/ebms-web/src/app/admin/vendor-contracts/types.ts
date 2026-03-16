export type Contract = {
  id: string;
  employeeId?: string | null;
  contractNumber: string;
  contractName: string;
  startDate: string;
  endDate: string;
  contractUrl: string;
  status: "Active" | "Expiring soon";
};

export type ContractApiRow = {
  id: string;
  employeeId?: string | null;
  benefitId: string;
  benefitName?: string | null;
  vendorName?: string | null;
  version?: string | null;
  effectiveDate?: string | null;
  expiryDate?: string | null;
  downloadUrl: string;
  employeeName?: string | null;
};

export type BenefitOption = {
  id: string;
  name: string;
  category: string;
  vendorName?: string | null;
  requiresContract: boolean;
};
