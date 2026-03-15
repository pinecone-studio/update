import { GraphQLError } from 'graphql';
import type { Ctx } from '../context';
import { requireHR } from '../context';
import { getDb } from '../../../db/drizzle';
import { benefits as benefitsTable, eligibilityConfig } from '../../../db/schema';
import { eq } from 'drizzle-orm';

type UpdateBenefitArgs = {
  input: {
    id: string;
    name: string;
    description?: string | null;
    category: string;
    subsidyPercent: number;
    requiresContract: boolean;
  };
};

export const updateBenefit = async (
  _: unknown,
  args: UpdateBenefitArgs,
  ctx: Ctx
) => {
  requireHR(ctx);
  const input = args.input;
  const id = input.id?.trim();
  const name = input.name?.trim();
  const description = input.description?.trim() || null;
  const category = input.category?.trim();
  const subsidyPercent = input.subsidyPercent;
  const requiresContract = input.requiresContract;

  if (!id || !name || !category) {
    throw new GraphQLError('id, name and category are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  if (subsidyPercent < 0 || subsidyPercent > 100) {
    throw new GraphQLError('subsidyPercent must be between 0 and 100', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const db = getDb(ctx.env);
  const now = new Date().toISOString();

  const rows = await db
    .select({
      id: benefitsTable.id,
      activeContractId: benefitsTable.activeContractId,
    })
    .from(benefitsTable)
    .where(eq(benefitsTable.id, id))
    .limit(1);
  if (!rows[0]) {
    throw new GraphQLError('Benefit not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }

  await db
    .update(benefitsTable)
    .set({
      name,
      description,
      category,
      subsidyPercent,
      requiresContract: requiresContract ? 1 : 0,
      updatedAt: now,
    })
    .where(eq(benefitsTable.id, id));

  // Keep eligibility config metadata in sync with catalog edits.
  try {
    const activeRows = await db
      .select({ configData: eligibilityConfig.configData })
      .from(eligibilityConfig)
      .where(eq(eligibilityConfig.isActive, 1))
      .limit(1);

    if (activeRows[0]?.configData) {
      const parsed = JSON.parse(activeRows[0].configData) as {
        benefits?: Record<
          string,
          {
            name?: string;
            description?: string;
            category?: string;
            subsidyPercent?: number;
            requiresContract?: boolean;
            rules?: Array<{ type: string; operator: string; value: string; errorMessage?: string }>;
          }
        >;
      };
      const benefitsConfig = { ...(parsed.benefits ?? {}) };
      const prev = benefitsConfig[id] ?? { rules: [] };
      benefitsConfig[id] = {
        ...prev,
        name,
        description: description ?? undefined,
        category,
        subsidyPercent,
        requiresContract,
      };
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
  } catch {
    // Do not fail catalog edit if config table/data is unavailable.
  }

  return {
    id,
    name,
    description,
    category,
    subsidyPercent,
    requiresContract,
    activeContractId: rows[0].activeContractId ?? null,
  };
};
