-- Employee notifications (in-app + email)
CREATE TABLE IF NOT EXISTS employee_notifications (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL,
  tone TEXT NOT NULL DEFAULT 'info',
  channel TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'delivered',
  is_read INTEGER NOT NULL DEFAULT 0,
  dedupe_key TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);
