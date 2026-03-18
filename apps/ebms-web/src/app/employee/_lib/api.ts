/** @format */

"use client";

import { GraphQLClient, gql } from "graphql-request";
import type { Me, MyBenefitEligibility } from "./types";
import {
  getActiveUserHeaders,
  getActiveUserProfile,
} from "@/app/_lib/activeUser";
const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      role
      responsibilityLevel
      employmentStatus
      okrSubmitted
      lateArrivalCount
      benefits {
        benefit {
          id
          name
          description
          category
          subsidyPercent
          requiresContract
          vendorName
          activeContract {
            id
            expiryDate
            effectiveDate
          }
        }
        status
        ruleEvaluations {
          ruleType
          passed
          reason
        }
        computedAt
        rejectedReason
        overrideApplied
        overrideReason
        pendingApprovalBy
        uploadedContractRequestId
      }
    }
  }
`;

const MY_BENEFITS_QUERY = gql`
  query MyBenefits {
    myBenefits {
      benefit {
        id
        name
        description
        category
        subsidyPercent
        requiresContract
        vendorName
        activeContract {
          id
          expiryDate
          effectiveDate
        }
      }
      status
      ruleEvaluations {
          ruleType
          passed
          reason
        }
        computedAt
        rejectedReason
        overrideApplied
        overrideReason
        pendingApprovalBy
        uploadedContractRequestId
    }
  }
`;

const BENEFIT_REQUESTS_QUERY = gql`
  query BenefitRequests($status: RequestStatus) {
    benefitRequests(status: $status) {
      id
      employeeId
      benefitId
      status
      createdAt
      contractAcceptedAt
      benefitName
      requiresContract
      contractTemplateUrl
    }
  }
`;

const MY_AUDIT_LOG_QUERY = gql`
  query MyAuditLog($filters: AuditFilters!) {
    myAuditLog(filters: $filters) {
      id
      employeeId
      benefitId
      oldStatus
      newStatus
      computedAt
      triggeredBy
      createdAt
    }
  }
`;

const BENEFITS_QUERY = gql`
  query Benefits {
    benefits {
      id
      name
      category
    }
  }
`;

const REQUEST_BENEFIT_MUTATION = gql`
  mutation RequestBenefit($input: BenefitRequestInput!) {
    requestBenefit(input: $input) {
      id
      employeeId
      benefitId
      status
      createdAt
      requiresContract
      contractId
      contractTemplateUrl
    }
  }
`;

const BENEFIT_CONTRACT_PREVIEW_QUERY = gql`
  query BenefitContractPreview($benefitId: ID!) {
    benefitContractPreview(benefitId: $benefitId) {
      html
    }
  }
`;

const ARCHIVE_BENEFIT_CONTRACT_PDF_MUTATION = gql`
  mutation ArchiveBenefitContractPdf($requestId: ID!, $html: String) {
    archiveBenefitContractPdf(requestId: $requestId, html: $html) {
      ok
      requestId
    }
  }
`;

const MY_NOTIFICATIONS_QUERY = gql`
	query MyNotifications($limit: Int, $unreadOnly: Boolean) {
		myNotifications(limit: $limit, unreadOnly: $unreadOnly) {
			id
			title
			body
			createdAt
			tone
			type
			isRead
			metadata
		}
	}
`;

const MARK_NOTIFICATION_READ_MUTATION = gql`
	mutation MarkNotificationRead($id: ID!) {
		markNotificationRead(id: $id) {
			id
			isRead
		}
	}
`;

const MARK_ALL_NOTIFICATIONS_READ_MUTATION = gql`
	mutation MarkAllNotificationsRead {
		markAllNotificationsRead
	}
`;


function getBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || "";
  const base = env.replace(/\/graphql\/?$/, "").trim();
  return base || "http://localhost:8787";
}

function toAbsoluteApiUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = getBaseUrl().replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

/** Нэвтрэлтгүй үед default emp-1 ашиглана — хэрэглэгч логин хийгээгүй ч app ажиллана. */
export function getEmployeeId(): string {
  return getActiveUserProfile().id;
}

export function getEmployeeClient(): GraphQLClient {
  const base = getBaseUrl();
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      ...getActiveUserHeaders("employee"),
      "Content-Type": "application/json",
    },
  });
}

export async function fetchMe(): Promise<Me> {
  const res = await getEmployeeClient().request<{ me: Me }>(ME_QUERY);
  return res.me;
}

export async function fetchMyBenefits(): Promise<MyBenefitEligibility[]> {
  const res = await getEmployeeClient().request<{
    myBenefits: MyBenefitEligibility[];
  }>(MY_BENEFITS_QUERY);
  return res.myBenefits ?? [];
}

export type MyBenefitRequest = {
  id: string;
  employeeId: string;
  benefitId: string;
  status: "PENDING" | "ADMIN_APPROVED" | "APPROVED" | "REJECTED" | "CANCELLED";
  createdAt: string;
  contractAcceptedAt?: string | null;
  benefitName?: string | null;
  requiresContract: boolean;
  contractTemplateUrl?: string | null;
};

export async function fetchMyBenefitRequests(
  status?: MyBenefitRequest["status"],
): Promise<MyBenefitRequest[]> {
  const res = await getEmployeeClient().request<{
    benefitRequests: MyBenefitRequest[];
  }>(BENEFIT_REQUESTS_QUERY, { status: status ?? null });
  return (res.benefitRequests ?? []).map((r) => ({
    ...r,
    contractTemplateUrl: toAbsoluteApiUrl(r.contractTemplateUrl),
  }));
}

export type AuditEntry = {
  id: string;
  employeeId: string;
  benefitId: string;
  oldStatus: string | null;
  newStatus: string;
  computedAt: string;
  triggeredBy: string | null;
  createdAt: string;
};

export async function fetchMyAuditLog(filters?: {
  benefitId?: string;
  from?: string;
  to?: string;
}): Promise<AuditEntry[]> {
  const res = await getEmployeeClient().request<{
    myAuditLog: AuditEntry[];
  }>(MY_AUDIT_LOG_QUERY, { filters: filters ?? {} });
  return res.myAuditLog ?? [];
}

export async function fetchBenefits(): Promise<
  { id: string; name: string; category: string }[]
> {
  const res = await getEmployeeClient().request<{
    benefits: { id: string; name: string; category: string }[];
  }>(BENEFITS_QUERY);
  return res.benefits ?? [];
}

export async function requestBenefit(benefitId: string): Promise<{
  id: string;
  status: string;
  createdAt: string;
  requiresContract: boolean;
}> {
  const res = await getEmployeeClient().request<{
    requestBenefit: {
      id: string;
      status: string;
      createdAt: string;
      requiresContract: boolean;
      contractTemplateUrl?: string | null;
    };
  }>(REQUEST_BENEFIT_MUTATION, { input: { benefitId } });
  const request = res.requestBenefit;

  return {
    id: request.id,
    status: request.status,
    createdAt: request.createdAt,
    requiresContract: request.requiresContract,
  };
}

export async function openBenefitContractPreview(
  benefitId: string,
  popup?: Window | null,
): Promise<void> {
  const target = popup ?? window.open("", "_blank", "noopener,noreferrer");
  if (!target)
    throw new Error("Popup blocked. Please allow popups and try again.");
  const res = await getEmployeeClient().request<{
    benefitContractPreview: { html: string };
  }>(BENEFIT_CONTRACT_PREVIEW_QUERY, { benefitId });
  target.document.open();
  target.document.write(res.benefitContractPreview.html);
  target.document.close();
}

/** Open uploaded signed contract PDF in new tab (requires x-employee-id header) */
export async function openUploadedContract(requestId: string): Promise<void> {
  const base = getBaseUrl().replace(/\/$/, "");
  const url = `${base}/contracts/employee-requests/${encodeURIComponent(requestId)}/file`;
  const headers = getActiveUserHeaders("employee");
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

export async function uploadSignedContractPdf(
  requestId: string,
  file: File,
): Promise<void> {
  const asDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () =>
      reject(new Error("Failed to read selected PDF file."));
    reader.readAsDataURL(file);
  });
  if (!asDataUrl.startsWith("data:application/pdf;base64,")) {
    throw new Error("Only PDF files are supported.");
  }
  await getEmployeeClient().request(ARCHIVE_BENEFIT_CONTRACT_PDF_MUTATION, {
    requestId,
    html: asDataUrl,
  });
}

export function getApiErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "response" in e) {
    const r = (e as { response?: { errors?: Array<{ message?: string }> } })
      .response;
    const msg = r?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

// --- Notifications ---

export type EmployeeNotification = {
	id: string;
	title: string;
	body: string;
	createdAt: string;
	tone: "SUCCESS" | "INFO" | "WARNING" | "NEUTRAL";
	type: "ELIGIBILITY_CHANGE" | "REQUEST_STATUS" | "WARNING";
	isRead: boolean;
	metadata?: string | null;
};

export function formatRelativeTime(iso: string): string {
	const ts = new Date(iso).getTime();
	if (Number.isNaN(ts)) return iso;
	const diffMs = Date.now() - ts;
	const diffMin = Math.floor(diffMs / 60000);
	if (diffMin < 1) return "just now";
	if (diffMin < 60) return `${diffMin} min ago`;
	const diffHour = Math.floor(diffMin / 60);
	if (diffHour < 24) return `${diffHour} hour ago`;
	const diffDay = Math.floor(diffHour / 24);
	return `${diffDay} day ago`;
}

export async function fetchMyNotifications(
	limit = 100,
	unreadOnly?: boolean,
): Promise<EmployeeNotification[]> {
	const res = await getEmployeeClient().request<{
		myNotifications: EmployeeNotification[];
	}>(MY_NOTIFICATIONS_QUERY, { limit, unreadOnly: unreadOnly ?? null });
	return res.myNotifications ?? [];
}

export async function markNotificationRead(id: string): Promise<void> {
	await getEmployeeClient().request(MARK_NOTIFICATION_READ_MUTATION, { id });
}

export async function markAllNotificationsRead(): Promise<void> {
	await getEmployeeClient().request(MARK_ALL_NOTIFICATIONS_READ_MUTATION);
}

// --- Benefit feedback (voting) ---

export type FeedbackItem = {
  id: string;
  text: string;
  benefitId: string | null;
  isAnonymous: boolean;
  status: "OPEN" | "EXPIRED" | "ESCALATED";
  createdAt: string;
  votingEndsAt: string;
  voteCount: number;
  hasVoted: boolean;
  isCreator?: boolean;
};

function getFeedbackBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || "";
  const base = env.replace(/\/graphql\/?$/, "").trim();
  return base || "http://localhost:8787";
}

function getFeedbackHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-employee-id": getEmployeeId(),
    "x-role": "employee",
  };
}

export async function fetchFeedbackList(): Promise<FeedbackItem[]> {
  const res = await fetch(`${getFeedbackBaseUrl()}/feedback`, {
    headers: getFeedbackHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to fetch feedback");
  }
  const json = await res.json();
  return json.items ?? [];
}

export async function fetchOpenFeedbackCount(): Promise<number> {
  const res = await fetch(`${getFeedbackBaseUrl()}/feedback/open-count`, {
    headers: getFeedbackHeaders(),
  });
  if (!res.ok) return 0;
  const json = await res.json();
  return Number(json.count ?? 0);
}

export async function createFeedback(params: {
  text: string;
  benefitId?: string;
  isAnonymous?: boolean;
}): Promise<FeedbackItem> {
  const res = await fetch(`${getFeedbackBaseUrl()}/feedback`, {
    method: "POST",
    headers: getFeedbackHeaders(),
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to create feedback");
  }
  return res.json();
}

export async function voteFeedback(feedbackId: string): Promise<{
  voteCount: number;
  status: string;
}> {
  const res = await fetch(
    `${getFeedbackBaseUrl()}/feedback/${feedbackId}/vote`,
    {
      method: "POST",
      headers: getFeedbackHeaders(),
    },
  );
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to vote");
  }
  return res.json();
}

export async function unvoteFeedback(feedbackId: string): Promise<{
  voteCount: number;
}> {
  const res = await fetch(
    `${getFeedbackBaseUrl()}/feedback/${feedbackId}/vote`,
    {
      method: "DELETE",
      headers: getFeedbackHeaders(),
    },
  );
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to remove vote");
  }
  return res.json();
}

export async function deleteFeedback(feedbackId: string): Promise<{
  deleted: boolean;
}> {
  const res = await fetch(`${getFeedbackBaseUrl()}/feedback/${feedbackId}`, {
    method: "DELETE",
    headers: getFeedbackHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to delete feedback");
  }
  return res.json();
}
