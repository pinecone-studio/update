/**
 * Eligibility engine: evaluates benefit rules from HR config (eligibility_config).
 * Config is read at runtime — when HR changes rules in the UI, no code deploy needed.
 */

import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import { eligibilityConfig, employees } from "../db/schema";
import { eq } from "drizzle-orm";

type Rule = {
  type: string;
  operator: string;
  value: unknown;
  errorMessage?: string;
};
type BenefitConfig = {
  name?: string;
  category?: string;
  subsidyPercent?: number;
  requiresContract?: boolean;
  financeCheck?: boolean;
  rules?: Rule[];
};
type ConfigBenefits = Record<string, BenefitConfig>;

const EMPLOYEE_FIELD_MAP: Record<string, keyof typeof employees.$inferSelect> =
  {
    employment_status: "employmentStatus",
    okr_submitted: "okrSubmitted",
    late_arrival_count: "lateArrivalCount",
    attendance: "lateArrivalCount",
    responsibility_level: "responsibilityLevel",
    tenure: "tenureDays" as keyof typeof employees.$inferSelect,
  };

function calculateTenureDays(hireDate?: string | null): number {
  if (!hireDate) return 0;
  const parsed = new Date(hireDate);
  if (Number.isNaN(parsed.getTime())) return 0;
  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

function compare(op: string, actual: unknown, expected: unknown): boolean {
  if (op === "eq") {
    if (typeof actual === "number" && typeof expected === "number")
      return actual === expected;
    if (typeof actual === "boolean" && typeof expected === "boolean")
      return actual === expected;
    return String(actual).toLowerCase() === String(expected).toLowerCase();
  }
  const a = Number(actual);
  const b = Number(expected);
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  switch (op) {
    case "lt":
      return a < b;
    case "lte":
      return a <= b;
    case "gte":
      return a >= b;
    case "gt":
      return a > b;
    default:
      return false;
  }
}

function getEmployeeValue(
  emp: Record<string, unknown>,
  ruleType: string,
): unknown {
  const key = EMPLOYEE_FIELD_MAP[ruleType] ?? ruleType;
  let v = emp[key];
  if (key === "okrSubmitted") return v === 1 || v === true || v === "1";
  return v;
}

function evaluateRule(
  rule: Rule,
  employee: Record<string, unknown>,
): { passed: boolean; reason: string } {
  const actual = getEmployeeValue(employee, rule.type);
  const expected = rule.value;
  const passed = compare(rule.operator, actual, expected);
  const reason = passed
    ? "Passed"
    : (rule.errorMessage ??
      `Rule ${rule.type} ${rule.operator} ${String(expected)} not met`);
  return { passed, reason };
}

/** Load active eligibility config from DB (set by HR via UI). */
export async function getActiveEligibilityConfig(
  env: Env,
): Promise<ConfigBenefits | null> {
  const db = getDb(env);
  const rows = await db
    .select({ configData: eligibilityConfig.configData })
    .from(eligibilityConfig)
    .where(eq(eligibilityConfig.isActive, 1))
    .limit(1);
  if (!rows[0]?.configData) return null;
  try {
    const parsed = JSON.parse(rows[0].configData) as {
      benefits?: ConfigBenefits;
    };
    return parsed?.benefits ?? null;
  } catch {
    return null;
  }
}

/** Evaluate one benefit's rules for an employee. Returns status and rule evaluations. */
export function evaluateBenefitRules(
  rules: Rule[],
  employee: Record<string, unknown>,
): {
  status: "ELIGIBLE" | "LOCKED";
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
} {
  if (!rules?.length) {
    return { status: "ELIGIBLE", ruleEvaluations: [] };
  }
  const ruleEvaluations = rules.map((r) => {
    const { passed, reason } = evaluateRule(r, employee);
    return { ruleType: r.type, passed, reason };
  });
  const allPassed = ruleEvaluations.every((e) => e.passed);
  return {
    status: allPassed ? "ELIGIBLE" : "LOCKED",
    ruleEvaluations,
  };
}

/** Load employee row as a flat object for rule evaluation. */
export async function getEmployeeForEligibility(
  env: Env,
  employeeId: string,
): Promise<Record<string, unknown> | null> {
  const db = getDb(env);
  const rows = await db
    .select({
      employmentStatus: employees.employmentStatus,
      okrSubmitted: employees.okrSubmitted,
      lateArrivalCount: employees.lateArrivalCount,
      responsibilityLevel: employees.responsibilityLevel,
      hireDate: employees.hireDate,
    })
    .from(employees)
    .where(eq(employees.id, employeeId))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return {
    employmentStatus: row.employmentStatus ?? "",
    okrSubmitted: Number(row.okrSubmitted ?? 0) > 0,
    lateArrivalCount: row.lateArrivalCount ?? 0,
    responsibilityLevel: row.responsibilityLevel ?? 0,
    tenureDays: calculateTenureDays(row.hireDate),
  };
}
