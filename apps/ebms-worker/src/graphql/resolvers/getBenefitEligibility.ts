/**
 * Shared: fetch benefit eligibility list for an employee.
 * Uses HR config (eligibility_config) when present — rules from config UI, no deploy needed.
 * Used by myBenefits query and Employee.benefits field resolver.
 */

import type { Env } from '../../types';
import { getDb } from '../../db/drizzle';
import { benefits as benefitsTable, benefitEligibility, benefitRequests } from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { asBool01, mapBenefitStatus, safeJsonParse } from './utils';
import {
  getActiveEligibilityConfig,
  getEmployeeForEligibility,
  evaluateBenefitRules,
} from '../../eligibility/engine';

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
  };
  status: 'ACTIVE' | 'ELIGIBLE' | 'LOCKED' | 'PENDING';
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
  computedAt: string;
};

export async function getBenefitEligibilityForEmployee(
  env: Env,
  employeeId: string
): Promise<BenefitEligibilityRow[]> {
  const db = getDb(env);
  const now = new Date().toISOString();

  const [config, employee, pendingRequestRows] = await Promise.all([
    getActiveEligibilityConfig(env),
    getEmployeeForEligibility(env, employeeId),
    db
      .select({ benefitId: benefitRequests.benefitId })
      .from(benefitRequests)
      .where(
        and(
          eq(benefitRequests.employeeId, employeeId),
          eq(benefitRequests.status, 'pending')
        )
      ),
  ]);

  const pendingBenefitIds = new Set(pendingRequestRows.map((r) => r.benefitId));

  const rows = await db
    .select({
      benefitId: benefitsTable.id,
      benefitName: benefitsTable.name,
      benefitCategory: benefitsTable.category,
      benefitSubsidyPercent: benefitsTable.subsidyPercent,
      benefitRequiresContract: benefitsTable.requiresContract,
      benefitVendorName: benefitsTable.vendorName,
      benefitActiveContractId: benefitsTable.activeContractId,
      eligibilityStatus: benefitEligibility.status,
      ruleEvaluationJson: benefitEligibility.ruleEvaluationJson,
      computedAt: benefitEligibility.computedAt,
    })
    .from(benefitsTable)
    .leftJoin(
      benefitEligibility,
      and(
        eq(benefitEligibility.benefitId, benefitsTable.id),
        eq(benefitEligibility.employeeId, employeeId)
      )
    )
    .where(eq(benefitsTable.isActive, 1))
    .orderBy(benefitsTable.category, benefitsTable.name);

  return rows.map((row) => {
    const benefitConfig = config?.[row.benefitId];
    const rules = benefitConfig?.rules;

    if (rules?.length && employee) {
      const { status, ruleEvaluations } = evaluateBenefitRules(rules, employee);
      let finalStatus: 'ACTIVE' | 'ELIGIBLE' | 'LOCKED' | 'PENDING' =
        row.eligibilityStatus === 'active' ? 'ACTIVE' : status;
      if (finalStatus === 'ELIGIBLE' && pendingBenefitIds.has(row.benefitId)) {
        finalStatus = 'PENDING';
      }
      return {
        benefit: {
          id: row.benefitId,
          name: row.benefitName,
          description: `${row.benefitCategory} benefit`,
          category: row.benefitCategory,
          subsidyPercent: row.benefitSubsidyPercent ?? 0,
          requiresContract: asBool01(row.benefitRequiresContract),
          vendorName: row.benefitVendorName ?? null,
          activeContractId: row.benefitActiveContractId ?? null,
        },
        status: finalStatus,
        ruleEvaluations,
        computedAt: now,
      };
    }

    const ruleEvaluationsRaw = row.ruleEvaluationJson
      ? safeJsonParse(row.ruleEvaluationJson, [])
      : [];
    const ruleEvaluations = Array.isArray(ruleEvaluationsRaw)
      ? ruleEvaluationsRaw.map((r: { rule_type?: string; ruleType?: string; passed?: boolean; reason?: string }) => ({
          ruleType: String(r.rule_type ?? r.ruleType ?? 'unknown'),
          passed: Boolean(r.passed),
          reason: String(r.reason ?? ''),
        }))
      : [];

    let status = mapBenefitStatus(row.eligibilityStatus ?? 'locked');
    if (status === 'ELIGIBLE' && pendingBenefitIds.has(row.benefitId)) {
      status = 'PENDING';
    }
    return {
      benefit: {
        id: row.benefitId,
        name: row.benefitName,
        description: `${row.benefitCategory} benefit`,
        category: row.benefitCategory,
        subsidyPercent: row.benefitSubsidyPercent ?? 0,
        requiresContract: asBool01(row.benefitRequiresContract),
        vendorName: row.benefitVendorName ?? null,
        activeContractId: row.benefitActiveContractId ?? null,
      },
      status,
      ruleEvaluations,
      computedAt: row.computedAt ?? now,
    };
  });
}
