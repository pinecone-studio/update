/**
 * Admin feedback API — escalated feedback, close when seen
 */

import { Hono } from "hono";
import { and, eq, sql, isNull } from "drizzle-orm";
import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import { feedback, feedbackVotes } from "../db/schema";

const adminFeedback = new Hono<{ Bindings: Env }>();

function checkAdmin(c: { req: { header: (n: string) => string | undefined } }) {
  const role = c.req.header("x-role");
  if (role !== "admin" && role !== "hr") {
    return false;
  }
  return true;
}

/** GET /admin/feedback — list escalated feedback. ?unclosed=true = only not yet closed (for dashboard) */
adminFeedback.get("/", async (c) => {
  if (!checkAdmin(c)) {
    return c.json({ error: "Forbidden: admin or hr role required" }, 403);
  }
  const unclosedOnly = c.req.query("unclosed") === "true";

  const db = getDb(c.env);

  const whereClause = unclosedOnly
    ? and(eq(feedback.status, "ESCALATED"), isNull(feedback.closedAt))
    : eq(feedback.status, "ESCALATED");

  const rows = await db
    .select({
      id: feedback.id,
      text: feedback.text,
      benefitId: feedback.benefitId,
      isAnonymous: feedback.isAnonymous,
      status: feedback.status,
      createdAt: feedback.createdAt,
      votingEndsAt: feedback.votingEndsAt,
      closedAt: feedback.closedAt,
    })
    .from(feedback)
    .where(whereClause)
    .orderBy(sql`${feedback.createdAt} DESC`);

  const voteCounts = await db
    .select({
      feedbackId: feedbackVotes.feedbackId,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(feedbackVotes)
    .groupBy(feedbackVotes.feedbackId);

  const voteMap = new Map(voteCounts.map((v) => [v.feedbackId, Number(v.count)]));

  const items = rows.map((r) => ({
    id: r.id,
    text: r.text,
    benefitId: r.benefitId ?? null,
    isAnonymous: Boolean(r.isAnonymous),
    status: r.status,
    createdAt: r.createdAt,
    votingEndsAt: r.votingEndsAt,
    closedAt: r.closedAt ?? null,
    voteCount: voteMap.get(r.id) ?? 0,
  }));

  return c.json({ items });
});

/** PATCH /admin/feedback/:id/close — admin marks feedback as seen/closed */
adminFeedback.patch("/:id/close", async (c) => {
  if (!checkAdmin(c)) {
    return c.json({ error: "Forbidden: admin or hr role required" }, 403);
  }

  const id = c.req.param("id");
  const db = getDb(c.env);
  const now = new Date().toISOString();

  const [row] = await db
    .select()
    .from(feedback)
    .where(eq(feedback.id, id))
    .limit(1);

  if (!row) {
    return c.json({ error: "Feedback not found" }, 404);
  }

  if (row.status !== "ESCALATED") {
    return c.json({ error: "Can only close escalated feedback" }, 400);
  }

  await db
    .update(feedback)
    .set({ closedAt: now })
    .where(eq(feedback.id, id));

  return c.json({ closed: true, closedAt: now });
});

export default adminFeedback;
