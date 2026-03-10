-- EBMS D1 schema — TDD Section 10
-- Run: wrangler d1 execute ebms-db --remote --file=./drizzle/migrations/0000_init.sql

CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  name_eng TEXT,
  role TEXT NOT NULL,
  department TEXT,
  responsibility_level INTEGER NOT NULL DEFAULT 1,
  employment_status TEXT NOT NULL DEFAULT 'probation',
  hire_date TEXT,
  okr_submitted INTEGER NOT NULL DEFAULT 0,
  late_arrival_count INTEGER NOT NULL DEFAULT 0,
  late_arrival_updated_at TEXT,
  employee_code TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS benefits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subsidy_percent INTEGER NOT NULL DEFAULT 0,
  vendor_name TEXT,
  requires_contract INTEGER NOT NULL DEFAULT 0,
  active_contract_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS eligibility_rules (
  id TEXT PRIMARY KEY,
  benefit_id TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  operator TEXT NOT NULL,
  value TEXT NOT NULL,
  error_message TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS benefit_eligibility (
  employee_id TEXT NOT NULL,
  benefit_id TEXT NOT NULL,
  status TEXT NOT NULL,
  rule_evaluation_json TEXT,
  computed_at TEXT NOT NULL,
  override_by TEXT,
  override_reason TEXT,
  override_expires_at TEXT,
  PRIMARY KEY (employee_id, benefit_id)
);

CREATE TABLE IF NOT EXISTS benefit_requests (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  benefit_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  contract_version_accepted TEXT,
  contract_accepted_at TEXT,
  reviewed_by TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  benefit_id TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  version TEXT NOT NULL,
  r2_object_key TEXT NOT NULL,
  sha256_hash TEXT,
  effective_date TEXT,
  expiry_date TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS eligibility_audit (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  benefit_id TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  rule_trace_json TEXT,
  triggered_by TEXT,
  computed_at TEXT NOT NULL,
  created_at TEXT
);
