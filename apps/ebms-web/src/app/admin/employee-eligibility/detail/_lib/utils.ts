import { GraphQLClient } from "graphql-request";
import { getActiveUserHeaders } from "@/app/_lib/activeUser";
import type { BenefitStatus, EmployeeBenefit } from "./types";
import { statusButtonClass } from "./constants";

export function getStatusSegmentClass(
  option: BenefitStatus,
  selected: boolean,
) {
  const base =
    "inline-flex h-[60px] w-full items-center justify-center rounded-[12px] border text-[16px] font-medium tracking-[-0.01em] transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A9BFF]/70";
  if (selected) return `${base} ${statusButtonClass[option]}`;
  return `${base} border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-[#4D78B8] dark:hover:bg-[#2a2540]`;
}

export function getClient(): GraphQLClient {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const base =
    raw.replace(/\/graphql\/?$/, "").trim() || "http://localhost:8787";
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      ...getActiveUserHeaders("admin"),
    },
  });
}

export function getErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "response" in e) {
    const res = (e as { response?: { errors?: Array<{ message?: string }> } })
      .response;
    const msg = res?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

export function formatRoleLabel(value: string): string {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function inferReason(benefit: EmployeeBenefit): string {
  if (benefit.overrideApplied && benefit.overrideReason?.trim()) {
    return benefit.overrideReason.trim();
  }
  if (benefit.rejectedReason?.trim()) {
    return benefit.rejectedReason.trim();
  }
  const failedRule = benefit.ruleEvaluations?.find((e) => !e.passed);
  if (failedRule?.reason) return failedRule.reason;
  if (benefit.status === "ELIGIBLE" || benefit.status === "ACTIVE") {
    return "Meets all requirements";
  }
  return "See eligibility rules";
}

export function formatComputedAt(
  computedAt: string | null | undefined,
): string {
  if (!computedAt?.trim()) return "—";
  try {
    const d = new Date(computedAt);
    if (Number.isNaN(d.getTime())) return computedAt;
    const dateStr = d.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${dateStr} ${timeStr}`;
  } catch {
    return computedAt;
  }
}
