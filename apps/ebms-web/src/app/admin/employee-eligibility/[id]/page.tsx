/** @format */

import { GraphQLClient, gql } from "graphql-request";
import EmployeeEligibilityDetailClient from "./EmployeeEligibilityDetailClient";

const EMPLOYEES_QUERY = gql`
  query Employees {
    employees {
      id
    }
  }
`;

const FALLBACK_EMPLOYEE_IDS = [
  "emp-1",
  "angarag-1",
  "zundui-1",
  "ogoo-1",
  "soroo-1",
  "uganasa-1",
  "ganaa-1",
];

function getClient(): GraphQLClient {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const base = raw.replace(/\/graphql\/?$/, "").trim() || "http://localhost:8787";
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      "x-employee-id": "emp-1",
      "x-role": "admin",
    },
  });
}

export async function generateStaticParams() {
  try {
    const client = getClient();
    const data = await client.request<{ employees: Array<{ id: string }> }>(
      EMPLOYEES_QUERY
    );
    const fromApi = (data.employees ?? []).map((emp) => emp.id).filter(Boolean);
    const ids = Array.from(new Set([...FALLBACK_EMPLOYEE_IDS, ...fromApi]));
    return ids.map((id) => ({ id }));
  } catch {
    return FALLBACK_EMPLOYEE_IDS.map((id) => ({ id }));
  }
}

export default function EmployeeEligibilityDetailPage() {
  return <EmployeeEligibilityDetailClient />;
}
