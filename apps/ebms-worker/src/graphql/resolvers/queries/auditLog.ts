import type { Ctx } from '../context';
import { requireHROrAdminOrFinance } from '../context';
import type { QueryResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { eligibilityAudit } from '../../../db/schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';

export const auditLog: NonNullable<QueryResolvers<Ctx>['auditLog']> = async (
  _,
  args,
  ctx
) => {
  requireHROrAdminOrFinance(ctx);
  const db = getDb(ctx.env);
  const filters = args.filters;

  let conditions = [sql`1=1`];
  if (filters.employeeId) {
    conditions.push(eq(eligibilityAudit.employeeId, filters.employeeId));
  }
  if (filters.benefitId) {
    conditions.push(eq(eligibilityAudit.benefitId, filters.benefitId));
  }
  if (filters.from) {
    conditions.push(gte(eligibilityAudit.computedAt, filters.from));
  }

  if (filters.to) {
    conditions.push(lte(eligibilityAudit.computedAt, filters.to));
  }

  const rows = await db
    .select({
      id: eligibilityAudit.id,
      employeeId: eligibilityAudit.employeeId,
      benefitId: eligibilityAudit.benefitId,
      oldStatus: eligibilityAudit.oldStatus,
      newStatus: eligibilityAudit.newStatus,
      computedAt: eligibilityAudit.computedAt,
      triggeredBy: eligibilityAudit.triggeredBy,
      createdAt: eligibilityAudit.createdAt,
    })
    .from(eligibilityAudit)
    .where(and(...conditions))
    .orderBy(sql`${eligibilityAudit.computedAt} DESC`);

  return rows.map((r) => ({
    id: r.id,
    employeeId: r.employeeId,
    benefitId: r.benefitId,
    oldStatus: r.oldStatus ?? null,
    newStatus: r.newStatus,
    computedAt: r.computedAt,
    triggeredBy: r.triggeredBy ?? null,
    createdAt: r.createdAt ?? '',
  }));
};
