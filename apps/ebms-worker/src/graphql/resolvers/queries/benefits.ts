import type { Ctx } from '../context';
import { asBool01 } from '../utils';
import type { QueryResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { benefits as benefitsTable } from '../../../db/schema';
import { and, eq } from 'drizzle-orm';

export const benefits: NonNullable<QueryResolvers<Ctx>['benefits']> = async (
  _,
  args,
  ctx
) => {
  const db = getDb(ctx.env);

  const where = [eq(benefitsTable.isActive, 1)];
  if (args.category) {
    where.push(eq(benefitsTable.category, args.category));
  }

  const rows = await db
    .select({
      id: benefitsTable.id,
      name: benefitsTable.name,
      category: benefitsTable.category,
      subsidyPercent: benefitsTable.subsidyPercent,
      vendorName: benefitsTable.vendorName,
      requiresContract: benefitsTable.requiresContract,
      isActive: benefitsTable.isActive,
    })
    .from(benefitsTable)
    .where(where.length === 1 ? where[0] : and(...where))
    .orderBy(benefitsTable.category, benefitsTable.name);

  return rows.map((b) => ({
    id: b.id,
    name: b.name,
    category: b.category,
    subsidyPercent: b.subsidyPercent ?? 0,
    vendorName: b.vendorName ?? null,
    requiresContract: asBool01(b.requiresContract),
    isActive: asBool01(b.isActive),
  }));
};

