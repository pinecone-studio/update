import { GraphQLError } from 'graphql';
import type { Ctx } from '../context';
import { requireHR } from '../context';
import { getDb } from '../../../db/drizzle';
import { benefits as benefitsTable, eligibilityConfig } from '../../../db/schema';
import { eq } from 'drizzle-orm';

type DeleteBenefitArgs = { id: string };

export const deleteBenefit = async (
  _: unknown,
  args: DeleteBenefitArgs,
  ctx: Ctx
) => {
  requireHR(ctx);
  const id = args.id?.trim();
  if (!id) {
    throw new GraphQLError('id is required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const db = getDb(ctx.env);
  const now = new Date().toISOString();

  const existing = await db
    .select({ id: benefitsTable.id })
    .from(benefitsTable)
    .where(eq(benefitsTable.id, id))
    .limit(1);
  if (!existing[0]) {
    throw new GraphQLError('Benefit not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }

  // Soft-delete in catalog.
  await db
    .update(benefitsTable)
    .set({ isActive: 0, updatedAt: now })
    .where(eq(benefitsTable.id, id));

  // Remove from active eligibility config snapshot if present.
  try {
    const activeRows = await db
      .select({ configData: eligibilityConfig.configData })
      .from(eligibilityConfig)
      .where(eq(eligibilityConfig.isActive, 1))
      .limit(1);

    if (activeRows[0]?.configData) {
      const parsed = JSON.parse(activeRows[0].configData) as {
        benefits?: Record<string, unknown>;
      };
      const benefitsConfig = { ...(parsed.benefits ?? {}) };
      if (id in benefitsConfig) {
        delete benefitsConfig[id];
        const nextConfig = JSON.stringify({ benefits: benefitsConfig });

        await db
          .update(eligibilityConfig)
          .set({ isActive: 0 })
          .where(eq(eligibilityConfig.isActive, 1));

        await db.insert(eligibilityConfig).values({
          id: crypto.randomUUID(),
          version: `v${Date.now()}`,
          configData: nextConfig,
          isActive: 1,
          createdAt: now,
        });
      }
    }
  } catch {
    // Keep deletion successful even if config sync fails.
  }

  return true;
};
