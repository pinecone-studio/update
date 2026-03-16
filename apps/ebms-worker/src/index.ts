/**
 * EBMS Cloudflare Worker — GraphQL API + Eligibility Engine
 * TDD-EBMS-2025-001
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { createYoga, createSchema } from "graphql-yoga";
import { eq } from "drizzle-orm";
import type { Env } from "./types";
import { typeDefs, resolvers } from "./graphql";
import { getDb } from "./db/drizzle";
import { employees } from "./db/schema";
import adminContracts from "./routes/adminContracts";
import contractsRoute from "./routes/contracts";

type YogaContext = {
  env: Env;
  employeeId: string | null;
  role: string | null;
};

const yoga = createYoga<YogaContext>({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/graphql",
});

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-employee-id", "x-role"],
  }),
);

app.get("/", (c) =>
  c.json({
    service: "EBMS API",
    version: "0.1.0",
    status: "ok",
    endpoints: {
      health: "/health",
      graphql: "/graphql",
    },
  }),
);

app.get("/health", (c) =>
  c.json({ ok: true, timestamp: new Date().toISOString() }),
);

app.route("/admin/contracts", adminContracts);
app.route("/contracts", contractsRoute);

app.all("/graphql", async (c) => {
  const employeeId = c.req.header("x-employee-id") ?? null;
  let role: string | null = null;

  // Trust role from DB (source of truth), not from request headers.
  if (employeeId) {
    const db = getDb(c.env);
    const rows = await db
      .select({ role: employees.role })
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);
    role = rows[0]?.role ?? null;
  }

  return yoga.fetch(c.req.raw, { env: c.env, employeeId, role });
});

export default app;
