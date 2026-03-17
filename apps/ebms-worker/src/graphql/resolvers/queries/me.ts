import { GraphQLError } from "graphql";
import type { Ctx } from "../context";
import { requireEmployeeId } from "../context";
import { asBool01, mapEmploymentStatus } from "../utils";
import type { QueryResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import { employees } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const me: NonNullable<QueryResolvers<Ctx>["me"]> = async (
  _,
  __,
  ctx,
) => {
  const employeeId = requireEmployeeId(ctx);
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
    .where(eq(employees.id, employeeId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    throw new GraphQLError("Employee not found", {
      extensions: { code: "NOT_FOUND" },
    });
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
