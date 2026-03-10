import { GraphQLError } from 'graphql';
import type { Ctx } from '../context';
import { requireEmployeeId } from '../context';
import { mapRequestStatus } from '../utils';
import type { MutationResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { benefitRequests } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const confirmBenefitRequest: NonNullable<
  MutationResolvers<Ctx>['confirmBenefitRequest']
> = async (_, args, ctx) => {
  const employeeId = requireEmployeeId(ctx);
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
  if (row.employeeId !== employeeId) {
    throw new GraphQLError('Forbidden', { extensions: { code: 'FORBIDDEN' } });
  }

  const now = new Date().toISOString();
  const newStatus = contractAccepted ? 'approved' : 'rejected';
  await db
    .update(benefitRequests)
    .set({
      status: newStatus,
      contractAcceptedAt: contractAccepted ? now : null,
      updatedAt: now,
    })
    .where(eq(benefitRequests.id, requestId));

  return {
    id: row.id,
    employeeId: row.employeeId,
    benefitId: row.benefitId,
    status: mapRequestStatus(newStatus),
    createdAt: row.createdAt ?? now,
  };
};
