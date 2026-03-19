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
      requestDeadline: benefitsTable.requestDeadline,
      usageLimitCount: benefitsTable.usageLimitCount,
      usageLimitPeriod: benefitsTable.usageLimitPeriod,
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

  const deadline = benefit.requestDeadline?.trim();
  if (deadline) {
    const d = new Date(deadline);
    if (!Number.isNaN(d.getTime()) && d.getTime() < Date.now()) {
      throw new GraphQLError("Request period expired", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
  }

  const period = benefit.usageLimitPeriod?.toLowerCase().trim();
  const limit = benefit.usageLimitCount ?? 1;
  if (period === "month" || period === "year" || period === "7days") {
    const approvedRows = await db
      .select({ updatedAt: benefitRequests.updatedAt })
      .from(benefitRequests)
      .where(
        and(
          eq(benefitRequests.employeeId, employeeId),
          eq(benefitRequests.benefitId, benefitId),
          eq(benefitRequests.status, "approved"),
        ),
      );
    const nowDate = new Date();
    const currentYear = nowDate.getFullYear();
    const currentMonth = nowDate.getMonth();
    const sevenDaysAgo = new Date(nowDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const inPeriod = approvedRows.filter((r) => {
      const d = new Date(r.updatedAt ?? "");
      if (Number.isNaN(d.getTime())) return false;
      if (period === "7days") return d.getTime() >= sevenDaysAgo.getTime();
      if (period === "month")
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      return d.getFullYear() === currentYear;
    });
    if (inPeriod.length >= limit) {
      throw new GraphQLError(
        `You have used this benefit ${limit} time${limit === 1 ? "" : "s"} this period. Please request again in the next period.`,
        { extensions: { code: "BAD_USER_INPUT" } },
      );
    }
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
