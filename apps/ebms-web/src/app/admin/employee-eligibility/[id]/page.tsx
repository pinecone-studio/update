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

function getClient(): GraphQLClient {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const base = raw.replace(/\/graphql\/?$/, "").trim() || "http://localhost:8787";
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      "x-employee-id": "admin",
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
    const employees = data.employees ?? [];
    return employees.map((emp) => ({ id: emp.id }));
  } catch {
    return [];
  }
}

export default function EmployeeEligibilityDetailPage() {
  return <EmployeeEligibilityDetailClient />;
}
