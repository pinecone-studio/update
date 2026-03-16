import { GraphQLError } from 'graphql';
import type { Ctx } from '../context';
import { requireEmployeeId, requireHR } from '../context';
import { mapRequestStatus } from '../utils';
import type { MutationResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { benefitEligibility, benefitRequests, benefits, contracts } from '../../../db/schema';
import { and, eq } from 'drizzle-orm';
import { dispatchEmployeeNotification } from '../../../notifications/dispatcher';

export const confirmBenefitRequest: NonNullable<
  MutationResolvers<Ctx>['confirmBenefitRequest']
> = async (_, args, ctx) => {
  const actorId = requireEmployeeId(ctx);
  requireHR(ctx);
  const { requestId, contractAccepted, rejectReason } = args;
  if (!requestId) {
    throw new GraphQLError('requestId is required', { extensions: { code: 'BAD_USER_INPUT' } });
  }

  const db = getDb(ctx.env);

  const rows = await db
    .select({
      id: benefitRequests.id,
      employeeId: benefitRequests.employeeId,
      benefitId: benefitRequests.benefitId,
      benefitName: benefits.name,
      status: benefitRequests.status,
      createdAt: benefitRequests.createdAt,
      rejectReason: benefitRequests.rejectReason,
      contractVersionAccepted: benefitRequests.contractVersionAccepted,
      contractAcceptedAt: benefitRequests.contractAcceptedAt,
      requiresContract: benefits.requiresContract,
      activeContractId: benefits.activeContractId,
      activeContractVersion: contracts.version,
    })
    .from(benefitRequests)
    .leftJoin(benefits, eq(benefitRequests.benefitId, benefits.id))
    .leftJoin(contracts, eq(benefits.activeContractId, contracts.id))
    .where(eq(benefitRequests.id, requestId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    throw new GraphQLError('Request not found', { extensions: { code: 'NOT_FOUND' } });
  }
  const currentStatus = (row.status ?? '').toLowerCase();
  if (currentStatus !== 'pending') {
    throw new GraphQLError('Only pending requests can be reviewed', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const requiresContract = row.requiresContract === 1;
  if (contractAccepted && requiresContract) {
    if (!row.contractAcceptedAt || !row.contractVersionAccepted) {
      throw new GraphQLError('Employee must sign the contract before approval', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
    if (row.activeContractVersion && row.contractVersionAccepted !== row.activeContractVersion) {
      throw new GraphQLError('Signed contract version is outdated. Please sign active contract again.', {
        extensions: { code: 'CONFLICT' },
      });
    }
    if (!row.activeContractId) {
      throw new GraphQLError('Active contract is not configured for this benefit', {
        extensions: { code: 'CONFLICT' },
      });
    }
  }

  const now = new Date().toISOString();
  const newStatus = contractAccepted ? 'approved' : 'rejected';
  await db
    .update(benefitRequests)
    .set({
      status: newStatus,
      contractAcceptedAt: contractAccepted ? row.contractAcceptedAt ?? now : null,
      reviewedBy: actorId,
      rejectReason: !contractAccepted && rejectReason ? rejectReason : null,
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
          overrideBy: actorId,
          overrideReason: 'Approved by admin/hr',
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
        overrideBy: actorId,
        overrideReason: 'Approved by admin/hr',
        overrideExpiresAt: null,
      });
    }
  }

  if (contractAccepted) {
    await dispatchEmployeeNotification(ctx.env, {
      employeeId: row.employeeId,
      type: 'REQUEST_STATUS',
      tone: 'success',
      dedupeKey: `request:${row.id}:approved`,
      title: 'Benefit Request Approved',
      body: `Your ${row.benefitName ?? 'benefit'} request has been APPROVED. Your benefit is now ACTIVE.`,
      metadata: { benefitId: row.benefitId, requestId: row.id, status: 'APPROVED' },
    });
  } else {
    await dispatchEmployeeNotification(ctx.env, {
      employeeId: row.employeeId,
      type: 'REQUEST_STATUS',
      tone: 'warning',
      dedupeKey: `request:${row.id}:rejected`,
      title: 'Benefit Request Rejected',
      body: `Your ${row.benefitName ?? 'benefit'} request has been REJECTED.${rejectReason ? ` Reason: ${rejectReason}` : ''}`,
      metadata: { benefitId: row.benefitId, requestId: row.id, status: 'REJECTED' },
    });
  }

  return {
    id: row.id,
    employeeId: row.employeeId,
    benefitId: row.benefitId,
    status: mapRequestStatus(newStatus),
    createdAt: row.createdAt ?? now,
    rejectReason: !contractAccepted && rejectReason ? rejectReason : null,
    contractVersionAccepted: row.contractVersionAccepted ?? null,
    contractAcceptedAt: contractAccepted ? row.contractAcceptedAt ?? now : null,
    requiresContract,
    contractId: row.activeContractId ?? null,
    contractTemplateUrl: requiresContract ? `/contracts/requests/${row.id}/template` : null,
  };
};
