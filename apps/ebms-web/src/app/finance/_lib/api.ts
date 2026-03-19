import { GraphQLClient, gql } from "graphql-request";
import { getActiveUserHeaders } from "@/app/_lib/activeUser";

function getBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || "";
  const base = env.replace(/\/graphql\/?$/, "").trim();
  return base || "http://localhost:8787";
}

export function getApiBaseUrl(): string {
  return getBaseUrl();
}

export function getFinanceClient(): GraphQLClient {
  const base = getBaseUrl();
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: getActiveUserHeaders("finance"),
  });
}

export function getApiErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "response" in e) {
    const res = (e as { response?: { errors?: Array<{ message?: string }> } })
      .response;
    const msg = res?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

export type BenefitRequestStatus =
  | "PENDING"
  | "ADMIN_APPROVED"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

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
  reviewedBy?: string | null;
  reviewedByName?: string | null;
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
      reviewedBy
      reviewedByName
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
  mutation ConfirmBenefitRequest(
    $requestId: ID!
    $contractAccepted: Boolean!
    $rejectReason: String
  ) {
    confirmBenefitRequest(
      requestId: $requestId
      contractAccepted: $contractAccepted
      rejectReason: $rejectReason
    ) {
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
  status?: BenefitRequestStatus,
): Promise<BenefitRequest[]> {
  const res = await client.request<{ benefitRequests: BenefitRequest[] }>(
    BENEFIT_REQUESTS_QUERY,
    { status },
  );
  return res.benefitRequests ?? [];
}

export async function fetchEmployees(
  client: GraphQLClient,
): Promise<EmployeeLite[]> {
  const res = await client.request<{ employees: EmployeeLite[] }>(
    EMPLOYEES_QUERY,
  );
  return res.employees ?? [];
}

export async function fetchBenefits(
  client: GraphQLClient,
): Promise<BenefitLite[]> {
  const res = await client.request<{ benefits: BenefitLite[] }>(BENEFITS_QUERY);
  return res.benefits ?? [];
}

export async function fetchAuditLog(
  client: GraphQLClient,
): Promise<AuditEntry[]> {
  const res = await client.request<{ auditLog: AuditEntry[] }>(AUDIT_LOG_QUERY);
  return res.auditLog ?? [];
}

export async function confirmBenefitRequest(
  client: GraphQLClient,
  requestId: string,
  contractAccepted: boolean,
  rejectReason?: string,
): Promise<void> {
  await client.request(CONFIRM_REQUEST_MUTATION, {
    requestId,
    contractAccepted,
    rejectReason: rejectReason || null,
  });
}

export async function fetchBenefitRequestContractHtml(
  client: GraphQLClient,
  requestId: string,
): Promise<string> {
  const res = await client.request<{
    benefitRequestContractTemplate: { html: string };
  }>(BENEFIT_REQUEST_CONTRACT_TEMPLATE_QUERY, { requestId });
  return res.benefitRequestContractTemplate.html;
}

/** Open uploaded employee contract PDF in new tab (finance view) */
export async function openFinanceContractByRequestId(
  requestId: string,
): Promise<void> {
  const base = getBaseUrl().replace(/\/$/, "");
  const url = `${base}/admin/contracts/employee-requests/${encodeURIComponent(requestId)}/file`;
  const headers = getActiveUserHeaders("finance");
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Failed to load contract (${res.status})`);
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const target = window.open(objectUrl, "_blank", "noopener,noreferrer");
  if (!target)
    throw new Error("Popup blocked. Please allow popups and try again.");
  URL.revokeObjectURL(objectUrl);
}

// --- Finance notifications ---

export type FinanceNotificationItem = {
  id: string;
  title: string;
  body: string;
  type: string;
  tone: string;
  unread: boolean;
  createdAt: string;
  metadata: Record<string, unknown> | null;
};

export async function fetchFinanceNotifications(
  limit = 50,
  unreadOnly = false,
): Promise<FinanceNotificationItem[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (unreadOnly) params.set("unreadOnly", "true");
  const res = await fetch(`${getBaseUrl()}/finance/notifications?${params}`, {
    headers: {
      "Content-Type": "application/json",
      ...getActiveUserHeaders("finance"),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to fetch notifications");
  }
  const json = await res.json();
  return json.items ?? [];
}

export async function markFinanceNotificationRead(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/finance/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getActiveUserHeaders("finance"),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to mark as read");
  }
}

export async function markAllFinanceNotificationsRead(): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/finance/notifications/read-all`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getActiveUserHeaders("finance"),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to mark all as read");
  }
}
