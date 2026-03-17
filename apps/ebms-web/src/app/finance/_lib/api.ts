import { GraphQLClient, gql } from "graphql-request";
import { getActiveUserHeaders } from "@/app/_lib/activeUser";

function getBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || "";
  const base = env.replace(/\/graphql\/?$/, "").trim();
  return base || "http://localhost:8787";
}

export function getFinanceClient(): GraphQLClient {
  const base = getBaseUrl();
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: getActiveUserHeaders("finance"),
    headers: getActiveUserHeaders("finance-manager"),
  });
}

export function getApiErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "response" in e) {
    const res = (e as { response?: { errors?: Array<{ message?: string }> } }).response;
    const msg = res?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

export type BenefitRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type BenefitRequest = {
  id: string;
  employeeId: string;
  benefitId: string;
  status: BenefitRequestStatus;
  createdAt: string;
  employeeName?: string | null;
  benefitName?: string | null;
  rejectReason?: string | null;
  requiresContract: boolean;
  contractAcceptedAt?: string | null;
  contractTemplateUrl?: string | null;
};

export type EmployeeLite = {
  id: string;
  name?: string | null;
  role?: string | null;
  employmentStatus?: string | null;
};

export type BenefitLite = {
  id: string;
  name: string;
  category: string;
  subsidyPercent: number;
  requiresContract: boolean;
  vendorName?: string | null;
  activeContract?: {
    id: string;
    version: string;
    effectiveDate?: string | null;
    expiryDate?: string | null;
  } | null;
};

export type AuditEntry = {
  id: string;
  employeeId: string;
  benefitId: string;
  newStatus: string;
  triggeredBy?: string | null;
  computedAt: string;
};

const BENEFIT_REQUESTS_QUERY = gql`
  query BenefitRequests($status: RequestStatus) {
    benefitRequests(status: $status) {
      id
      employeeId
      benefitId
      status
      createdAt
      employeeName
      benefitName
      rejectReason
      requiresContract
      contractAcceptedAt
      contractTemplateUrl
    }
  }
`;

const EMPLOYEES_QUERY = gql`
  query Employees {
    employees {
      id
      name
      role
      employmentStatus
    }
  }
`;

const BENEFITS_QUERY = gql`
  query Benefits {
    benefits {
      id
      name
      category
      subsidyPercent
      requiresContract
      vendorName
      activeContract {
        id
        version
        effectiveDate
        expiryDate
      }
    }
  }
`;

const AUDIT_LOG_QUERY = gql`
  query AuditLog {
    auditLog(filters: {}) {
      id
      employeeId
      benefitId
      newStatus
      triggeredBy
      computedAt
    }
  }
`;

const CONFIRM_REQUEST_MUTATION = gql`
  mutation ConfirmBenefitRequest($requestId: ID!, $contractAccepted: Boolean!, $rejectReason: String) {
    confirmBenefitRequest(requestId: $requestId, contractAccepted: $contractAccepted, rejectReason: $rejectReason) {
      id
      status
    }
  }
`;

const BENEFIT_REQUEST_CONTRACT_TEMPLATE_QUERY = gql`
  query BenefitRequestContractTemplate($requestId: ID!) {
    benefitRequestContractTemplate(requestId: $requestId) {
      html
    }
  }
`;

export async function fetchBenefitRequests(
  client: GraphQLClient,
  status?: BenefitRequestStatus
): Promise<BenefitRequest[]> {
  const res = await client.request<{ benefitRequests: BenefitRequest[] }>(
    BENEFIT_REQUESTS_QUERY,
    { status }
  );
  return res.benefitRequests ?? [];
}

export async function fetchEmployees(client: GraphQLClient): Promise<EmployeeLite[]> {
  const res = await client.request<{ employees: EmployeeLite[] }>(EMPLOYEES_QUERY);
  return res.employees ?? [];
}

export async function fetchBenefits(client: GraphQLClient): Promise<BenefitLite[]> {
  const res = await client.request<{ benefits: BenefitLite[] }>(BENEFITS_QUERY);
  return res.benefits ?? [];
}

export async function fetchAuditLog(client: GraphQLClient): Promise<AuditEntry[]> {
  const res = await client.request<{ auditLog: AuditEntry[] }>(AUDIT_LOG_QUERY);
  return res.auditLog ?? [];
}

export async function confirmBenefitRequest(
  client: GraphQLClient,
  requestId: string,
  contractAccepted: boolean,
  rejectReason?: string
): Promise<void> {
  await client.request(CONFIRM_REQUEST_MUTATION, {
    requestId,
    contractAccepted,
    rejectReason: rejectReason || null,
  });
}

export async function fetchBenefitRequestContractHtml(
  client: GraphQLClient,
  requestId: string
): Promise<string> {
  const res = await client.request<{
    benefitRequestContractTemplate: { html: string };
  }>(BENEFIT_REQUEST_CONTRACT_TEMPLATE_QUERY, { requestId });
  return res.benefitRequestContractTemplate.html;
}
