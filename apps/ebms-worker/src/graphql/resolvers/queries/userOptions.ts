import type { Ctx } from "../context";
import type { QueryResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import { employees as employeesTable } from "../../../db/schema";
import { asc } from "drizzle-orm";

export const userOptions: NonNullable<
  QueryResolvers<Ctx>["userOptions"]
> = async (_, __, ctx) => {
  const db = getDb(ctx.env);
  const rows = await db
    .select({
      id: employeesTable.id,
      name: employeesTable.name,
      role: employeesTable.role,
    })
    .from(employeesTable)
    .orderBy(asc(employeesTable.name), asc(employeesTable.id));

  return rows.map((u) => ({
    id: u.id,
    name: u.name ?? u.id,
    role: (u.role ?? "employee").toLowerCase(),
  }));
};
