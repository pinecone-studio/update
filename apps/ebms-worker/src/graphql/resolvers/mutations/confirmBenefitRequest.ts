import { GraphQLError } from 'graphql';
import type { Ctx } from '../context';
import { requireEmployeeId, requireHROrAdminOrFinance } from '../context';
import { mapRequestStatus } from '../utils';
import type { MutationResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { benefitEligibility, benefitRequests, benefits, contracts } from '../../../db/schema';
import { and, eq } from 'drizzle-orm';
import { dispatchEmployeeNotification } from '../../../notifications/dispatcher';
import { getActiveEligibilityConfig } from '../../../eligibility/engine';

function isFinanceRole(role: string | null | undefined): boolean {
  const normalized = (role ?? '').toLowerCase();
  return normalized.includes('finance');
}

export const confirmBenefitRequest: NonNullable<
  MutationResolvers<Ctx>['confirmBenefitRequest']
> = async (_, args, ctx) => {
  const actorId = requireEmployeeId(ctx);
  requireHROrAdminOrFinance(ctx);
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

  const config = await getActiveEligibilityConfig(ctx.env);
  const needsFinanceApproval = Boolean(config?.[row.benefitId]?.financeCheck);
  const actorRole = (ctx.role ?? '').toLowerCase();
  if (needsFinanceApproval) {
    if (!isFinanceRole(actorRole)) {
      throw new GraphQLError('Forbidden: finance role required for this benefit approval', {
        extensions: { code: 'FORBIDDEN' },
      });
    }
  } else {
    requireHR(ctx);
  }

  const requiresContract = row.requiresContract === 1;

  const now = new Date().toISOString();
  const newStatus = contractAccepted ? 'approved' : 'rejected';
  await db
    .update(benefitRequests)
    .set({
      status: newStatus,
      contractAcceptedAt: contractAccepted ? row.contractAcceptedAt ?? null : null,
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

    const nextEligibilityStatus = requiresContract ? 'pending' : 'active';
    const nextOverrideReason = requiresContract
      ? `Approved by ${needsFinanceApproval ? 'finance' : 'admin/hr'} - awaiting signed contract upload`
      : `Approved by ${needsFinanceApproval ? 'finance' : 'admin/hr'}`;

    if (existingEligibility[0]) {
      await db
        .update(benefitEligibility)
        .set({
          status: nextEligibilityStatus,
          computedAt: now,
          overrideBy: actorId,
          overrideReason: nextOverrideReason,
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
        status: nextEligibilityStatus,
        ruleEvaluationJson: '[]',
        computedAt: now,
        overrideBy: actorId,
        overrideReason: nextOverrideReason,
        overrideExpiresAt: null,
      });
    }
  }

  if (contractAccepted) {
    const contractFollowUpRequired = requiresContract;
    await dispatchEmployeeNotification(ctx.env, {
      employeeId: row.employeeId,
      type: 'REQUEST_STATUS',
      tone: contractFollowUpRequired ? 'warning' : 'success',
      dedupeKey: `request:${row.id}:approved`,
      title: contractFollowUpRequired
        ? 'Benefit Approved: Upload Signed Contract'
        : 'Benefit Request Approved',
      body: contractFollowUpRequired
        ? `Your ${row.benefitName ?? 'benefit'} request is APPROVED. Please sign manually and upload the signed contract PDF. Benefit will become ACTIVE after upload.`
        : `Your ${row.benefitName ?? 'benefit'} request has been APPROVED. Your benefit is now ACTIVE.`,
      metadata: {
        benefitId: row.benefitId,
        requestId: row.id,
        status: 'APPROVED',
        requiresContract: contractFollowUpRequired,
        action: contractFollowUpRequired ? 'UPLOAD_SIGNED_CONTRACT' : 'NONE',
      },
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
    contractAcceptedAt: contractAccepted ? row.contractAcceptedAt ?? null : null,
    requiresContract,
    contractId: row.activeContractId ?? null,
    contractTemplateUrl: null,
  };
};
