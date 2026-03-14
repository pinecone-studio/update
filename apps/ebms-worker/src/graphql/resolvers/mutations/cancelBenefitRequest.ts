import { GraphQLError } from 'graphql';
import type { Ctx } from '../context';
import { requireEmployeeId } from '../context';
import type { MutationResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { benefitRequests, benefits } from '../../../db/schema';
import { asBool01, mapRequestStatus } from '../utils';
import { eq } from 'drizzle-orm';

export const cancelBenefitRequest: NonNullable<
  MutationResolvers<Ctx>['cancelBenefitRequest']
> = async (_, args, ctx) => {
  const employeeId = requireEmployeeId(ctx);
  const requestId = args.requestId;
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
      contractVersionAccepted: benefitRequests.contractVersionAccepted,
      contractAcceptedAt: benefitRequests.contractAcceptedAt,
      rejectReason: benefitRequests.rejectReason,
      requiresContract: benefits.requiresContract,
      activeContractId: benefits.activeContractId,
    })
    .from(benefitRequests)
    .leftJoin(benefits, eq(benefitRequests.benefitId, benefits.id))
    .where(eq(benefitRequests.id, requestId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    throw new GraphQLError('Request not found', { extensions: { code: 'NOT_FOUND' } });
  }
  if (row.employeeId !== employeeId) {
    throw new GraphQLError('Forbidden', { extensions: { code: 'FORBIDDEN' } });
  }
  if ((row.status ?? '').toLowerCase() !== 'pending') {
    throw new GraphQLError('Only pending requests can be cancelled', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const now = new Date().toISOString();
  await db
    .update(benefitRequests)
    .set({ status: 'cancelled', updatedAt: now })
    .where(eq(benefitRequests.id, requestId));

  return {
    id: row.id,
    employeeId: row.employeeId,
    benefitId: row.benefitId,
    status: mapRequestStatus('cancelled'),
    createdAt: row.createdAt ?? now,
    rejectReason: row.rejectReason ?? null,
    contractVersionAccepted: row.contractVersionAccepted ?? null,
    contractAcceptedAt: row.contractAcceptedAt ?? null,
    requiresContract: asBool01(row.requiresContract),
    contractId: row.activeContractId ?? null,
    contractTemplateUrl: asBool01(row.requiresContract) ? `/contracts/requests/${row.id}/template` : null,
  };
};

