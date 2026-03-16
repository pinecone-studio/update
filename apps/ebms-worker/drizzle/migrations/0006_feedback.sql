-- Benefit feedback with voting — employees create feedback, vote to escalate to admin
-- Run: wrangler d1 execute ebms-db --remote --file=./drizzle/migrations/0006_feedback.sql

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  employee_id TEXT,
  benefit_id TEXT,
  is_anonymous INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'OPEN',
  created_at TEXT NOT NULL,
  voting_ends_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback_votes (
  feedback_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (feedback_id, employee_id),
  FOREIGN KEY (feedback_id) REFERENCES feedback(id)
);

CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_voting_ends_at ON feedback(voting_ends_at);
