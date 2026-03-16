-- Add closed_at to feedback — admin marks as seen/closed
-- Run: wrangler d1 execute ebms-db --remote --file=./drizzle/migrations/0007_feedback_closed_at.sql

ALTER TABLE feedback ADD COLUMN closed_at TEXT;
