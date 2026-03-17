import { drizzle } from "drizzle-orm/d1";
import type { Env } from "../types";
import * as schema from "./schema";

export const getDb = (env: Env) => drizzle(env.DB, { schema });
export type Db = ReturnType<typeof getDb>;
