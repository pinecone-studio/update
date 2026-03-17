import { gql } from "graphql-request";
import type { GraphQLClient } from "graphql-request";
import type { BenefitRequest } from "./dashboard-types";

export const BENEFIT_REQUESTS_QUERY = gql`
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

export const EMPLOYEES_COUNT_QUERY = gql`
  query EmployeesCount {
    employees {
      id
      name
      role
      employmentStatus
    }
  }
`;

export const ACTIVE_BENEFITS_COUNT_QUERY = gql`
  query ActiveBenefitsCount {
    benefits {
      id
      name
      category
    }
  }
`;

export async function fetchBenefitRequests(
  client: GraphQLClient,
  status?: string
): Promise<BenefitRequest[]> {
  const res = await client.request<{ benefitRequests: BenefitRequest[] }>(
    BENEFIT_REQUESTS_QUERY,
    { status: status ?? undefined }
  );
  return (res.benefitRequests ?? []).map((r) => ({
    ...r,
    status: (r.status || "PENDING").toUpperCase(),
  }));
}

export async function fetchDashboardStats(client: GraphQLClient): Promise<{
  totalEmployees: number;
  activeBenefits: number;
  employeesForSearch: Array<{ id: string; name: string; department: string }>;
}> {
  const [employeesRes, benefitsRes] = await Promise.all([
    client.request<{
      employees: Array<{
        id: string;
        name?: string | null;
        role?: string | null;
        employmentStatus?: string | null;
      }>;
    }>(EMPLOYEES_COUNT_QUERY),
    client.request<{ benefits: Array<{ id: string }> }>(
      ACTIVE_BENEFITS_COUNT_QUERY
    ),
  ]);

  const employees = employeesRes.employees ?? [];
  const benefits = benefitsRes.benefits ?? [];

  const employeesForSearch = employees
    .map((e) => ({
      id: e.id,
      name: (e.name ?? "").trim(),
      department: (e.role ?? e.employmentStatus ?? "").trim(),
    }))
    .filter((e) => e.id && e.name);

  return {
    totalEmployees: employees.length,
    activeBenefits: benefits.length,
    employeesForSearch,
  };
}
