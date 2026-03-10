import { GraphQLError } from 'graphql';
import type { Ctx } from '../context';
import { requireHR } from '../context';
import { mapBenefitStatus } from '../utils';
import type { MutationResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import {
  benefits as benefitsTable,
  benefitEligibility,
  eligibilityAudit,
} from '../../../db/schema';
import { and, eq } from 'drizzle-orm';
import { getBenefitEligibilityForEmployee } from '../getBenefitEligibility';

export const overrideEligibility: NonNullable<
  MutationResolvers<Ctx>['overrideEligibility']
> = async (_:any, args:any, ctx:any) => {
  const db = getDb(ctx.env);

  const { employeeId, benefitId, status, reason, expiresAt } = args.input;

  const benefitRows = await db
    .select({ id: benefitsTable.id, name: benefitsTable.name, category: benefitsTable.category, subsidyPercent: benefitsTable.subsidyPercent, requiresContract: benefitsTable.requiresContract })
    .from(benefitsTable)
    .where(eq(benefitsTable.id, benefitId))
    .limit(1);
  if (!benefitRows[0]) {
    throw new GraphQLError('Benefit not found', { extensions: { code: 'NOT_FOUND' } });
  }

  const now = new Date().toISOString();
  const statusLower = status.toLowerCase();
  const overrideBy = ctx.employeeId ?? 'system';
  const ruleJson = JSON.stringify([{ ruleType: 'override', passed: true, reason: reason ?? 'HR override' }]);

  const existing = await db
    .select()
    .from(benefitEligibility)
    .where(
      and(
        eq(benefitEligibility.employeeId, employeeId),
        eq(benefitEligibility.benefitId, benefitId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(benefitEligibility)
      .set({
        status: statusLower,
        ruleEvaluationJson: ruleJson,
        computedAt: now,
        overrideBy,
        overrideReason: reason ?? null,
        overrideExpiresAt: expiresAt ?? null,
      })
      .where(
        and(
          eq(benefitEligibility.employeeId, employeeId),
          eq(benefitEligibility.benefitId, benefitId)
        )
      );
  } else {
    await db.insert(benefitEligibility).values({
      employeeId,
      benefitId,
      status: statusLower,
      ruleEvaluationJson: ruleJson,
      computedAt: now,
      overrideBy,
      overrideReason: reason ?? null,
      overrideExpiresAt: expiresAt ?? null,
    });
  }

  const auditId = crypto.randomUUID();
  await db.insert(eligibilityAudit).values({
    id: auditId,
    employeeId,
    benefitId,
    oldStatus: null,
    newStatus: statusLower,
    ruleTraceJson: JSON.stringify({ override: true, reason, overrideBy }),
    triggeredBy: overrideBy,
    computedAt: now,
    createdAt: now,
  });

  const list = await getBenefitEligibilityForEmployee(ctx.env, employeeId);
  const entry = list.find((e) => e.benefit.id === benefitId);
  if (!entry) {
    throw new GraphQLError('Eligibility not found after override', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }

  return {
    benefit: {
      ...entry.benefit,
      activeContract: null,
    },
    status: mapBenefitStatus(entry.status),
    ruleEvaluations: entry.ruleEvaluations,
    computedAt: entry.computedAt,
  };
};
