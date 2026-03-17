import type { Ctx } from "../context";
import { asBool01 } from "../utils";
import type { QueryResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import { benefits as benefitsTable } from "../../../db/schema";
import { and, eq } from "drizzle-orm";

export const benefits: NonNullable<QueryResolvers<Ctx>["benefits"]> = async (
  _,
  args,
  ctx,
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
      description: benefitsTable.description,
      category: benefitsTable.category,
      subsidyPercent: benefitsTable.subsidyPercent,
      requiresContract: benefitsTable.requiresContract,
      vendorName: benefitsTable.vendorName,
      activeContractId: benefitsTable.activeContractId,
    })
    .from(benefitsTable)
    .where(where.length === 1 ? where[0] : and(...where))
    .orderBy(benefitsTable.category, benefitsTable.name);

  return rows.map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description ?? `${b.category} benefit`,
    category: b.category,
    subsidyPercent: b.subsidyPercent ?? 0,
    requiresContract: asBool01(b.requiresContract),
    vendorName: b.vendorName ?? null,
    activeContractId: b.activeContractId ?? null,
  }));
};
