/** @format */

import { GraphQLClient, gql } from "graphql-request";
import { getActiveUserHeaders } from "@/app/_lib/activeUser";

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

export type EmployeeRow = {
	id: string;
	name: string;
	department: string;
};

function getBaseUrl(): string {
	const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
	return raw.replace(/\/graphql\/?$/, "").trim() || "http://localhost:8787";
}

export function getClient(): GraphQLClient {
	const base = getBaseUrl();
	const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
	return new GraphQLClient(url, {
		headers: {
			...getActiveUserHeaders("admin"),
		},
	});
}

export async function fetchEmployees(
	client: GraphQLClient,
): Promise<EmployeeRow[]> {
	const data = await client.request<{
		employees: Array<{
			id?: string | null;
			name?: string | null;
			role?: string | null;
			employmentStatus?: string | null;
		}>;
	}>(EMPLOYEES_QUERY);

	return (data.employees ?? []).map((e) => ({
		id: e.id ?? "",
		name: e.name ?? "Unknown",
		department: e.role ?? e.employmentStatus ?? "—",
	}));
}
