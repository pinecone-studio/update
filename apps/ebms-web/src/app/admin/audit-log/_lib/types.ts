export type AuditEntry = {
  id: string;
  timestamp: string;
  action: string;
  status:
    | "ACTIVE"
    | "ELIGIBLE"
    | "PENDING"
    | "LOCKED"
    | "REJECTED"
    | "CANCELLED";
  employee: string;
  employeeId: string;
  benefit: string;
  performedBy: string;
  details: string;
  reason: string;
  contractStartDate: string;
  contractEndDate: string;
};
