/**
 * EBMS Worker bindings and env types
 */

export interface Env {
  DB: D1Database;
  CONTRACTS: R2Bucket;
  ELIGIBILITY_CACHE: KVNamespace;
  ENVIRONMENT: string;
}
