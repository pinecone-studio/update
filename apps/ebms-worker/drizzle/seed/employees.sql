-- Employee seed — давхардсан үед шинэ өгөгдлөөр солино (INSERT OR REPLACE)
-- Local: wrangler d1 execute ebms-db --local --file=./drizzle/seed/employees.sql
-- Remote: wrangler d1 execute ebms-db --remote --file=./drizzle/seed/employees.sql

INSERT OR REPLACE INTO employees (
  id, email, name, name_eng, role, department, responsibility_level,
  employment_status, hire_date, okr_submitted, late_arrival_count,
  late_arrival_updated_at, employee_code, created_at, updated_at
) VALUES
  ('emp-1',      'emp-1@gmail.com',          'emp-1-name',     'emp-1-name-eng',   'admin',           'emp-1-d',        2, 'active', '2020-09-09', 0, 0, NULL, NULL, datetime('now'), datetime('now')),
  ('ganaa-1',    'gantushig98@gmail.com',    'Gantuushig',     'Gantuushig-Eng',   'finance-manager', 'hr',             3, 'active', '2020-09-19', 0, 0, NULL, NULL, datetime('now'), datetime('now')),
  ('uuganaa-1',  'uuganaa89@gmail.com',      'Uuganaa',        'Uuganaa-Eng',      'employee',        'backup-office',  2, 'active', '2023-09-23', 0, 0, NULL, NULL, datetime('now'), datetime('now')),
  ('soroo-1',    'mngnszmn@gmail.com',       'Soroo',          'Soroo-Eng',        'manager',         'hr',             3, 'active', '2023-09-23', 0, 0, NULL, NULL, datetime('now'), datetime('now')),
  ('ogoo-1',     'ogoo591@gmail.com',        'Oogii Ogoo',     'Ogoo-Eng',         'hr',              'hr',             3, 'active', '2023-09-23', 0, 0, NULL, NULL, datetime('now'), datetime('now')),
  ('zundui-1',   'khishigzundui@gmail.com',  'Zundui',         'Zundui-Eng',       'ux-engineer',     'ui/ux',          2, 'active', '2023-09-23', 0, 0, NULL, NULL, datetime('now'), datetime('now')),
  ('angarag-1',  'tsangarag1100@gmail.com',  'Angarag',        'Angarag-Eng',      'employee',        'software',       1, 'active', '2023-09-23', 0, 0, NULL, NULL, datetime('now'), datetime('now'));
