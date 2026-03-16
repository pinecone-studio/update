/** @format */

"use client";

import { GraphQLClient, gql } from "graphql-request";
import type { Me, MyBenefitEligibility } from "./types";
import { getActiveUserHeaders, getActiveUserProfile } from "@/app/_lib/activeUser";
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

const BENEFIT_CONTRACT_PREVIEW_QUERY = gql`
	query BenefitContractPreview($benefitId: ID!) {
		benefitContractPreview(benefitId: $benefitId) {
			html
		}
	}
`;

const ARCHIVE_BENEFIT_CONTRACT_PDF_MUTATION = gql`
	mutation ArchiveBenefitContractPdf($requestId: ID!, $html: String) {
		archiveBenefitContractPdf(requestId: $requestId, html: $html) {
			ok
			requestId
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
	return getActiveUserProfile().id;
}

export function getEmployeeClient(): GraphQLClient {
	const base = getBaseUrl();
	const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
	return new GraphQLClient(url, {
		headers: {
			...getActiveUserHeaders("employee"),
			"Content-Type": "application/json",
		},
	});
}

async function archiveContractPdfToR2(requestId: string, html: string): Promise<void> {
	await getEmployeeClient().request(ARCHIVE_BENEFIT_CONTRACT_PDF_MUTATION, {
		requestId,
		html,
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

export async function openBenefitContractPreview(
	benefitId: string,
	popup?: Window | null,
): Promise<void> {
	const target = popup ?? window.open("", "_blank", "noopener,noreferrer");
	if (!target) throw new Error("Popup blocked. Please allow popups and try again.");
	const res = await getEmployeeClient().request<{
		benefitContractPreview: { html: string };
	}>(BENEFIT_CONTRACT_PREVIEW_QUERY, { benefitId });
	target.document.open();
	target.document.write(res.benefitContractPreview.html);
	target.document.close();
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

// --- Benefit feedback (voting) ---

export type FeedbackItem = {
	id: string;
	text: string;
	benefitId: string | null;
	isAnonymous: boolean;
	status: "OPEN" | "EXPIRED" | "ESCALATED";
	createdAt: string;
	votingEndsAt: string;
	voteCount: number;
	hasVoted: boolean;
	isCreator?: boolean;
};

function getFeedbackBaseUrl(): string {
	const env = process.env.NEXT_PUBLIC_API_URL || "";
	const base = env.replace(/\/graphql\/?$/, "").trim();
	return base || "http://localhost:8787";
}

function getFeedbackHeaders(): Record<string, string> {
	return {
		"Content-Type": "application/json",
		"x-employee-id": getEmployeeId(),
		"x-role": "employee",
	};
}

export async function fetchFeedbackList(): Promise<FeedbackItem[]> {
	const res = await fetch(`${getFeedbackBaseUrl()}/feedback`, {
		headers: getFeedbackHeaders(),
	});
	if (!res.ok) {
		const data = await res.json().catch(() => null);
		throw new Error(data?.error ?? "Failed to fetch feedback");
	}
	const json = await res.json();
	return json.items ?? [];
}

export async function fetchOpenFeedbackCount(): Promise<number> {
	const res = await fetch(`${getFeedbackBaseUrl()}/feedback/open-count`, {
		headers: getFeedbackHeaders(),
	});
	if (!res.ok) return 0;
	const json = await res.json();
	return Number(json.count ?? 0);
}

export async function createFeedback(params: {
	text: string;
	benefitId?: string;
	isAnonymous?: boolean;
}): Promise<FeedbackItem> {
	const res = await fetch(`${getFeedbackBaseUrl()}/feedback`, {
		method: "POST",
		headers: getFeedbackHeaders(),
		body: JSON.stringify(params),
	});
	if (!res.ok) {
		const data = await res.json().catch(() => null);
		throw new Error(data?.error ?? "Failed to create feedback");
	}
	return res.json();
}

export async function voteFeedback(feedbackId: string): Promise<{
	voteCount: number;
	status: string;
}> {
	const res = await fetch(
		`${getFeedbackBaseUrl()}/feedback/${feedbackId}/vote`,
		{
			method: "POST",
			headers: getFeedbackHeaders(),
		},
	);
	if (!res.ok) {
		const data = await res.json().catch(() => null);
		throw new Error(data?.error ?? "Failed to vote");
	}
	return res.json();
}

export async function unvoteFeedback(feedbackId: string): Promise<{
	voteCount: number;
}> {
	const res = await fetch(
		`${getFeedbackBaseUrl()}/feedback/${feedbackId}/vote`,
		{
			method: "DELETE",
			headers: getFeedbackHeaders(),
		},
	);
	if (!res.ok) {
		const data = await res.json().catch(() => null);
		throw new Error(data?.error ?? "Failed to remove vote");
	}
	return res.json();
}

export async function deleteFeedback(feedbackId: string): Promise<{
	deleted: boolean;
}> {
	const res = await fetch(`${getFeedbackBaseUrl()}/feedback/${feedbackId}`, {
		method: "DELETE",
		headers: getFeedbackHeaders(),
	});
	if (!res.ok) {
		const data = await res.json().catch(() => null);
		throw new Error(data?.error ?? "Failed to delete feedback");
	}
	return res.json();
}
