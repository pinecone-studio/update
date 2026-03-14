/** @format */

"use client";

import { GraphQLClient, gql } from "graphql-request";
import type { Me, MyBenefitEligibility } from "./types";
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
		}
	}
`;

function getBaseUrl(): string {
	const env = process.env.NEXT_PUBLIC_API_URL || "";
	const base = env.replace(/\/graphql\/?$/, "").trim();
	return base || "http://localhost:8787";
}

/** Нэвтрэлтгүй үед default emp-1 ашиглана — хэрэглэгч логин хийгээгүй ч app ажиллана. */
export function getEmployeeId(): string {
	return process.env.NEXT_PUBLIC_EMPLOYEE_ID || "emp-1";
}

export function getEmployeeClient(): GraphQLClient {
	const base = getBaseUrl();
	const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
	return new GraphQLClient(url, {
		headers: {
			"x-employee-id": getEmployeeId(),
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

export async function requestBenefit(
	benefitId: string,
	_options?: { benefitName?: string; employeeName?: string },
): Promise<{ id: string; status: string; createdAt: string }> {
	const res = await getEmployeeClient().request<{
		requestBenefit: { id: string; status: string; createdAt: string };
	}>(REQUEST_BENEFIT_MUTATION, { input: { benefitId } });
	return res.requestBenefit;
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
