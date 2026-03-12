'use client';

import { GraphQLClient, gql } from 'graphql-request';

function getBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || '';
  const base = env.replace(/\/graphql\/?$/, '').trim();
  return base || 'http://localhost:8787';
}

export function getAdminClient(): GraphQLClient {
  const base = getBaseUrl();
  const url = base.endsWith('/graphql') ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-employee-id': 'admin',
      'x-role': 'admin',
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

export function getApiErrorMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'response' in e) {
    const res = (e as { response?: { errors?: Array<{ message?: string }> } }).response;
    const msg = res?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}
