import type { Ctx } from '../context';
import { requireEmployeeId } from '../context';
import { asBool01, mapBenefitStatus, safeJsonParse } from '../utils';
import type { QueryResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { benefits as benefitsTable, benefitEligibility } from '../../../db/schema';
import { and, eq } from 'drizzle-orm';

export const myBenefits: NonNullable<QueryResolvers<Ctx>['myBenefits']> = async (
  _,
  __,
  ctx
) => {
  const employeeId = requireEmployeeId(ctx);
  const db = getDb(ctx.env);

  const rows = await db
    .select({
      benefitId: benefitsTable.id,
      benefitName: benefitsTable.name,
      benefitCategory: benefitsTable.category,
      benefitSubsidyPercent: benefitsTable.subsidyPercent,
      benefitVendorName: benefitsTable.vendorName,
      benefitRequiresContract: benefitsTable.requiresContract,
      benefitIsActive: benefitsTable.isActive,
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
    const ruleEvaluationsRaw = row.ruleEvaluationJson
      ? safeJsonParse(row.ruleEvaluationJson, [])
      : [];
    const ruleEvaluations = Array.isArray(ruleEvaluationsRaw)
      ? ruleEvaluationsRaw.map((r: any) => ({
          ruleType: String(r.rule_type ?? r.ruleType ?? 'unknown'),
          passed: Boolean(r.passed),
          reason: String(r.reason ?? ''),
        }))
      : [];

    return {
      benefit: {
        id: row.benefitId,
        name: row.benefitName,
        category: row.benefitCategory,
        subsidyPercent: row.benefitSubsidyPercent ?? 0,
        vendorName: row.benefitVendorName ?? null,
        requiresContract: asBool01(row.benefitRequiresContract),
        isActive: asBool01(row.benefitIsActive),
      },
      status: mapBenefitStatus(row.eligibilityStatus ?? 'locked'),
      ruleEvaluations,
      computedAt: row.computedAt ?? new Date().toISOString(),
    };
  });
};

