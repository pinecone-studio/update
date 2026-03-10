import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";

export function buildDb(d1: D1Database) {
  return drizzle(d1);
}
