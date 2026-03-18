-- Role notifications (admin, finance, hr) — single table with recipient_role
CREATE TABLE IF NOT EXISTS role_notifications (
  id TEXT PRIMARY KEY,
  recipient_role TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL,
  tone TEXT NOT NULL DEFAULT 'info',
  is_read INTEGER NOT NULL DEFAULT 0,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);
