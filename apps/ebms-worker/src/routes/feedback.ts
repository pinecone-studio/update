/**
 * Benefit feedback API — employees create, vote; 3 votes before 24h deadline → admin
 */

import { Hono } from "hono";
import { and, eq, sql, lt } from "drizzle-orm";
import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import { feedback, feedbackVotes } from "../db/schema";

const VOTING_DEADLINE_HOURS = 24;
const VOTE_THRESHOLD = 3;

function nowIso(): string {
  return new Date().toISOString();
}

function uuid(): string {
  return crypto.randomUUID();
}

function addHours(iso: string, hours: number): string {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

const feedbackRoute = new Hono<{ Bindings: Env }>();

/** GET /feedback — list feedback for employee (OPEN + EXPIRED + ESCALATED) with vote counts */
feedbackRoute.get("/", async (c) => {
  const employeeId = c.req.header("x-employee-id");
  if (!employeeId) {
    return c.json({ error: "x-employee-id required" }, 401);
  }

  const db = getDb(c.env);
  const now = nowIso();

  // Expire feedback that passed deadline with < 3 votes
  const toExpire = await db
    .select({ id: feedback.id })
    .from(feedback)
    .where(and(eq(feedback.status, "OPEN"), lt(feedback.votingEndsAt, now)));

  for (const row of toExpire) {
    await db
      .update(feedback)
      .set({ status: "EXPIRED" })
      .where(eq(feedback.id, row.id));
  }

  const rows = await db
    .select({
      id: feedback.id,
      text: feedback.text,
      employeeId: feedback.employeeId,
      benefitId: feedback.benefitId,
      isAnonymous: feedback.isAnonymous,
      status: feedback.status,
      createdAt: feedback.createdAt,
      votingEndsAt: feedback.votingEndsAt,
    })
    .from(feedback)
    .orderBy(sql`${feedback.createdAt} DESC`);

  const voteCounts = await db
    .select({
      feedbackId: feedbackVotes.feedbackId,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(feedbackVotes)
    .groupBy(feedbackVotes.feedbackId);

  const myVotes = employeeId
    ? await db
        .select({ feedbackId: feedbackVotes.feedbackId })
        .from(feedbackVotes)
        .where(eq(feedbackVotes.employeeId, employeeId))
    : [];

  const voteMap = new Map(
    voteCounts.map((v) => [v.feedbackId, Number(v.count)]),
  );
  const myVoteSet = new Set(myVotes.map((v) => v.feedbackId));

  const items = rows.map((r) => ({
    id: r.id,
    text: r.text,
    benefitId: r.benefitId ?? null,
    isAnonymous: Boolean(r.isAnonymous),
    status: r.status,
    createdAt: r.createdAt,
    votingEndsAt: r.votingEndsAt,
    voteCount: voteMap.get(r.id) ?? 0,
    hasVoted: myVoteSet.has(r.id),
    isCreator: r.employeeId === employeeId,
  }));

  return c.json({ items });
});

/** GET /feedback/open-count — count of OPEN feedback (for badge) */
feedbackRoute.get("/open-count", async (c) => {
  const db = getDb(c.env);
  const now = nowIso();

  const toExpire = await db
    .select({ id: feedback.id })
    .from(feedback)
    .where(and(eq(feedback.status, "OPEN"), lt(feedback.votingEndsAt, now)));

  for (const row of toExpire) {
    await db
      .update(feedback)
      .set({ status: "EXPIRED" })
      .where(eq(feedback.id, row.id));
  }

  const result = await db
    .select({ count: sql<number>`count(*)`.as("count") })
    .from(feedback)
    .where(eq(feedback.status, "OPEN"));

  const count = Number(result[0]?.count ?? 0);
  return c.json({ count });
});

/** POST /feedback — create feedback */
feedbackRoute.post("/", async (c) => {
  const employeeId = c.req.header("x-employee-id");
  if (!employeeId) {
    return c.json({ error: "x-employee-id required" }, 401);
  }

  let body: { text: string; benefitId?: string; isAnonymous?: boolean };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const text = String(body.text ?? "").trim();
  if (!text) {
    return c.json({ error: "text required" }, 400);
  }

  const now = nowIso();
  const votingEndsAt = addHours(now, VOTING_DEADLINE_HOURS);
  const id = uuid();

  const db = getDb(c.env);
  await db.insert(feedback).values({
    id,
    text,
    employeeId: employeeId,
    benefitId: body.benefitId ?? null,
    isAnonymous: body.isAnonymous ? 1 : 0,
    status: "OPEN",
    createdAt: now,
    votingEndsAt,
  });

  return c.json({
    id,
    text,
    status: "OPEN",
    createdAt: now,
    votingEndsAt,
    voteCount: 0,
    hasVoted: false,
  });
});

/** POST /feedback/:id/vote — vote on feedback */
feedbackRoute.post("/:id/vote", async (c) => {
  const employeeId = c.req.header("x-employee-id");
  if (!employeeId) {
    return c.json({ error: "x-employee-id required" }, 401);
  }

  const id = c.req.param("id");
  const db = getDb(c.env);
  const now = nowIso();

  const [row] = await db
    .select()
    .from(feedback)
    .where(eq(feedback.id, id))
    .limit(1);

  if (!row) {
    return c.json({ error: "Feedback not found" }, 404);
  }

  if (row.status !== "OPEN") {
    return c.json({ error: "Voting closed for this feedback" }, 400);
  }

  if (row.votingEndsAt < now) {
    await db
      .update(feedback)
      .set({ status: "EXPIRED" })
      .where(eq(feedback.id, id));
    return c.json({ error: "Voting deadline passed" }, 400);
  }

  const [existing] = await db
    .select()
    .from(feedbackVotes)
    .where(
      and(
        eq(feedbackVotes.feedbackId, id),
        eq(feedbackVotes.employeeId, employeeId),
      ),
    )
    .limit(1);

  if (existing) {
    return c.json({ error: "Already voted" }, 400);
  }

  await db.insert(feedbackVotes).values({
    feedbackId: id,
    employeeId,
    createdAt: now,
  });

  const [countResult] = await db
    .select({ count: sql<number>`count(*)`.as("count") })
    .from(feedbackVotes)
    .where(eq(feedbackVotes.feedbackId, id));

  const voteCount = Number(countResult?.count ?? 0);

  if (voteCount >= VOTE_THRESHOLD) {
    await db
      .update(feedback)
      .set({ status: "ESCALATED" })
      .where(eq(feedback.id, id));
  }

  return c.json({
    voteCount: voteCount >= VOTE_THRESHOLD ? voteCount : voteCount,
    status: voteCount >= VOTE_THRESHOLD ? "ESCALATED" : "OPEN",
  });
});

/** DELETE /feedback/:id — creator deletes their feedback (and all votes) */
feedbackRoute.delete("/:id", async (c) => {
  const employeeId = c.req.header("x-employee-id");
  if (!employeeId) {
    return c.json({ error: "x-employee-id required" }, 401);
  }

  const id = c.req.param("id");
  const db = getDb(c.env);

  const [row] = await db
    .select()
    .from(feedback)
    .where(eq(feedback.id, id))
    .limit(1);

  if (!row) {
    return c.json({ error: "Feedback not found" }, 404);
  }

  if (row.employeeId !== employeeId) {
    return c.json({ error: "Only the creator can delete this feedback" }, 403);
  }

  if (row.status !== "OPEN") {
    return c.json({ error: "Can only delete OPEN feedback" }, 400);
  }

  await db.delete(feedbackVotes).where(eq(feedbackVotes.feedbackId, id));
  await db.delete(feedback).where(eq(feedback.id, id));

  return c.json({ deleted: true });
});

/** DELETE /feedback/:id/vote — remove vote. Voter removes own vote; creator can remove any vote via ?voterId=xxx */
feedbackRoute.delete("/:id/vote", async (c) => {
  const employeeId = c.req.header("x-employee-id");
  if (!employeeId) {
    return c.json({ error: "x-employee-id required" }, 401);
  }

  const id = c.req.param("id");
  const voterIdParam = c.req.query("voterId");
  const db = getDb(c.env);

  const [row] = await db
    .select()
    .from(feedback)
    .where(eq(feedback.id, id))
    .limit(1);

  if (!row || row.status !== "OPEN") {
    return c.json({ error: "Cannot remove vote" }, 400);
  }

  const targetVoterId = voterIdParam?.trim() || employeeId;

  if (targetVoterId !== employeeId) {
    if (row.employeeId !== employeeId) {
      return c.json(
        { error: "Only the creator can remove another voter's vote" },
        403,
      );
    }
  }

  if (targetVoterId !== employeeId && row.employeeId !== employeeId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await db
    .delete(feedbackVotes)
    .where(
      and(
        eq(feedbackVotes.feedbackId, id),
        eq(feedbackVotes.employeeId, targetVoterId),
      ),
    );

  const [countResult] = await db
    .select({ count: sql<number>`count(*)`.as("count") })
    .from(feedbackVotes)
    .where(eq(feedbackVotes.feedbackId, id));

  const voteCount = Number(countResult?.count ?? 0);
  return c.json({ voteCount });
});

export default feedbackRoute;
