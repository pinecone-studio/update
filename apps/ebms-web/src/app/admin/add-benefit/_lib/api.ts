import { GraphQLClient, gql } from 'graphql-request';
import type { BenefitFromCatalog, BenefitConfig } from './types';

/** Worker-ийн суурь URL (localhost = local D1, workers.dev = Cloudflare remote D1) */
function getBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || '';
  const base = env.replace(/\/graphql\/?$/, '').trim();
  return base || 'http://localhost:8787';
}

export const GET_BENEFITS = gql`
  query GetBenefits($category: String) {
    benefits(category: $category) {
      id
      name
      category
      subsidyPercent
      requiresContract
    }
  }
`;

export const GET_CONFIG = gql`
  query GetEligibilityRuleConfig {
    getEligibilityRuleConfig {
      config
    }
  }
`;

export const GET_ATTRIBUTES = gql`
  query GetAvailableRuleAttributes {
    getAvailableRuleAttributes
  }
`;

export const UPDATE_CONFIG = gql`
  mutation UpdateEligibilityRuleConfig($config: String!) {
    updateEligibilityRuleConfig(config: $config) {
      config
    }
  }
`;

export const CREATE_BENEFIT = gql`
  mutation CreateBenefit($input: CreateBenefitInput!) {
    createBenefit(input: $input) {
      id
      name
      category
      subsidyPercent
      requiresContract
    }
  }
`;

export function getClient(): GraphQLClient {
  const base = getBaseUrl();
  const url = base.endsWith('/graphql') ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: { 'x-employee-id': 'admin', 'x-role': 'admin' },
  });
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

export async function fetchBenefits(client: GraphQLClient): Promise<BenefitFromCatalog[]> {
  const res = await client.request<{ benefits: BenefitFromCatalog[] }>(GET_BENEFITS);
  return res.benefits ?? [];
}

export async function fetchConfigAndAttributes(client: GraphQLClient): Promise<{
  config: Record<string, BenefitConfig>;
  attributes: string[];
}> {
  const [configRes, attrsRes] = await Promise.all([
    client.request<{ getEligibilityRuleConfig: { config: string } }>(GET_CONFIG),
    client.request<{ getAvailableRuleAttributes: string[] }>(GET_ATTRIBUTES),
  ]);
  const parsed = JSON.parse(configRes.getEligibilityRuleConfig.config || '{}');
  const attributes = attrsRes.getAvailableRuleAttributes ?? [
    'employment_status',
    'okr_submitted',
    'attendance',
    'responsibility_level',
  ];
  return { config: parsed.benefits ?? {}, attributes };
}
