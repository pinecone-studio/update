-- Eligibility rule config (versioned JSON) — HR updates without deploy
-- Run: wrangler d1 execute ebms-db --remote --file=./drizzle/migrations/0001_eligibility_config.sql

CREATE TABLE IF NOT EXISTS eligibility_config (
  id TEXT PRIMARY KEY,
  version TEXT NOT NULL,
  config_data TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 0,
  created_at TEXT
);
