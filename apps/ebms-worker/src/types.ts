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
  /** Resend API key — set via `wrangler secret set RESEND_API_KEY` */
  RESEND_API_KEY?: string;
  /** From address for Resend — e.g. "EBMS <noreply@yourdomain.com>" or "onboarding@resend.dev" for testing */
  RESEND_FROM_EMAIL?: string;
}
