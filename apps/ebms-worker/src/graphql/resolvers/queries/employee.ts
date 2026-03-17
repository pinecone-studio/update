import type { Ctx } from "../context";
import { requireHR } from "../context";
import { asBool01, mapEmploymentStatus } from "../utils";
import type { QueryResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import { employees } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const employee: NonNullable<QueryResolvers<Ctx>["employee"]> = async (
  _,
  args,
  ctx,
) => {
  requireHR(ctx);
  const db = getDb(ctx.env);

  const rows = await db
    .select({
      id: employees.id,
      name: employees.name,
      role: employees.role,
      responsibilityLevel: employees.responsibilityLevel,
      employmentStatus: employees.employmentStatus,
      okrSubmitted: employees.okrSubmitted,
      lateArrivalCount: employees.lateArrivalCount,
    })
    .from(employees)
    .where(eq(employees.id, args.id))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name ?? "",
    role: row.role,
    responsibilityLevel: row.responsibilityLevel ?? 1,
    employmentStatus: mapEmploymentStatus(row.employmentStatus ?? "probation"),
    okrSubmitted: asBool01(row.okrSubmitted),
    lateArrivalCount: row.lateArrivalCount ?? 0,
    benefits: [], // resolved by Employee.benefits field resolver
  };
};
