import { GraphQLError } from "graphql";
import type { Ctx } from "../context";
import { requireEmployeeId } from "../context";
import type { MutationResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import { employeeNotifications } from "../../../db/schema";
import { and, eq } from "drizzle-orm";

function mapType(
  input: string,
): "ELIGIBILITY_CHANGE" | "REQUEST_STATUS" | "WARNING" {
  const t = (input ?? "").toUpperCase();
  if (t === "REQUEST_STATUS") return "REQUEST_STATUS";
  if (t === "WARNING") return "WARNING";
  return "ELIGIBILITY_CHANGE";
}

function mapTone(input: string): "SUCCESS" | "INFO" | "WARNING" | "NEUTRAL" {
  const t = (input ?? "").toUpperCase();
  if (t === "SUCCESS") return "SUCCESS";
  if (t === "WARNING") return "WARNING";
  if (t === "NEUTRAL") return "NEUTRAL";
  return "INFO";
}

function mapChannel(input: string): "IN_APP" | "EMAIL" {
  return (input ?? "").toLowerCase() === "email" ? "EMAIL" : "IN_APP";
}

export const markNotificationRead: NonNullable<
  MutationResolvers<Ctx>["markNotificationRead"]
> = async (_, args, ctx) => {
  const employeeId = requireEmployeeId(ctx);
  const db = getDb(ctx.env);
  const { id } = args;

  const rows = await db
    .select({
      id: employeeNotifications.id,
      employeeId: employeeNotifications.employeeId,
      title: employeeNotifications.title,
      body: employeeNotifications.body,
      type: employeeNotifications.type,
      tone: employeeNotifications.tone,
      channel: employeeNotifications.channel,
      isRead: employeeNotifications.isRead,
      createdAt: employeeNotifications.createdAt,
      metadataJson: employeeNotifications.metadataJson,
    })
    .from(employeeNotifications)
    .where(
      and(
        eq(employeeNotifications.id, id),
        eq(employeeNotifications.employeeId, employeeId),
        eq(employeeNotifications.channel, "in_app"),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) {
    throw new GraphQLError("Notification not found", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  if (row.isRead !== 1) {
    await db
      .update(employeeNotifications)
      .set({ isRead: 1 })
      .where(
        and(
          eq(employeeNotifications.id, id),
          eq(employeeNotifications.employeeId, employeeId),
        ),
      );
  }

  return {
    id: row.id,
    employeeId: row.employeeId,
    title: row.title,
    body: row.body,
    type: mapType(row.type),
    tone: mapTone(row.tone),
    channel: mapChannel(row.channel),
    isRead: true,
    createdAt: row.createdAt,
    metadata: row.metadataJson ?? null,
  };
};
