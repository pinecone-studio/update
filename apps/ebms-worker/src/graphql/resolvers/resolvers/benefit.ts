import type { Ctx } from '../context';
import type { BenefitResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { contracts } from '../../../db/schema';
import { eq } from 'drizzle-orm';

type BenefitParent = { id: string; activeContractId?: string | null };

export const Benefit: BenefitResolvers<Ctx> = {
  activeContract: async (parent, _, ctx) => {
    const contractId = (parent as BenefitParent).activeContractId;
    if (!contractId) return null;
    const db = getDb(ctx.env);
    const rows = await db
      .select({
        id: contracts.id,
        benefitId: contracts.benefitId,
        version: contracts.version,
        effectiveDate: contracts.effectiveDate,
        expiryDate: contracts.expiryDate,
      })
      .from(contracts)
      .where(eq(contracts.id, contractId))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      benefitId: row.benefitId,
      version: row.version,
      effectiveDate: row.effectiveDate ?? null,
      expiryDate: row.expiryDate ?? null,
    };
  },
};
