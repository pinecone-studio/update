import type { Ctx } from "../context";
import type { QueryResolvers } from "../../generated/graphql";

export const health: NonNullable<QueryResolvers<Ctx>["health"]> = async () => ({
  ok: true,
  timestamp: new Date().toISOString(),
});
