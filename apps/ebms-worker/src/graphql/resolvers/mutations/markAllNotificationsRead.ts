import type { Ctx } from "../context";
import { requireEmployeeId } from "../context";
import type { MutationResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import { isEmployeeNotificationsTableMissing } from "../../../db/errors";
import { employeeNotifications } from "../../../db/schema";
import { and, eq } from "drizzle-orm";

export const markAllNotificationsRead: NonNullable<
  MutationResolvers<Ctx>["markAllNotificationsRead"]
> = async (_, __, ctx) => {
  const employeeId = requireEmployeeId(ctx);
  const db = getDb(ctx.env);

  try {
    await db
      .update(employeeNotifications)
      .set({ isRead: 1 })
      .where(
        and(
          eq(employeeNotifications.employeeId, employeeId),
          eq(employeeNotifications.channel, "in_app"),
        ),
      );
  } catch (err) {
    if (isEmployeeNotificationsTableMissing(err)) return true;
    throw err;
  }
  return true;
};
