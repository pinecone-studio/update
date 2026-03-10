import { GraphQLError } from 'graphql';
import type { Ctx } from '../context';
import { requireEmployeeId } from '../context';
import type { MutationResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { benefits as benefitsTable, benefitRequests } from '../../../db/schema';
import { and, eq } from 'drizzle-orm';

export const requestBenefit: NonNullable<MutationResolvers<Ctx>['requestBenefit']> = async (
  _,
  args,
  ctx
) => {
  const employeeId = requireEmployeeId(ctx);
  const benefitId = args.input?.benefitId;
  if (!benefitId) {
    throw new GraphQLError('benefitId is required', { extensions: { code: 'BAD_USER_INPUT' } });
  }

  const db = getDb(ctx.env);

  // Eligibility is from HR config (UI); we never block requests by LOCKED/ELIGIBLE.
  // Employees can always submit for HR review; config changes need no code deploy.
  const benefitRow = await db
    .select({ id: benefitsTable.id })
    .from(benefitsTable)
    .where(and(eq(benefitsTable.id, benefitId), eq(benefitsTable.isActive, 1)))
    .limit(1);
  if (!benefitRow[0]) {
    throw new GraphQLError('Benefit not found', { extensions: { code: 'NOT_FOUND' } });
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.insert(benefitRequests).values({
    id,
    employeeId,
    benefitId,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    employeeId,
    benefitId,
    status: 'PENDING' as const,
    createdAt: now,
  };
};

