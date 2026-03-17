import type { Ctx } from "../context";
import { requireHR } from "../context";
import type { QueryResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import { eligibilityConfig } from "../../../db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_CONFIG = JSON.stringify({ benefits: {} });

export const getEligibilityRuleConfig: NonNullable<
  QueryResolvers<Ctx>["getEligibilityRuleConfig"]
> = async (_, __, ctx) => {
  requireHR(ctx);
  const db = getDb(ctx.env);
  try {
    const rows = await db
      .select({ configData: eligibilityConfig.configData })
      .from(eligibilityConfig)
      .where(eq(eligibilityConfig.isActive, 1))
      .limit(1);
    const config = rows[0]?.configData ?? DEFAULT_CONFIG;
    return { config };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      /no such table|eligibility_config|Failed query|table.*not found/i.test(
        msg,
      )
    ) {
      return { config: DEFAULT_CONFIG };
    }
    throw err;
  }
};

export const getAvailableRuleAttributes: NonNullable<
  QueryResolvers<Ctx>["getAvailableRuleAttributes"]
> = async (_, __, ctx) => {
  requireHR(ctx);
  return [
    "employment_status",
    "okr_submitted",
    "late_arrival_count",
    "responsibility_level",
    "tenure",
  ];
};
