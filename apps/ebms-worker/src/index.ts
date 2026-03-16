/**
 * EBMS Cloudflare Worker — GraphQL API + Eligibility Engine
 * TDD-EBMS-2025-001
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { createYoga, createSchema } from "graphql-yoga";
import type { Env } from "./types";
import { typeDefs, resolvers } from "./graphql";
import adminContracts from "./routes/adminContracts";
import adminFeedback from "./routes/adminFeedback";
import contractsRoute from "./routes/contracts";
import feedbackRoute from "./routes/feedback";

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
app.route("/admin/feedback", adminFeedback);
app.route("/feedback", feedbackRoute);
app.route("/contracts", contractsRoute);

app.all("/graphql", (c) => {
  // MVP auth: forward employee identity via headers.
  // Later: replace with JWT (Clerk/Auth.js).
  const employeeId = c.req.header("x-employee-id") ?? null;
  const role = c.req.header("x-role") ?? null;
  return yoga.fetch(c.req.raw, { env: c.env, employeeId, role });
});

export default app;
