import { GraphQLError } from "graphql";
import type { Ctx } from "../context";
import { requireHR } from "../context";
import type { MutationResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import { eligibilityConfig } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const updateEligibilityRuleConfig: NonNullable<
  MutationResolvers<Ctx>["updateEligibilityRuleConfig"]
> = async (_, args, ctx) => {
  requireHR(ctx);
  const configStr = args.config;
  if (!configStr || typeof configStr !== "string") {
    throw new GraphQLError("config is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  let parsed: { benefits?: Record<string, unknown> };
  try {
    parsed = JSON.parse(configStr);
  } catch {
    throw new GraphQLError("Invalid JSON config", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  if (!parsed || typeof parsed.benefits !== "object") {
    throw new GraphQLError('Config must have a "benefits" object', {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const db = getDb(ctx.env);
  const now = new Date().toISOString();
  const version = `v${Date.now()}`;
  const id = crypto.randomUUID();

  try {
    const activeRows = await db
      .select({ id: eligibilityConfig.id })
      .from(eligibilityConfig)
      .where(eq(eligibilityConfig.isActive, 1))
      .limit(1);
    if (activeRows.length > 0) {
      await db
        .update(eligibilityConfig)
        .set({ isActive: 0 })
        .where(eq(eligibilityConfig.isActive, 1));
    }
    await db.insert(eligibilityConfig).values({
      id,
      version,
      configData: configStr,
      isActive: 1,
      createdAt: now,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/no such table|eligibility_config|table.*not found/i.test(msg)) {
      throw new GraphQLError(
        "Table eligibility_config not found. Run migration: npm run db:migrate:config (or create the table in D1).",
        { extensions: { code: "INTERNAL_SERVER_ERROR" } },
      );
    }
    throw new GraphQLError(`Failed to save config: ${msg}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }

  return { config: configStr };
};
