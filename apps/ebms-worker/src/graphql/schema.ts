/**
 * EBMS GraphQL schema — TDD §9
 */

export const typeDefs = /* GraphQL */ `
  type Query {
    health: Health!
    hello: String!
  }

  type Health {
    ok: Boolean!
    timestamp: String!
  }
`;

export const resolvers = {
  Query: {
    health: () => ({
      ok: true,
      timestamp: new Date().toISOString(),
    }),
    hello: () => 'Hello from EBMS GraphQL',
  },
};
