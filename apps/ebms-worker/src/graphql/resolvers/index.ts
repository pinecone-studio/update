import * as Mutation from "./mutations";
import * as Query from "./queries";
import { Employee } from "./resolvers/employee";
import { Benefit } from "./resolvers/benefit";
import type { Resolvers } from "../generated/graphql";

export const resolvers: Resolvers = {
  Query,
  Mutation,
  Employee,
  Benefit,
} satisfies Resolvers;
