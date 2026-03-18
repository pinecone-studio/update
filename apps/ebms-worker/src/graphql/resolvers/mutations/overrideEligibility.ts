import { GraphQLError } from "graphql";
import type { Ctx } from "../context";
import { requireHR } from "../context";
import { mapBenefitStatus } from "../utils";
import type { MutationResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import {
  benefits as benefitsTable,
  benefitEligibility,
  eligibilityAudit,
} from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import { getBenefitEligibilityForEmployee } from "../getBenefitEligibility";
import { dispatchEmployeeNotification } from "../../../notifications/dispatcher";

export const overrideEligibility: NonNullable<
  MutationResolvers<Ctx>["overrideEligibility"]
> = async (_: any, args: any, ctx: any) => {
  requireHR(ctx);
  const db = getDb(ctx.env);

  const { employeeId, benefitId, status, reason, expiresAt } = args.input;

  const benefitRows = await db
    .select({
      id: benefitsTable.id,
      name: benefitsTable.name,
      category: benefitsTable.category,
      subsidyPercent: benefitsTable.subsidyPercent,
      requiresContract: benefitsTable.requiresContract,
    })
    .from(benefitsTable)
    .where(eq(benefitsTable.id, benefitId))
    .limit(1);
  if (!benefitRows[0]) {
    throw new GraphQLError("Benefit not found", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  const now = new Date().toISOString();
  const statusLower = status.toLowerCase();
  const overrideBy = ctx.employeeId ?? "system";
  const ruleJson = JSON.stringify([
    { ruleType: "override", passed: true, reason: reason ?? "HR override" },
  ]);

  const existing = await db
    .select()
    .from(benefitEligibility)
    .where(
      and(
        eq(benefitEligibility.employeeId, employeeId),
        eq(benefitEligibility.benefitId, benefitId),
      ),
    )
    .limit(1);
  const prevStatus = (existing[0]?.status ?? "").toLowerCase();

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
          eq(benefitEligibility.benefitId, benefitId),
        ),
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
    oldStatus: prevStatus || null,
    newStatus: statusLower,
    ruleTraceJson: JSON.stringify({ override: true, reason, overrideBy }),
    triggeredBy: overrideBy,
    computedAt: now,
    createdAt: now,
  });

  const benefitName = benefitRows[0]?.name ?? 'benefit';
  if (prevStatus !== statusLower) {
    if (statusLower === 'eligible') {
      await dispatchEmployeeNotification(ctx.env, {
        employeeId,
        type: 'ELIGIBILITY_CHANGE',
        tone: 'info',
        dedupeKey: `eligibility:${benefitId}:override:unlocked`,
        title: 'Benefit Unlocked',
        body: `Your ${benefitName} benefit is now ELIGIBLE. You can request this benefit from your dashboard.`,
        metadata: { benefitId, reason: reason ?? null },
      });
    } else if (statusLower === 'locked') {
      await dispatchEmployeeNotification(ctx.env, {
        employeeId,
        type: 'ELIGIBILITY_CHANGE',
        tone: 'warning',
        dedupeKey: `eligibility:${benefitId}:override:locked`,
        title: 'Eligibility Restricted',
        body: `Your ${benefitName} benefit eligibility has been restricted. Contact HR if you have questions.`,
        metadata: { benefitId, reason: reason ?? null },
      });
    } else if (statusLower === 'active') {
      await dispatchEmployeeNotification(ctx.env, {
        employeeId,
        type: 'ELIGIBILITY_CHANGE',
        tone: 'success',
        dedupeKey: `eligibility:${benefitId}:override:active`,
        title: 'Benefit Activated',
        body: `Your ${benefitName} benefit is now ACTIVE.`,
        metadata: { benefitId, reason: reason ?? null },
      });
    } else if (statusLower === 'pending') {
      await dispatchEmployeeNotification(ctx.env, {
        employeeId,
        type: 'ELIGIBILITY_CHANGE',
        tone: 'info',
        dedupeKey: `eligibility:${benefitId}:override:pending`,
        title: 'Benefit Pending',
        body: `Your ${benefitName} benefit is pending review.`,
        metadata: { benefitId, reason: reason ?? null },
      });
    }
  }

  const list = await getBenefitEligibilityForEmployee(ctx.env, employeeId);
  const entry = list.find((e) => e.benefit.id === benefitId);
  if (!entry) {
    throw new GraphQLError("Eligibility not found after override", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
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
    rejectedReason: entry.rejectedReason ?? null,
    overrideApplied: entry.overrideApplied,
    overrideReason: entry.overrideReason ?? null,
  };
};
