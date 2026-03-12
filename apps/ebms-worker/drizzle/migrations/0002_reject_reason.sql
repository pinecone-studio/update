-- Add reject_reason to benefit_requests for admin rejection feedback
ALTER TABLE benefit_requests ADD COLUMN reject_reason TEXT;
