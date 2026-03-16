/**
 * EBMS D1 schema — TDD Section 10
 * SQLite-compatible for Cloudflare D1
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const employees = sqliteTable('employees', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  nameEng: text('name_eng'),
  role: text('role').notNull(),
  department: text('department'),
  responsibilityLevel: integer('responsibility_level').notNull().default(1),
  employmentStatus: text('employment_status').notNull().default('probation'),
  hireDate: text('hire_date'),
  okrSubmitted: integer('okr_submitted').notNull().default(0),
  lateArrivalCount: integer('late_arrival_count').notNull().default(0),
  lateArrivalUpdatedAt: text('late_arrival_updated_at'),
  employeeCode: text('employee_code'),
  createdAt: text('created_at').default(''),
  updatedAt: text('updated_at').default(''),
});

export const benefits = sqliteTable('benefits', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  subsidyPercent: integer('subsidy_percent').notNull().default(0),
  vendorName: text('vendor_name'),
  requiresContract: integer('requires_contract').notNull().default(0),
  activeContractId: text('active_contract_id'),
  isActive: integer('is_active').notNull().default(1),
  createdAt: text('created_at').default(''),
  updatedAt: text('updated_at').default(''),
});

export const eligibilityRules = sqliteTable('eligibility_rules', {
  id: text('id').primaryKey(),
  benefitId: text('benefit_id').notNull(),
  ruleType: text('rule_type').notNull(),
  operator: text('operator').notNull(),
  value: text('value').notNull(), // JSON
  errorMessage: text('error_message'),
  priority: integer('priority').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
  createdAt: text('created_at').default(''),  
  updatedAt: text('updated_at').default(''),
});

export const benefitEligibility = sqliteTable('benefit_eligibility', {
  employeeId: text('employee_id').notNull(),
  benefitId: text('benefit_id').notNull(),
  status: text('status').notNull(),
  ruleEvaluationJson: text('rule_evaluation_json'),
  computedAt: text('computed_at').notNull(),
  overrideBy: text('override_by'),
  overrideReason: text('override_reason'),
  overrideExpiresAt: text('override_expires_at'),
});

export const benefitRequests = sqliteTable('benefit_requests', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  benefitId: text('benefit_id').notNull(),
  status: text('status').notNull().default('pending'),
  contractVersionAccepted: text('contract_version_accepted'),
  contractAcceptedAt: text('contract_accepted_at'),
  employeeContractR2Key: text('employee_contract_r2_key'),
  employeeContractUploadedAt: text('employee_contract_uploaded_at'),
  reviewedBy: text('reviewed_by'),
  rejectReason: text('reject_reason'),
  createdAt: text('created_at').default(''),
  updatedAt: text('updated_at').default(''),
});

export const contracts = sqliteTable('contracts', {
  id: text('id').primaryKey(),
  benefitId: text('benefit_id').notNull(),
  vendorName: text('vendor_name').notNull(),
  version: text('version').notNull(),
  r2ObjectKey: text('r2_object_key').notNull(),
  sha256Hash: text('sha256_hash'),
  effectiveDate: text('effective_date'),
  expiryDate: text('expiry_date'),
  isActive: integer('is_active').notNull().default(1),
  createdAt: text('created_at').default(''),
  updatedAt: text('updated_at').default(''),
});

/** Admin-uploaded employee contracts (separate from benefit_requests.employee_contract_r2_key) */
export const employeeContracts = sqliteTable('employee_contracts', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id'),
  benefitId: text('benefit_id').notNull(),
  version: text('version').notNull(),
  r2ObjectKey: text('r2_object_key').notNull(),
  effectiveDate: text('effective_date'),
  expiryDate: text('expiry_date'),
  createdAt: text('created_at').default(''),
  updatedAt: text('updated_at').default(''),
});

/** Versioned eligibility-rules.json — HR can update without code deploy */
export const eligibilityConfig = sqliteTable('eligibility_config', {
  id: text('id').primaryKey(),
  version: text('version').notNull(),
  configData: text('config_data').notNull(),
  isActive: integer('is_active').notNull().default(0),
  createdAt: text('created_at').default(''),
});

export const eligibilityAudit = sqliteTable('eligibility_audit', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  benefitId: text('benefit_id').notNull(),
  oldStatus: text('old_status'),
  newStatus: text('new_status').notNull(),
  ruleTraceJson: text('rule_trace_json'),
  triggeredBy: text('triggered_by'),
  computedAt: text('computed_at').notNull(),
  createdAt: text('created_at').default(''),
});

export const employeeNotifications = sqliteTable('employee_notifications', {
  id: text('id').primaryKey(),
  employeeId: text('employee_id').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  type: text('type').notNull(),
  tone: text('tone').notNull().default('info'),
  channel: text('channel').notNull(),
  deliveryStatus: text('delivery_status').notNull().default('delivered'),
  isRead: integer('is_read').notNull().default(0),
  dedupeKey: text('dedupe_key'),
  metadataJson: text('metadata_json'),
  createdAt: text('created_at').notNull(),
});
