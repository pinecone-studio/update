/**
 * EBMS Worker bindings and env types
 */

export interface Env {
  DB: D1Database;
  CONTRACTS: R2Bucket;
  /** KV eligibility cache — binding present, unused (avoids free-tier write limits) */
  ELIGIBILITY_CACHE: KVNamespace;
  ENVIRONMENT: string;
  /** Feature flag: disable requireHR/requireAdmin checks when true */
  DISABLE_ROLE_CHECKS?: string;
}
