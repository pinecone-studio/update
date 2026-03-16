import { GraphQLError } from "graphql";
import { and, eq } from "drizzle-orm";
import type { QueryResolvers } from "../../generated/graphql";
import type { Ctx } from "../context";
import { requireEmployeeId } from "../context";
import { getDb } from "../../../db/drizzle";
import { benefitRequests, benefits, contracts, employees } from "../../../db/schema";
import { renderPinefitContractHtml, toBool01 } from "../../../contracts/renderPinefit";

export const benefitContractPreview: NonNullable<QueryResolvers<Ctx>["benefitContractPreview"]> =
  async (_, args, ctx) => {
    const actorEmployeeId = requireEmployeeId(ctx);
    const db = getDb(ctx.env);

    const rows = await db
      .select({
        requestId: benefits.id,
        requestEmployeeId: employees.id,
        contractAcceptedAt: benefitRequests.contractAcceptedAt,
        requestCreatedAt: benefits.createdAt,
        benefitId: benefits.id,
        benefitName: benefits.name,
        benefitVendorName: benefits.vendorName,
        benefitRequiresContract: benefits.requiresContract,
        contractId: contracts.id,
        contractVersion: contracts.version,
        contractEffectiveDate: contracts.effectiveDate,
        contractExpiryDate: contracts.expiryDate,
        contractCreatedAt: contracts.createdAt,
        employeeName: employees.name,
        employeeCode: employees.employeeCode,
      })
      .from(benefits)
      .leftJoin(contracts, eq(benefits.activeContractId, contracts.id))
      .leftJoin(employees, eq(employees.id, actorEmployeeId))
      .leftJoin(
        benefitRequests,
        and(eq(benefitRequests.benefitId, benefits.id), eq(benefitRequests.employeeId, actorEmployeeId)),
      )
      .where(eq(benefits.id, args.benefitId))
      .limit(1);

    const row = rows[0];
    if (!row) throw new GraphQLError("Benefit not found", { extensions: { code: "NOT_FOUND" } });
    if (!row.requestEmployeeId) {
      throw new GraphQLError("Employee not found", { extensions: { code: "NOT_FOUND" } });
    }
    const requiresContract = toBool01(row.benefitRequiresContract);
    if (requiresContract && !row.contractId) {
      throw new GraphQLError("Active contract is not configured for this benefit", {
        extensions: { code: "CONFLICT" },
      });
    }

    const html = renderPinefitContractHtml({
      ...row,
      requestEmployeeId: row.requestEmployeeId,
      requestId: `preview-${args.benefitId}-${actorEmployeeId}`,
      requestCreatedAt: new Date().toISOString(),
      contractAcceptedAt: null,
    });

    return {
      benefitId: args.benefitId,
      contractId: row.contractId ?? null,
      contractVersion: row.contractVersion ?? null,
      requiresContract,
      html,
    };
  };
