import { Hono } from "hono";
import { createYoga, createSchema } from "graphql-yoga";
import type { Env } from "./types";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { buildDb } from "./db/db";

const yoga = createYoga({
  schema: createSchema({ typeDefs: typeDefs, resolvers: resolvers }),
  graphqlEndpoint: "/graphql",
});

const app = new Hono<{ Bindings: Env }>();

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

app.all("/graphql", (c) => {
  const db = buildDb(c.env.DB);
  return yoga.fetch(c.req.raw, { env: c.env, db });
});

export default app;
