'use client';

import { GraphQLClient, gql } from 'graphql-request';
import { getActiveUserHeaders } from '@/app/_lib/activeUser';

function getBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || '';
  const base = env.replace(/\/graphql\/?$/, '').trim();
  return base || 'http://localhost:8787';
}

/** Base URL for REST endpoints (e.g. /admin/contracts/upload). */
export function getApiBaseUrl(): string {
  return getBaseUrl();
}

export function getAdminClient(): GraphQLClient {
  const base = getBaseUrl();
  const url = base.endsWith('/graphql') ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      'Content-Type': 'application/json',
      ...getActiveUserHeaders('admin'),
    },
  });
}

const CONFIRM_BENEFIT_REQUEST_MUTATION = gql`
  mutation ConfirmBenefitRequest($requestId: ID!, $contractAccepted: Boolean!, $rejectReason: String) {
    confirmBenefitRequest(requestId: $requestId, contractAccepted: $contractAccepted, rejectReason: $rejectReason) {
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

export async function confirmBenefitRequest(
  client: GraphQLClient,
  requestId: string,
  contractAccepted: boolean,
  rejectReason?: string
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
  requestId: string
): Promise<string> {
  const res = await client.request<{
    benefitRequestContractTemplate: { html: string };
  }>(BENEFIT_REQUEST_CONTRACT_TEMPLATE_QUERY, { requestId });
  return res.benefitRequestContractTemplate.html;
}

export function getApiErrorMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'response' in e) {
    const res = (e as { response?: { errors?: Array<{ message?: string }> } }).response;
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
  status: string;
  createdAt: string;
  votingEndsAt: string;
  closedAt: string | null;
  voteCount: number;
};

export async function fetchEscalatedFeedback(): Promise<EscalatedFeedbackItem[]> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/admin/feedback`, {
    headers: {
      'Content-Type': 'application/json',
      'x-employee-id': 'admin',
      'x-role': 'admin',
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? 'Failed to fetch feedback');
  }
  const json = await res.json();
  return json.items ?? [];
}

export async function fetchUnclosedFeedback(): Promise<EscalatedFeedbackItem[]> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/admin/feedback?unclosed=true`, {
    headers: {
      'Content-Type': 'application/json',
      'x-employee-id': 'admin',
      'x-role': 'admin',
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? 'Failed to fetch feedback');
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
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-employee-id': 'admin',
      'x-role': 'admin',
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? 'Failed to close feedback');
  }
  return res.json();
}
