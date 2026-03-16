-- Employee contracts table (admin-uploaded employee contract PDFs, separate from benefit_requests flow)
CREATE TABLE IF NOT EXISTS employee_contracts (
  id TEXT PRIMARY KEY,
  benefit_id TEXT NOT NULL,
  version TEXT NOT NULL,
  r2_object_key TEXT NOT NULL,
  effective_date TEXT,
  expiry_date TEXT,
  created_at TEXT,
  updated_at TEXT
);
