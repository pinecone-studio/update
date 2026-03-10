/**
 * EBMS Cloudflare Worker — GraphQL API + Eligibility Engine
 * TDD-EBMS-2025-001
 */

import { Hono } from 'hono';
import { createYoga, createSchema } from 'graphql-yoga';
import type { Env } from './types';
import { typeDefs, resolvers } from './graphql/schema';

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/graphql',
});

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) =>
  c.json({
    service: 'EBMS API',
    version: '0.1.0',
    status: 'ok',
    endpoints: {
      health: '/health',
      graphql: '/graphql',
    },
  })
);

app.get('/health', (c) => c.json({ ok: true, timestamp: new Date().toISOString() }));

app.all('/graphql', (c) => yoga.fetch(c.req.raw, c.env));

export default app;
