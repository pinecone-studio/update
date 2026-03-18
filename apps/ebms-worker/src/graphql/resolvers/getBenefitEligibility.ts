/**
 * Shared: fetch benefit eligibility list for an employee.
 * Uses HR config (eligibility_config) when present — rules from config UI, no deploy needed.
 * Used by myBenefits query and Employee.benefits field resolver.
 */

import type { Env } from "../../types";
import { getDb } from "../../db/drizzle";
import {
  benefits as benefitsTable,
  benefitEligibility,
  benefitRequests,
} from "../../db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { asBool01, mapBenefitStatus, safeJsonParse } from "./utils";
import {
  getActiveEligibilityConfig,
  getEmployeeForEligibility,
  evaluateBenefitRules,
} from "../../eligibility/engine";
import { dispatchEmployeeWarningsIfNeeded } from "../../notifications/dispatcher";

async function safeDispatch(task: () => Promise<void>): Promise<void> {
  try {
    await task();
  } catch (error) {
    // Notification delivery should never block eligibility/me queries.
    console.error("Notification dispatch failed:", error);
  }
}

export type BenefitEligibilityRow = {
  benefit: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    subsidyPercent: number;
    requiresContract: boolean;
    vendorName: string | null;
    activeContractId: string | null;
    requestDeadline?: string | null;
    usageLimitCount: number;
    usageLimitPeriod?: string | null;
  };
  status: "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING" | "REJECTED";
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
  computedAt: string;
  rejectedReason?: string | null;
  overrideApplied: boolean;
  overrideReason?: string | null;
  /** When status is PENDING: "admin" or "finance" — who must approve next */
  pendingApprovalBy?: string | null;
  /** When status is ACTIVE and contract uploaded: request ID for view/download */
  uploadedContractRequestId?: string | null;
};

export async function getBenefitEligibilityForEmployee(
  env: Env,
  employeeId: string,
): Promise<BenefitEligibilityRow[]> {
  const db = getDb(env);
  const now = new Date().toISOString();

  const [
    config,
    employee,
    pendingRequestRows,
    rejectedRequestRows,
    approvedWithContractRows,
    approvedRequestsForUsage,
  ] = await Promise.all([
    getActiveEligibilityConfig(env),
    getEmployeeForEligibility(env, employeeId),
    db
      .select({
        benefitId: benefitRequests.benefitId,
        requestStatus: benefitRequests.status,
      })
      .from(benefitRequests)
      .where(
        and(
          eq(benefitRequests.employeeId, employeeId),
          inArray(benefitRequests.status, ["pending", "admin_approved"]),
        ),
      ),
    db
      .select({
        benefitId: benefitRequests.benefitId,
        rejectReason: benefitRequests.rejectReason,
      })
      .from(benefitRequests)
      .where(
        and(
          eq(benefitRequests.employeeId, employeeId),
          eq(benefitRequests.status, "rejected"),
        ),
      )
      .orderBy(desc(benefitRequests.createdAt)),
    db
      .select({
        id: benefitRequests.id,
        benefitId: benefitRequests.benefitId,
        employeeContractR2Key: benefitRequests.employeeContractR2Key,
      })
      .from(benefitRequests)
      .where(
        and(
          eq(benefitRequests.employeeId, employeeId),
          eq(benefitRequests.status, "approved"),
        ),
      ),
    db
      .select({
        benefitId: benefitRequests.benefitId,
        updatedAt: benefitRequests.updatedAt,
      })
      .from(benefitRequests)
      .where(
        and(
          eq(benefitRequests.employeeId, employeeId),
          eq(benefitRequests.status, "approved"),
        ),
      ),
  ]);

  const uploadedContractByBenefit = new Map<string, string>();
  for (const r of approvedWithContractRows) {
    if (r.employeeContractR2Key) {
      uploadedContractByBenefit.set(r.benefitId, r.id);
    }
  }

  const nowDate = new Date();
  const currentYear = nowDate.getFullYear();
  const currentMonth = nowDate.getMonth();
  const approvedInMonthByBenefit = new Map<string, number>();
  const approvedInYearByBenefit = new Map<string, number>();
  for (const r of approvedRequestsForUsage) {
    const updatedAt = r.updatedAt ?? "";
    const d = new Date(updatedAt);
    if (Number.isNaN(d.getTime())) continue;
    if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
      const prev = approvedInMonthByBenefit.get(r.benefitId) ?? 0;
      approvedInMonthByBenefit.set(r.benefitId, prev + 1);
    }
    if (d.getFullYear() === currentYear) {
      const prev = approvedInYearByBenefit.get(r.benefitId) ?? 0;
      approvedInYearByBenefit.set(r.benefitId, prev + 1);
    }
  }

  if (employee) {
    await safeDispatch(async () => {
      await dispatchEmployeeWarningsIfNeeded(env, employeeId, {
        employmentStatus:
          typeof employee.employmentStatus === "string"
            ? employee.employmentStatus
            : "",
        okrSubmitted: Boolean(employee.okrSubmitted),
        lateArrivalCount:
          typeof employee.lateArrivalCount === "number"
            ? employee.lateArrivalCount
            : Number(employee.lateArrivalCount ?? 0),
      });
    });
  }

  const pendingBenefitIds = new Set(pendingRequestRows.map((r) => r.benefitId));
  const pendingRequestStatusByBenefit = new Map<string, string>();
  for (const r of pendingRequestRows) {
    pendingRequestStatusByBenefit.set(r.benefitId, r.requestStatus ?? "pending");
  }
  const rejectedByBenefit = new Map<string, string>();
  for (const r of rejectedRequestRows) {
    if (!rejectedByBenefit.has(r.benefitId)) {
      rejectedByBenefit.set(r.benefitId, r.rejectReason ?? "");
    }
  }

  const rows = await db
    .select({
      benefitId: benefitsTable.id,
      benefitName: benefitsTable.name,
      benefitDescription: benefitsTable.description,
      benefitCategory: benefitsTable.category,
      benefitSubsidyPercent: benefitsTable.subsidyPercent,
      benefitRequiresContract: benefitsTable.requiresContract,
      benefitVendorName: benefitsTable.vendorName,
      benefitActiveContractId: benefitsTable.activeContractId,
      benefitRequestDeadline: benefitsTable.requestDeadline,
      benefitUsageLimitCount: benefitsTable.usageLimitCount,
      benefitUsageLimitPeriod: benefitsTable.usageLimitPeriod,
      eligibilityStatus: benefitEligibility.status,
      ruleEvaluationJson: benefitEligibility.ruleEvaluationJson,
      computedAt: benefitEligibility.computedAt,
      overrideBy: benefitEligibility.overrideBy,
      overrideReason: benefitEligibility.overrideReason,
      overrideExpiresAt: benefitEligibility.overrideExpiresAt,
    })
    .from(benefitsTable)
    .leftJoin(
      benefitEligibility,
      and(
        eq(benefitEligibility.benefitId, benefitsTable.id),
        eq(benefitEligibility.employeeId, employeeId),
      ),
    )
    .where(eq(benefitsTable.isActive, 1))
    .orderBy(benefitsTable.category, benefitsTable.name);

  function isOverrideActive(
    overrideBy: string | null,
    overrideExpiresAt: string | null,
  ): boolean {
    if (!overrideBy) return false;
    if (!overrideExpiresAt) return true;
    const expiry = new Date(overrideExpiresAt);
    if (Number.isNaN(expiry.getTime())) return true;
    return expiry.getTime() > Date.now();
  }

  function normalizeStatus(
    raw: string | null | undefined,
  ): "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING" | "REJECTED" {
    const s = String(raw ?? "").toLowerCase();
    if (s === "active") return "ACTIVE";
    if (s === "eligible") return "ELIGIBLE";
    if (s === "pending") return "PENDING";
    if (s === "rejected") return "REJECTED";
    return "LOCKED";
  }

  function isRequestDeadlinePassed(deadline: string | null): boolean {
    if (!deadline?.trim()) return false;
    const d = new Date(deadline);
    if (Number.isNaN(d.getTime())) return false;
    return d.getTime() < Date.now();
  }

  function hasApprovedInCurrentPeriod(
    benefitId: string,
    period: string | null,
  ): boolean {
    if (!period) return false;
    const count =
      period === "year"
        ? approvedInYearByBenefit.get(benefitId) ?? 0
        : approvedInMonthByBenefit.get(benefitId) ?? 0;
    return count >= 1;
  }

  const results: BenefitEligibilityRow[] = [];
  for (const row of rows) {
    if (isRequestDeadlinePassed(row.benefitRequestDeadline ?? null)) {
      results.push({
        benefit: {
          id: row.benefitId,
          name: row.benefitName,
          description:
            row.benefitDescription ?? `${row.benefitCategory} benefit`,
          category: row.benefitCategory,
          subsidyPercent: row.benefitSubsidyPercent ?? 0,
          requiresContract: asBool01(row.benefitRequiresContract),
          vendorName: row.benefitVendorName ?? null,
          activeContractId: row.benefitActiveContractId ?? null,
          requestDeadline: row.benefitRequestDeadline ?? null,
          usageLimitCount: row.benefitUsageLimitCount ?? 1,
          usageLimitPeriod: row.benefitUsageLimitPeriod ?? null,
        },
        status: "LOCKED",
        ruleEvaluations: [
          {
            ruleType: "request_deadline",
            passed: false,
            reason: "Хүсэлт илгээх хугацаа дууссан",
          },
        ],
        computedAt: now,
        rejectedReason: null,
        overrideApplied: false,
        overrideReason: null,
        pendingApprovalBy: null,
        uploadedContractRequestId: null,
      });
      continue;
    }

    const benefitConfig = config?.[row.benefitId];
    const rules = benefitConfig?.rules;
    const overrideActive = isOverrideActive(
      row.overrideBy ?? null,
      row.overrideExpiresAt ?? null,
    );
    const usagePeriod = row.benefitUsageLimitPeriod ?? null;
    const hasApprovedInPeriod = hasApprovedInCurrentPeriod(
      row.benefitId,
      usagePeriod,
    );

    if (rules?.length && employee) {
      const { status, ruleEvaluations } = evaluateBenefitRules(rules, employee);
      let finalStatus:
        | "ACTIVE"
        | "ELIGIBLE"
        | "LOCKED"
        | "PENDING"
        | "REJECTED" = overrideActive
        ? normalizeStatus(row.eligibilityStatus)
        : row.eligibilityStatus === "active"
          ? "ACTIVE"
          : status;
      if (usagePeriod && hasApprovedInPeriod && finalStatus !== "PENDING") {
        finalStatus = "ACTIVE";
      }
      if (finalStatus === "ELIGIBLE" && pendingBenefitIds.has(row.benefitId)) {
        finalStatus = "PENDING";
      }
      if (
        rejectedByBenefit.has(row.benefitId) &&
        !pendingBenefitIds.has(row.benefitId) &&
        finalStatus !== "ACTIVE"
      ) {
        finalStatus = "REJECTED";
      }

      const reqStatus = pendingRequestStatusByBenefit.get(row.benefitId) ?? "pending";
      const pendingApprovalBy =
        finalStatus === "PENDING"
          ? (reqStatus === "admin_approved" && benefitConfig?.financeCheck
              ? "finance"
              : "admin")
          : null;

      const uploadedContractRequestId =
        finalStatus === "ACTIVE" && asBool01(row.benefitRequiresContract)
          ? (uploadedContractByBenefit.get(row.benefitId) ?? null)
          : null;

      results.push({
        benefit: {
          id: row.benefitId,
          name: row.benefitName,
          description:
            row.benefitDescription ?? `${row.benefitCategory} benefit`,
          category: row.benefitCategory,
          subsidyPercent: row.benefitSubsidyPercent ?? 0,
          requiresContract: asBool01(row.benefitRequiresContract),
          vendorName: row.benefitVendorName ?? null,
          activeContractId: row.benefitActiveContractId ?? null,
          requestDeadline: row.benefitRequestDeadline ?? null,
          usageLimitCount: row.benefitUsageLimitCount ?? 1,
          usageLimitPeriod: row.benefitUsageLimitPeriod ?? null,
        },
        status: finalStatus,
        ruleEvaluations: overrideActive
          ? [
              {
                ruleType: "override",
                passed: true,
                reason: row.overrideReason ?? "HR override",
              },
            ]
          : ruleEvaluations,
        computedAt: now,
        rejectedReason:
          finalStatus === "REJECTED"
            ? (rejectedByBenefit.get(row.benefitId) ?? null)
            : null,
        overrideApplied: overrideActive,
        overrideReason: overrideActive
          ? (row.overrideReason ?? "HR override")
          : null,
        pendingApprovalBy,
        uploadedContractRequestId,
      });
      continue;
    }

    const ruleEvaluationsRaw = row.ruleEvaluationJson
      ? safeJsonParse(row.ruleEvaluationJson, [])
      : [];
    const ruleEvaluations = Array.isArray(ruleEvaluationsRaw)
      ? ruleEvaluationsRaw.map(
          (r: {
            rule_type?: string;
            ruleType?: string;
            passed?: boolean;
            reason?: string;
          }) => ({
            ruleType: String(r.rule_type ?? r.ruleType ?? "unknown"),
            passed: Boolean(r.passed),
            reason: String(r.reason ?? ""),
          }),
        )
      : [];

    // If no rule config and no stored eligibility row, default to ELIGIBLE
    // so "rule-not-configured" benefits are requestable instead of LOCKED.
    const baseStatus = row.eligibilityStatus
      ? mapBenefitStatus(row.eligibilityStatus)
      : "ELIGIBLE";
    let status: "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING" | "REJECTED" =
      baseStatus;
    if (usagePeriod && hasApprovedInPeriod && status !== "PENDING") {
      status = "ACTIVE";
    }
    if (status === "ELIGIBLE" && pendingBenefitIds.has(row.benefitId)) {
      status = "PENDING";
    }
    if (
      rejectedByBenefit.has(row.benefitId) &&
      !pendingBenefitIds.has(row.benefitId) &&
      status !== "ACTIVE"
    ) {
      status = "REJECTED";
    }
    const benefitConfigNoRules = config?.[row.benefitId];
    const reqStatusNoRules = pendingRequestStatusByBenefit.get(row.benefitId) ?? "pending";
    const pendingApprovalBy =
      status === "PENDING"
        ? (reqStatusNoRules === "admin_approved" && benefitConfigNoRules?.financeCheck
            ? "finance"
            : "admin")
        : null;

    const uploadedContractRequestId =
      status === "ACTIVE" && asBool01(row.benefitRequiresContract)
        ? (uploadedContractByBenefit.get(row.benefitId) ?? null)
        : null;

    results.push({
      benefit: {
        id: row.benefitId,
        name: row.benefitName,
        description: row.benefitDescription ?? `${row.benefitCategory} benefit`,
        category: row.benefitCategory,
        subsidyPercent: row.benefitSubsidyPercent ?? 0,
        requiresContract: asBool01(row.benefitRequiresContract),
        vendorName: row.benefitVendorName ?? null,
        activeContractId: row.benefitActiveContractId ?? null,
        requestDeadline: row.benefitRequestDeadline ?? null,
        usageLimitCount: row.benefitUsageLimitCount ?? 1,
        usageLimitPeriod: row.benefitUsageLimitPeriod ?? null,
      },
      status,
      ruleEvaluations,
      computedAt: row.computedAt ?? now,
      rejectedReason:
        status === "REJECTED"
          ? (rejectedByBenefit.get(row.benefitId) ?? null)
          : null,
      overrideApplied: overrideActive,
      overrideReason: overrideActive
        ? (row.overrideReason ?? "HR override")
        : null,
      pendingApprovalBy,
      uploadedContractRequestId,
    });
  }

  return results;
}
