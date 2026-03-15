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
			requiresContract
			contractId
			contractTemplateUrl
		}
	}
`;

const BENEFIT_REQUEST_CONTRACT_TEMPLATE_QUERY = gql`
	query BenefitRequestContractTemplate($requestId: ID!) {
		benefitRequestContractTemplate(requestId: $requestId) {
			requestId
			benefitId
			contractId
			contractVersion
			requiresContract
			html
		}
	}
`;

const SIGN_BENEFIT_CONTRACT_MUTATION = gql`
	mutation SignBenefitContract($requestId: ID!) {
		signBenefitContract(requestId: $requestId) {
			id
			status
			contractAcceptedAt
			contractVersionAccepted
			requiresContract
			contractId
			contractTemplateUrl
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

async function archiveContractPdfToR2(requestId: string, html: string): Promise<void> {
	const base = getBaseUrl();
	const res = await fetch(`${base}/contracts/requests/${requestId}/archive-pdf`, {
		method: "POST",
		headers: {
			"x-employee-id": getEmployeeId(),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ html }),
	});
	if (!res.ok) {
		const data = await res.json().catch(() => null);
		const message =
			data && typeof data === "object" && "error" in data
				? String((data as { error?: unknown }).error ?? "Failed to archive contract PDF")
				: "Failed to archive contract PDF";
		throw new Error(message);
	}
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
	_options?: {
		benefitName?: string;
		employeeName?: string;
		contractPopup?: Window | null;
	},
): Promise<{
	id: string;
	status: string;
	createdAt: string;
	requiresContract: boolean;
}> {
	const res = await getEmployeeClient().request<{
		requestBenefit: {
			id: string;
			status: string;
			createdAt: string;
			requiresContract: boolean;
			contractTemplateUrl?: string | null;
		};
	}>(REQUEST_BENEFIT_MUTATION, { input: { benefitId } });
	const request = res.requestBenefit;

	// Contract-required benefits: fetch dynamic HTML template and record employee signature.
	if (request.requiresContract) {
		const popup =
			_options?.contractPopup ??
			window.open("", "_blank", "noopener,noreferrer");
		if (!popup) {
			throw new Error("Popup blocked. Please allow popups and try again.");
		}

		const templateRes = await getEmployeeClient().request<{
			benefitRequestContractTemplate: { html: string };
		}>(BENEFIT_REQUEST_CONTRACT_TEMPLATE_QUERY, { requestId: request.id });

		const contractHtml = templateRes.benefitRequestContractTemplate?.html;
		if (contractHtml) {
			popup.document.open();
			popup.document.write(contractHtml);
			popup.document.close();
			await archiveContractPdfToR2(request.id, contractHtml);
		}

		await getEmployeeClient().request(SIGN_BENEFIT_CONTRACT_MUTATION, {
			requestId: request.id,
		});
	}

	return {
		id: request.id,
		status: request.status,
		createdAt: request.createdAt,
		requiresContract: request.requiresContract,
	};
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
