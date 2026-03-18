/**
 * Role notifications API — admin and finance
 */

import { Hono } from "hono";
import { and, desc, eq } from "drizzle-orm";
import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import { roleNotifications } from "../db/schema";

const roleNotificationsRoute = new Hono<{ Bindings: Env }>();

function checkRole(
  c: { req: { header: (n: string) => string | undefined } },
  allowedRoles: string[],
): boolean {
  const role = (c.req.header("x-role") ?? "").toLowerCase();
  return allowedRoles.some((r) => role === r || role.includes(r));
}

/** GET /admin/notifications — list admin notifications */
roleNotificationsRoute.get("/admin/notifications", async (c) => {
  if (!checkRole(c, ["admin", "hr"])) {
    return c.json({ error: "Forbidden: admin or hr role required" }, 403);
  }
  const db = getDb(c.env);
  const limit = Math.min(parseInt(c.req.query("limit") ?? "50", 10) || 50, 100);
  const unreadOnly = c.req.query("unreadOnly") === "true";

  try {
    const rows = unreadOnly
      ? await db
          .select()
          .from(roleNotifications)
          .where(
            and(
              eq(roleNotifications.recipientRole, "admin"),
              eq(roleNotifications.isRead, 0),
            ),
          )
          .orderBy(desc(roleNotifications.createdAt))
          .limit(limit)
      : await db
          .select()
          .from(roleNotifications)
          .where(eq(roleNotifications.recipientRole, "admin"))
          .orderBy(desc(roleNotifications.createdAt))
          .limit(limit);

    const items = rows.map((r) => ({
      id: r.id,
      title: r.title,
      body: r.body,
      type: r.type,
      tone: r.tone,
      unread: r.isRead === 0,
      createdAt: r.createdAt,
      metadata: r.metadataJson ? JSON.parse(r.metadataJson) : null,
    }));

    return c.json({ items });
  } catch (err) {
    return c.json({ error: "Failed to fetch notifications", items: [] }, 500);
  }
});

/** GET /finance/notifications — list finance notifications */
roleNotificationsRoute.get("/finance/notifications", async (c) => {
  if (!checkRole(c, ["finance", "finance-manager"])) {
    return c.json({ error: "Forbidden: finance role required" }, 403);
  }
  const db = getDb(c.env);
  const limit = Math.min(parseInt(c.req.query("limit") ?? "50", 10) || 50, 100);
  const unreadOnly = c.req.query("unreadOnly") === "true";

  try {
    const rows = unreadOnly
      ? await db
          .select()
          .from(roleNotifications)
          .where(
            and(
              eq(roleNotifications.recipientRole, "finance"),
              eq(roleNotifications.isRead, 0),
            ),
          )
          .orderBy(desc(roleNotifications.createdAt))
          .limit(limit)
      : await db
          .select()
          .from(roleNotifications)
          .where(eq(roleNotifications.recipientRole, "finance"))
          .orderBy(desc(roleNotifications.createdAt))
          .limit(limit);

    const items = rows.map((r) => ({
      id: r.id,
      title: r.title,
      body: r.body,
      type: r.type,
      tone: r.tone,
      unread: r.isRead === 0,
      createdAt: r.createdAt,
      metadata: r.metadataJson ? JSON.parse(r.metadataJson) : null,
    }));

    return c.json({ items });
  } catch (err) {
    return c.json({ error: "Failed to fetch notifications", items: [] }, 500);
  }
});

/** PATCH /admin/notifications/:id/read — mark admin notification as read */
roleNotificationsRoute.patch("/admin/notifications/:id/read", async (c) => {
  if (!checkRole(c, ["admin", "hr"])) {
    return c.json({ error: "Forbidden: admin or hr role required" }, 403);
  }
  const id = c.req.param("id");
  const db = getDb(c.env);
  try {
    const [row] = await db
      .select()
      .from(roleNotifications)
      .where(
        and(
          eq(roleNotifications.id, id),
          eq(roleNotifications.recipientRole, "admin"),
        ),
      )
      .limit(1);
    if (!row) return c.json({ error: "Notification not found" }, 404);
    await db
      .update(roleNotifications)
      .set({ isRead: 1 })
      .where(eq(roleNotifications.id, id));
    return c.json({ ok: true });
  } catch (err) {
    return c.json({ error: "Failed to update notification" }, 500);
  }
});

/** PATCH /finance/notifications/:id/read — mark finance notification as read */
roleNotificationsRoute.patch("/finance/notifications/:id/read", async (c) => {
  if (!checkRole(c, ["finance", "finance-manager"])) {
    return c.json({ error: "Forbidden: finance role required" }, 403);
  }
  const id = c.req.param("id");
  const db = getDb(c.env);
  try {
    const [row] = await db
      .select()
      .from(roleNotifications)
      .where(
        and(
          eq(roleNotifications.id, id),
          eq(roleNotifications.recipientRole, "finance"),
        ),
      )
      .limit(1);
    if (!row) return c.json({ error: "Notification not found" }, 404);
    await db
      .update(roleNotifications)
      .set({ isRead: 1 })
      .where(eq(roleNotifications.id, id));
    return c.json({ ok: true });
  } catch (err) {
    return c.json({ error: "Failed to update notification" }, 500);
  }
});

/** PATCH /admin/notifications/read-all — mark all admin notifications as read */
roleNotificationsRoute.patch("/admin/notifications/read-all", async (c) => {
  if (!checkRole(c, ["admin", "hr"])) {
    return c.json({ error: "Forbidden: admin or hr role required" }, 403);
  }
  const db = getDb(c.env);
  try {
    await db
      .update(roleNotifications)
      .set({ isRead: 1 })
      .where(eq(roleNotifications.recipientRole, "admin"));
    return c.json({ ok: true });
  } catch (err) {
    return c.json({ error: "Failed to update notifications" }, 500);
  }
});

/** PATCH /finance/notifications/read-all — mark all finance notifications as read */
roleNotificationsRoute.patch("/finance/notifications/read-all", async (c) => {
  if (!checkRole(c, ["finance", "finance-manager"])) {
    return c.json({ error: "Forbidden: finance role required" }, 403);
  }
  const db = getDb(c.env);
  try {
    await db
      .update(roleNotifications)
      .set({ isRead: 1 })
      .where(eq(roleNotifications.recipientRole, "finance"));
    return c.json({ ok: true });
  } catch (err) {
    return c.json({ error: "Failed to update notifications" }, 500);
  }
});

export default roleNotificationsRoute;
