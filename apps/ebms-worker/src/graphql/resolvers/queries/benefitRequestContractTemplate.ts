import { GraphQLError } from "graphql";
import { eq } from "drizzle-orm";
import type { QueryResolvers } from "../../generated/graphql";
import type { Ctx } from "../context";
import { requireEmployeeId } from "../context";
import { getDb } from "../../../db/drizzle";
import {
  benefitRequests,
  benefits,
  contracts,
  employees,
} from "../../../db/schema";
import {
  renderPinefitContractHtml,
  toBool01,
} from "../../../contracts/renderPinefit";

export const benefitRequestContractTemplate: NonNullable<
  QueryResolvers<Ctx>["benefitRequestContractTemplate"]
> = async (_, args, ctx) => {
  const actorEmployeeId = requireEmployeeId(ctx);
  const actorRole = (ctx.role ?? "").toLowerCase();
  const isHrOrAdminOrFinance =
    actorRole === "hr" ||
    actorRole === "admin" ||
    actorRole === "finance-manager";

  const db = getDb(ctx.env);
  const rows = await db
    .select({
      requestId: benefitRequests.id,
      requestEmployeeId: benefitRequests.employeeId,
      contractAcceptedAt: benefitRequests.contractAcceptedAt,
      requestCreatedAt: benefitRequests.createdAt,
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
    .from(benefitRequests)
    .leftJoin(benefits, eq(benefitRequests.benefitId, benefits.id))
    .leftJoin(contracts, eq(benefits.activeContractId, contracts.id))
    .leftJoin(employees, eq(benefitRequests.employeeId, employees.id))
    .where(eq(benefitRequests.id, args.requestId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    throw new GraphQLError("Benefit request not found", {
      extensions: { code: "NOT_FOUND" },
    });
  }
  if (!isHrOrAdminOrFinance && row.requestEmployeeId !== actorEmployeeId) {
    throw new GraphQLError("Forbidden", { extensions: { code: "FORBIDDEN" } });
  }

  const requiresContract = toBool01(row.benefitRequiresContract);
  if (requiresContract && !row.contractId) {
    throw new GraphQLError(
      "Active contract is not configured for this benefit",
      {
        extensions: { code: "CONFLICT" },
      },
    );
  }

  return {
    requestId: row.requestId,
    benefitId: row.benefitId ?? "",
    contractId: row.contractId ?? null,
    contractVersion: row.contractVersion ?? null,
    requiresContract,
    html: renderPinefitContractHtml(row),
  };
};
