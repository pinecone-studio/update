import { GraphQLError } from 'graphql';
import type { Ctx } from '../context';
import { requireEmployeeId } from '../context';
import { mapRequestStatus } from '../utils';
import type { MutationResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { benefitEligibility, benefitRequests } from '../../../db/schema';
import { and, eq } from 'drizzle-orm';

export const confirmBenefitRequest: NonNullable<
  MutationResolvers<Ctx>['confirmBenefitRequest']
> = async (_, args, ctx) => {
  const actorId = requireEmployeeId(ctx);
  const role = (ctx.role ?? '').toLowerCase();
  const isHrOrAdmin = role === 'hr' || role === 'admin';
  const { requestId, contractAccepted } = args;
  if (!requestId) {
    throw new GraphQLError('requestId is required', { extensions: { code: 'BAD_USER_INPUT' } });
  }

  const db = getDb(ctx.env);

  const rows = await db
    .select({
      id: benefitRequests.id,
      employeeId: benefitRequests.employeeId,
      benefitId: benefitRequests.benefitId,
      status: benefitRequests.status,
      createdAt: benefitRequests.createdAt,
    })
    .from(benefitRequests)
    .where(eq(benefitRequests.id, requestId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    throw new GraphQLError('Request not found', { extensions: { code: 'NOT_FOUND' } });
  }
  // Employee can confirm only their own request; HR/admin can approve/reject any request.
  if (row.employeeId !== actorId && !isHrOrAdmin) {
    throw new GraphQLError('Forbidden', { extensions: { code: 'FORBIDDEN' } });
  }

  const now = new Date().toISOString();
  const newStatus = contractAccepted ? 'approved' : 'rejected';
  await db
    .update(benefitRequests)
    .set({
      status: newStatus,
      contractAcceptedAt: contractAccepted ? now : null,
      reviewedBy: isHrOrAdmin ? actorId : null,
      updatedAt: now,
    })
    .where(eq(benefitRequests.id, requestId));

  // When HR/admin approves a request, reflect it immediately in employee myBenefits as ACTIVE.
  if (contractAccepted) {
    const existingEligibility = await db
      .select({
        employeeId: benefitEligibility.employeeId,
      })
      .from(benefitEligibility)
      .where(
        and(
          eq(benefitEligibility.employeeId, row.employeeId),
          eq(benefitEligibility.benefitId, row.benefitId)
        )
      )
      .limit(1);

    if (existingEligibility[0]) {
      await db
        .update(benefitEligibility)
        .set({
          status: 'active',
          computedAt: now,
          overrideBy: isHrOrAdmin ? actorId : null,
          overrideReason: isHrOrAdmin ? 'Approved by admin/hr' : 'Contract accepted by employee',
        })
        .where(
          and(
            eq(benefitEligibility.employeeId, row.employeeId),
            eq(benefitEligibility.benefitId, row.benefitId)
          )
        );
    } else {
      await db.insert(benefitEligibility).values({
        employeeId: row.employeeId,
        benefitId: row.benefitId,
        status: 'active',
        ruleEvaluationJson: '[]',
        computedAt: now,
        overrideBy: isHrOrAdmin ? actorId : null,
        overrideReason: isHrOrAdmin ? 'Approved by admin/hr' : 'Contract accepted by employee',
        overrideExpiresAt: null,
      });
    }
  }

  return {
    id: row.id,
    employeeId: row.employeeId,
    benefitId: row.benefitId,
    status: mapRequestStatus(newStatus),
    createdAt: row.createdAt ?? now,
  };
};
