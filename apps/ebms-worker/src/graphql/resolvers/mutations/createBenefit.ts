import { GraphQLError } from "graphql";
import type { Ctx } from "../context";
import type { MutationResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import {
  benefits as benefitsTable,
  eligibilityConfig,
} from "../../../db/schema";
import { eq } from "drizzle-orm";

function slugFromName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_-]/g, "")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "") || "benefit"
  );
}

export const createBenefit: NonNullable<
  MutationResolvers<Ctx>["createBenefit"]
> = async (_, args, ctx) => {
  const input = args.input;
  const name = input.name?.trim();
  const description = input.description?.trim() || null;
  const category = input.category?.trim();
  if (!name || !category) {
    throw new GraphQLError("name and category are required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const db = getDb(ctx.env);
  const now = new Date().toISOString();
  const subsidyPercent = input.subsidyPercent ?? 0;
  const requiresContract = input.requiresContract ?? false;
  const requestDeadline = input.requestDeadline?.trim() || null;
  const usageLimitCount = Math.max(1, input.usageLimitCount ?? 1);
  const rawPeriod = input.usageLimitPeriod?.toLowerCase().trim();
  const usageLimitPeriod =
    rawPeriod === "year"
      ? "year"
      : rawPeriod === "month"
        ? "month"
        : rawPeriod === "7days"
          ? "7days"
          : null;

  let benefitId: string;
  try {
    benefitId = slugFromName(name);
    let suffix = 0;
    while (true) {
      const idToUse = suffix === 0 ? benefitId : `${benefitId}_${suffix}`;
      const existing = await db
        .select({ id: benefitsTable.id })
        .from(benefitsTable)
        .where(eq(benefitsTable.id, idToUse))
        .limit(1);
      if (existing.length === 0) {
        benefitId = idToUse;
        break;
      }
      suffix += 1;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      /no such table|Failed query|benefits.*not found|table.*benefits/i.test(
        msg,
      )
    ) {
      throw new GraphQLError(
        "benefits хүснэгт олдсонгүй. Орон нутгийн D1: npm run db:local",
        { extensions: { code: "INTERNAL_SERVER_ERROR" } },
      );
    }
    throw new GraphQLError(`Benefit id шалгахад алдаа: ${msg}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }

  try {
    await db.insert(benefitsTable).values({
      id: benefitId,
      name,
      description,
      category,
      subsidyPercent,
      requiresContract: requiresContract ? 1 : 0,
      isActive: 1,
      requestDeadline,
      usageLimitCount,
      usageLimitPeriod,
      createdAt: now,
      updatedAt: now,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new GraphQLError(`Failed to create benefit: ${msg}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }

  const rules = (input.rules ?? []).map((r) => ({
    type: r.type,
    operator: r.operator,
    value: r.value,
    errorMessage: r.errorMessage ?? undefined,
  }));

  const newBenefitConfig = {
    name,
    description: description ?? undefined,
    category,
    subsidyPercent,
    requiresContract,
    rules,
  };

  let configStr: string;
  const activeRows = await db
    .select({ configData: eligibilityConfig.configData })
    .from(eligibilityConfig)
    .where(eq(eligibilityConfig.isActive, 1))
    .limit(1);

  if (activeRows[0]?.configData) {
    try {
      const parsed = JSON.parse(activeRows[0].configData) as {
        benefits?: Record<string, unknown>;
      };
      const benefits = {
        ...(parsed.benefits ?? {}),
        [benefitId]: newBenefitConfig,
      };
      configStr = JSON.stringify({ benefits });
    } catch {
      configStr = JSON.stringify({
        benefits: { [benefitId]: newBenefitConfig },
      });
    }
  } else {
    configStr = JSON.stringify({ benefits: { [benefitId]: newBenefitConfig } });
  }

  try {
    const activeIdRows = await db
      .select({ id: eligibilityConfig.id })
      .from(eligibilityConfig)
      .where(eq(eligibilityConfig.isActive, 1))
      .limit(1);
    if (activeIdRows.length > 0) {
      await db
        .update(eligibilityConfig)
        .set({ isActive: 0 })
        .where(eq(eligibilityConfig.isActive, 1));
    }
    await db.insert(eligibilityConfig).values({
      id: crypto.randomUUID(),
      version: `v${Date.now()}`,
      configData: configStr,
      isActive: 1,
      createdAt: now,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/no such table|eligibility_config/i.test(msg)) {
      throw new GraphQLError(
        "Benefit created in catalog but eligibility_config table not found. Run migration: npm run db:migrate:config",
        { extensions: { code: "INTERNAL_SERVER_ERROR" } },
      );
    }
    throw new GraphQLError(
      `Benefit created in catalog but failed to update rules config: ${msg}`,
      { extensions: { code: "INTERNAL_SERVER_ERROR" } },
    );
  }

  return {
    id: benefitId,
    name,
    description,
    category,
    subsidyPercent,
    requiresContract,
    activeContractId: null,
    requestDeadline,
    usageLimitCount,
    usageLimitPeriod,
  };
};
