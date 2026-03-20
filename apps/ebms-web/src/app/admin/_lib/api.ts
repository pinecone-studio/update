"use client";

import { GraphQLClient, gql } from "graphql-request";
import { getActiveUserHeaders } from "@/app/_lib/activeUser";

function getBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || "";
  const base = env.replace(/\/graphql\/?$/, "").trim();
  return base || "http://localhost:8787";
}

/** Base URL for REST endpoints (e.g. /admin/contracts/upload). */
export function getApiBaseUrl(): string {
  return getBaseUrl();
}

/** Download contract PDF by URL (vendor/employee contracts). Fetches with auth headers and triggers download. */
export async function downloadAdminContractByUrl(
  url: string,
  filename = "contract.pdf",
): Promise<void> {
  const headers = getActiveUserHeaders("admin");
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Failed to load contract (${res.status})`);
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

/** Open/download uploaded employee contract PDF (admin view, any request). Triggers download to avoid popup/tab issues. */
export async function openAdminContractByRequestId(
  requestId: string,
): Promise<void> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const url = `${base}/admin/contracts/employee-requests/${encodeURIComponent(requestId)}/file`;
  const headers = getActiveUserHeaders("admin");
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Failed to load contract (${res.status})`);
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = `contract-${requestId}.pdf`;
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

export function getAdminClient(): GraphQLClient {
  const base = getBaseUrl();
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      "Content-Type": "application/json",
      ...getActiveUserHeaders("admin"),
    },
  });
}

const CONFIRM_BENEFIT_REQUEST_MUTATION = gql`
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
      employeeId
      benefitId
      status
      createdAt
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

const ARCHIVE_BENEFIT_CONTRACT_PDF_MUTATION = gql`
  mutation ArchiveBenefitContractPdf($requestId: ID!, $html: String) {
    archiveBenefitContractPdf(requestId: $requestId, html: $html) {
      ok
      requestId
    }
  }
`;

export async function confirmBenefitRequest(
  client: GraphQLClient,
  requestId: string,
  contractAccepted: boolean,
  rejectReason?: string,
): Promise<{ id: string; status: string }> {
  const res = await client.request<{
    confirmBenefitRequest: { id: string; status: string };
  }>(CONFIRM_BENEFIT_REQUEST_MUTATION, {
    requestId,
    contractAccepted,
    rejectReason: rejectReason || null,
  });
  return res.confirmBenefitRequest;
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

export async function uploadSignedContractForRequest(
  client: GraphQLClient,
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
  await client.request(ARCHIVE_BENEFIT_CONTRACT_PDF_MUTATION, {
    requestId,
    html: asDataUrl,
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

// --- Escalated feedback (from employee voting) ---

export type EscalatedFeedbackItem = {
  id: string;
  text: string;
  benefitId: string | null;
  isAnonymous: boolean;
  employeeName: string | null;
  status: string;
  createdAt: string;
  votingEndsAt: string;
  closedAt: string | null;
  voteCount: number;
};

export async function fetchEscalatedFeedback(): Promise<
  EscalatedFeedbackItem[]
> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/admin/feedback`, {
    headers: {
      "Content-Type": "application/json",
      "x-employee-id": "admin",
      "x-role": "admin",
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to fetch feedback");
  }
  const json = await res.json();
  return json.items ?? [];
}

export async function fetchUnclosedFeedback(): Promise<
  EscalatedFeedbackItem[]
> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/admin/feedback?unclosed=true`, {
    headers: {
      "Content-Type": "application/json",
      "x-employee-id": "admin",
      "x-role": "admin",
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to fetch feedback");
  }
  const json = await res.json();
  return json.items ?? [];
}

export async function closeFeedback(feedbackId: string): Promise<{
  closed: boolean;
  closedAt: string;
}> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/admin/feedback/${feedbackId}/close`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-employee-id": "admin",
      "x-role": "admin",
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to close feedback");
  }
  return res.json();
}

// --- Admin notifications ---

export type AdminNotificationItem = {
  id: string;
  title: string;
  body: string;
  type: string;
  tone: string;
  unread: boolean;
  createdAt: string;
  metadata: Record<string, unknown> | null;
};

export async function fetchAdminNotifications(
  limit = 50,
  unreadOnly = false,
): Promise<AdminNotificationItem[]> {
  const base = getBaseUrl();
  const params = new URLSearchParams({ limit: String(limit) });
  if (unreadOnly) params.set("unreadOnly", "true");
  const res = await fetch(`${base}/admin/notifications?${params}`, {
    headers: {
      "Content-Type": "application/json",
      ...getActiveUserHeaders("admin"),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to fetch notifications");
  }
  const json = await res.json();
  return json.items ?? [];
}

export async function markAdminNotificationRead(id: string): Promise<void> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/admin/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getActiveUserHeaders("admin"),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to mark as read");
  }
}

export async function markAllAdminNotificationsRead(): Promise<void> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/admin/notifications/read-all`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getActiveUserHeaders("admin"),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to mark all as read");
  }
}
