-- Add body column to employee_notifications (for tables created without it)
ALTER TABLE employee_notifications ADD COLUMN body TEXT NOT NULL DEFAULT '';
