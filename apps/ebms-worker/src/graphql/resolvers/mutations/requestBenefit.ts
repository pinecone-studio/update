import { GraphQLError } from "graphql";
import type { Ctx } from "../context";
import { requireEmployeeId } from "../context";
import type { MutationResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import {
  benefits as benefitsTable,
  benefitRequests,
  employees as employeesTable,
} from "../../../db/schema";
import { asBool01 } from "../utils";
import { and, eq } from "drizzle-orm";
import { dispatchRoleNotification } from "../../../notifications/roleDispatcher";

export const requestBenefit: NonNullable<
  MutationResolvers<Ctx>["requestBenefit"]
> = async (_, args, ctx) => {
  const employeeId = requireEmployeeId(ctx);
  const benefitId = args.input?.benefitId;
  if (!benefitId) {
    throw new GraphQLError("benefitId is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const db = getDb(ctx.env);

  // Eligibility is from HR config (UI); we never block requests by LOCKED/ELIGIBLE.
  // Employees can always submit for HR review; config changes need no code deploy.
  const benefitRow = await db
    .select({
      id: benefitsTable.id,
      name: benefitsTable.name,
      requiresContract: benefitsTable.requiresContract,
      activeContractId: benefitsTable.activeContractId,
    })
    .from(benefitsTable)
    .where(and(eq(benefitsTable.id, benefitId), eq(benefitsTable.isActive, 1)))
    .limit(1);
  const benefit = benefitRow[0];
  if (!benefit) {
    throw new GraphQLError("Benefit not found", {
      extensions: { code: "NOT_FOUND" },
    });
  }
  const requiresContract = asBool01(benefit.requiresContract);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.insert(benefitRequests).values({
    id,
    employeeId,
    benefitId,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  const [emp] = await db
    .select({ name: employeesTable.name, nameEng: employeesTable.nameEng })
    .from(employeesTable)
    .where(eq(employeesTable.id, employeeId))
    .limit(1);
  const employeeName = emp?.nameEng ?? emp?.name ?? employeeId;

  await dispatchRoleNotification(ctx.env, {
    recipientRole: "admin",
    title: "New Benefit Request",
    body: `${employeeName} submitted a request for ${benefit?.name ?? benefitId}.`,
    type: "request",
    tone: "info",
    metadata: {
      requestId: id,
      employeeId,
      benefitId,
      benefitName: benefit?.name,
      employeeName,
    },
  });

  return {
    id,
    employeeId,
    benefitId,
    status: "PENDING" as const,
    createdAt: now,
    rejectReason: null,
    contractVersionAccepted: null,
    contractAcceptedAt: null,
    requiresContract,
    contractId: benefit.activeContractId ?? null,
    contractTemplateUrl: null,
  };
};
