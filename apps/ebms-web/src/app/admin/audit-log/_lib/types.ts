export type AuditActionType =
  | "Override"
  | "Request Approved"
  | "Request Rejected"
  | "Contract Uploaded"
  | "Contract Expired";

export type AuditEntry = {
  id: string;
  timestamp: string;
  action: string;
  actionType: AuditActionType;
  status:
    | "ACTIVE"
    | "ELIGIBLE"
    | "PENDING"
    | "LOCKED"
    | "REJECTED"
    | "CANCELLED";
  oldStatus?: string;
  employee: string;
  employeeId: string;
  benefit: string;
  performedBy: string;
  /** Raw triggeredBy ID for search */
  performedById?: string;
  details: string;
  reason: string;
  contractStartDate: string;
  contractEndDate: string;
  /** When actionType is Contract Uploaded: request ID to view the uploaded PDF */
  uploadedContractRequestId?: string;
};
