import * as Mutation from './mutations';
import * as Query from './queries';
import type { Resolvers } from '../generated/graphql';

export const resolvers: Resolvers = {
  Mutation,
  Query,
} satisfies Resolvers;

