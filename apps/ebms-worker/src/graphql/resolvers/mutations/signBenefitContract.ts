import { GraphQLError } from "graphql";
import { eq } from "drizzle-orm";
import type { MutationResolvers } from "../../generated/graphql";
import type { Ctx } from "../context";
import { requireEmployeeId } from "../context";
import { getDb } from "../../../db/drizzle";
import { benefitRequests, benefits, contracts } from "../../../db/schema";
import { asBool01, mapRequestStatus } from "../utils";

export const signBenefitContract: NonNullable<
  MutationResolvers<Ctx>["signBenefitContract"]
> = async (_, args, ctx) => {
  const actorId = requireEmployeeId(ctx);
  const requestId = args.requestId;
  if (!requestId) {
    throw new GraphQLError("requestId is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const db = getDb(ctx.env);
  const rows = await db
    .select({
      id: benefitRequests.id,
      employeeId: benefitRequests.employeeId,
      benefitId: benefitRequests.benefitId,
      status: benefitRequests.status,
      createdAt: benefitRequests.createdAt,
      contractVersionAccepted: benefitRequests.contractVersionAccepted,
      contractAcceptedAt: benefitRequests.contractAcceptedAt,
      requiresContract: benefits.requiresContract,
      activeContractId: benefits.activeContractId,
      activeContractVersion: contracts.version,
    })
    .from(benefitRequests)
    .leftJoin(benefits, eq(benefitRequests.benefitId, benefits.id))
    .leftJoin(contracts, eq(benefits.activeContractId, contracts.id))
    .where(eq(benefitRequests.id, requestId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    throw new GraphQLError("Request not found", {
      extensions: { code: "NOT_FOUND" },
    });
  }
  if (row.employeeId !== actorId) {
    throw new GraphQLError("Forbidden", { extensions: { code: "FORBIDDEN" } });
  }
  if ((row.status ?? "").toLowerCase() !== "pending") {
    throw new GraphQLError("Only pending requests can be signed", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  if (!asBool01(row.requiresContract)) {
    throw new GraphQLError(
      "This benefit does not require a contract signature",
      {
        extensions: { code: "BAD_USER_INPUT" },
      },
    );
  }
  if (!row.activeContractId || !row.activeContractVersion) {
    throw new GraphQLError(
      "Active contract is not configured for this benefit",
      {
        extensions: { code: "CONFLICT" },
      },
    );
  }

  const now = new Date().toISOString();
  await db
    .update(benefitRequests)
    .set({
      contractVersionAccepted: row.activeContractVersion,
      contractAcceptedAt: now,
      updatedAt: now,
      rejectReason: null,
    })
    .where(eq(benefitRequests.id, requestId));

  return {
    id: row.id,
    employeeId: row.employeeId,
    benefitId: row.benefitId,
    status: mapRequestStatus(row.status),
    createdAt: row.createdAt ?? now,
    rejectReason: null,
    contractVersionAccepted: row.activeContractVersion,
    contractAcceptedAt: now,
    requiresContract: true,
    contractId: row.activeContractId,
    contractTemplateUrl: `/contracts/requests/${row.id}/template`,
  };
};
