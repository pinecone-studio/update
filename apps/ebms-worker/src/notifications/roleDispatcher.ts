import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import { isRoleNotificationsTableMissing } from "../db/errors";
import { roleNotifications } from "../db/schema";

export type RoleNotificationRecipient = "admin" | "finance" | "hr";

export type RoleNotificationTone = "success" | "info" | "warning" | "neutral";

type DispatchRoleInput = {
  recipientRole: RoleNotificationRecipient;
  title: string;
  body: string;
  type: string;
  tone?: RoleNotificationTone;
  metadata?: Record<string, unknown> | null;
};

export async function dispatchRoleNotification(
  env: Env,
  input: DispatchRoleInput,
): Promise<void> {
  try {
    const db = getDb(env);
    const now = new Date().toISOString();
    await db.insert(roleNotifications).values({
      id: crypto.randomUUID(),
      recipientRole: input.recipientRole,
      title: input.title,
      body: input.body,
      type: input.type,
      tone: input.tone ?? "info",
      isRead: 0,
      metadataJson: input.metadata ? JSON.stringify(input.metadata) : null,
      createdAt: now,
    });
  } catch (err) {
    if (isRoleNotificationsTableMissing(err)) {
      return;
    }
    throw err;
  }
}
