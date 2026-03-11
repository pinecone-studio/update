'use client';

import { GraphQLClient, gql } from 'graphql-request';

function getBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || '';
  const base = env.replace(/\/graphql\/?$/, '').trim();
  return base || 'http://localhost:8787';
}

export function getHrClient(): GraphQLClient {
  const base = getBaseUrl();
  const url = base.endsWith('/graphql') ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: { 'x-employee-id': 'admin', 'x-role': 'hr' },
  });
}

const AUDIT_LOG_QUERY = gql`
  query AuditLog($filters: AuditFilters!) {
    auditLog(filters: $filters) {
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

const EMPLOYEES_QUERY = gql`
  query Employees($department: String, $employmentStatus: String) {
    employees(department: $department, employmentStatus: $employmentStatus) {
      id
      name
      role
      responsibilityLevel
      employmentStatus
      okrSubmitted
      lateArrivalCount
    }
  }
`;

const EMPLOYEE_QUERY = gql`
  query Employee($id: ID!) {
    employee(id: $id) {
      id
      name
      role
      responsibilityLevel
      employmentStatus
      okrSubmitted
      lateArrivalCount
      benefits {
        benefit { id name category subsidyPercent requiresContract }
        status
        ruleEvaluations { ruleType passed reason }
        computedAt
      }
    }
  }
`;

const BENEFITS_LIST_QUERY = gql`
  query BenefitsList($category: String) {
    benefits(category: $category) {
      id
      name
      category
      subsidyPercent
      requiresContract
    }
  }
`;

const OVERRIDE_ELIGIBILITY_MUTATION = gql`
  mutation OverrideEligibility($input: OverrideInput!) {
    overrideEligibility(input: $input) {
      benefit { id name category subsidyPercent requiresContract }
      status
      ruleEvaluations { ruleType passed reason }
      computedAt
    }
  }
`;

export type AuditFilters = {
  employeeId?: string | null;
  benefitId?: string | null;
  from?: string | null;
  to?: string | null;
};

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

export type EmployeeListItem = {
  id: string;
  name: string;
  role: string;
  responsibilityLevel: number;
  employmentStatus: string;
  okrSubmitted: boolean;
  lateArrivalCount: number;
};

export type BenefitEligibilityItem = {
  benefit: { id: string; name: string; category: string; subsidyPercent: number; requiresContract: boolean };
  status: string;
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
  computedAt: string;
};

export type EmployeeWithBenefits = {
  id: string;
  name: string;
  role: string;
  responsibilityLevel: number;
  employmentStatus: string;
  okrSubmitted: boolean;
  lateArrivalCount: number;
  benefits: BenefitEligibilityItem[];
};

export type BenefitOption = {
  id: string;
  name: string;
  category: string;
  subsidyPercent: number;
  requiresContract: boolean;
};

export async function fetchAuditLog(filters: AuditFilters): Promise<AuditEntry[]> {
  const res = await getHrClient().request<{ auditLog: AuditEntry[] }>(AUDIT_LOG_QUERY, {
    filters: {
      employeeId: filters.employeeId ?? undefined,
      benefitId: filters.benefitId ?? undefined,
      from: filters.from ?? undefined,
      to: filters.to ?? undefined,
    },
  });
  return res.auditLog ?? [];
}

export async function fetchEmployees(params?: { department?: string; employmentStatus?: string }): Promise<EmployeeListItem[]> {
  const res = await getHrClient().request<{ employees: EmployeeListItem[] }>(EMPLOYEES_QUERY, {
    department: params?.department ?? null,
    employmentStatus: params?.employmentStatus ?? null,
  });
  return res.employees ?? [];
}

export async function fetchEmployee(id: string): Promise<EmployeeWithBenefits | null> {
  const res = await getHrClient().request<{ employee: EmployeeWithBenefits | null }>(EMPLOYEE_QUERY, { id });
  return res.employee;
}

export async function fetchBenefitsList(category?: string): Promise<BenefitOption[]> {
  const res = await getHrClient().request<{ benefits: BenefitOption[] }>(BENEFITS_LIST_QUERY, {
    category: category ?? null,
  });
  return res.benefits ?? [];
}

export async function overrideEligibility(input: {
  employeeId: string;
  benefitId: string;
  status: string;
  reason?: string | null;
  expiresAt?: string | null;
}): Promise<{ status: string }> {
  const res = await getHrClient().request<{ overrideEligibility: { status: string } }>(
    OVERRIDE_ELIGIBILITY_MUTATION,
    { input }
  );
  return res.overrideEligibility;
}

export function getApiErrorMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'response' in e) {
    const r = (e as { response?: { errors?: Array<{ message?: string }> } }).response;
    const msg = r?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}
