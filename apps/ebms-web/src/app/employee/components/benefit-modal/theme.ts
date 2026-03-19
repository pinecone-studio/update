/** @format */

import type {
  BenefitCardProps,
  EligibilityRule,
} from "@/app/_components/BenefitCard";

export type Status = BenefitCardProps["status"];

export const STATUS_BADGE: Record<Status, string> = {
  ACTIVE: "border-[#00d3a7]/40 bg-[#0a6b63]/35 text-[#1bf5ca]",
  ELIGIBLE: "border-[#5f9bff]/40 bg-[#274ca6]/35 text-[#74acff]",
  PENDING: "border-[#FFB84D]/55 bg-[#7A4A1B]/45 text-[#FFC247]",
  LOCKED: "border-[#ff6799]/45 bg-[#79284d]/35 text-[#ff7fa7]",
  REJECTED: "border-[#ff7d87]/45 bg-[#7f2b40]/35 text-[#ff8d96]",
};

const lightFrame =
  "border border-slate-200 bg-white shadow-xl dark:border-[0.72px] dark:border-[rgba(185,189,255,0.24)] dark:shadow-[0_30px_80px_rgba(7,10,28,0.45)]";
const lightHeader =
  "bg-gradient-to-br from-slate-50 to-slate-100 dark:bg-[linear-gradient(135deg,rgba(18,20,56,0.98)_0%,rgba(22,28,72,0.98)_52%,rgba(16,18,54,0.98)_100%)]";
const lightBody =
  "bg-slate-50/80 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(88,119,255,0.15),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.10),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]";
const lightSection =
  "border-slate-200 bg-white/80 dark:border-white/8 dark:bg-white/[0.025]";
const lightFooter =
  "border-slate-200 bg-white dark:border-white/8 dark:bg-[rgba(18,22,52,0.9)]";

export const MODAL_THEME: Record<
  Status,
  {
    frame: string;
    header: string;
    body: string;
    section: string;
    summary: string;
    rulePass: string;
    ruleFail: string;
    closeBtn: string;
    footer: string;
  }
> = {
  ACTIVE: {
    frame: lightFrame,
    header: lightHeader,
    body:
      "bg-emerald-50/60 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(88,119,255,0.15),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.10),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]",
    section: lightSection,
    summary:
      "border-emerald-200 bg-emerald-50/90 dark:border-[rgba(86,124,196,0.55)] dark:bg-[linear-gradient(135deg,rgba(48,82,133,0.40)_0%,rgba(45,68,122,0.30)_48%,rgba(39,51,108,0.24)_100%)]",
    rulePass:
      "border-emerald-200 bg-emerald-50 dark:border-[#1a735f]/45 dark:bg-[linear-gradient(120deg,rgba(22,84,78,0.84)_0%,rgba(20,74,83,0.84)_100%)]",
    ruleFail:
      "border-rose-200 bg-rose-50 dark:border-[#87506b]/42 dark:bg-[linear-gradient(120deg,rgba(72,37,67,0.86)_0%,rgba(66,34,68,0.86)_100%)]",
    closeBtn: "",
    footer: lightFooter,
  },
  ELIGIBLE: {
    frame: lightFrame,
    header: lightHeader,
    body:
      "bg-blue-50/50 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(88,119,255,0.15),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.10),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]",
    section: lightSection,
    summary:
      "border-blue-200 bg-blue-50/90 dark:border-[rgba(86,124,196,0.55)] dark:bg-[linear-gradient(135deg,rgba(48,82,133,0.40)_0%,rgba(45,68,122,0.30)_48%,rgba(39,51,108,0.24)_100%)]",
    rulePass:
      "border-emerald-200 bg-emerald-50 dark:border-[#1a735f]/45 dark:bg-[linear-gradient(120deg,rgba(22,84,78,0.84)_0%,rgba(20,74,83,0.84)_100%)]",
    ruleFail:
      "border-rose-200 bg-rose-50 dark:border-[#87506b]/42 dark:bg-[linear-gradient(120deg,rgba(72,37,67,0.86)_0%,rgba(66,34,68,0.86)_100%)]",
    closeBtn: "",
    footer: lightFooter,
  },
  PENDING: {
    frame: lightFrame,
    header: lightHeader,
    body:
      "bg-amber-50/50 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(255,184,77,0.12),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.08),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]",
    section: lightSection,
    summary:
      "border-amber-200 bg-amber-50/90 dark:border-[rgba(146,120,96,0.60)] dark:bg-[linear-gradient(135deg,rgba(124,86,54,0.34)_0%,rgba(90,66,54,0.26)_100%)]",
    rulePass:
      "border-emerald-200 bg-emerald-50 dark:border-[#1a735f]/45 dark:bg-[linear-gradient(120deg,rgba(22,84,78,0.84)_0%,rgba(20,74,83,0.84)_100%)]",
    ruleFail:
      "border-rose-200 bg-rose-50 dark:border-[#87506b]/42 dark:bg-[linear-gradient(120deg,rgba(72,37,67,0.86)_0%,rgba(66,34,68,0.86)_100%)]",
    closeBtn: "",
    footer: lightFooter,
  },
  LOCKED: {
    frame: lightFrame,
    header: lightHeader,
    body:
      "bg-rose-50/40 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(221,110,148,0.12),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.08),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]",
    section: lightSection,
    summary:
      "border-rose-200 bg-rose-50/90 dark:border-[rgba(146,90,118,0.60)] dark:bg-[linear-gradient(135deg,rgba(97,52,93,0.34)_0%,rgba(78,45,95,0.24)_100%)]",
    rulePass:
      "border-emerald-200 bg-emerald-50 dark:border-[#1a735f]/45 dark:bg-[linear-gradient(120deg,rgba(22,84,78,0.84)_0%,rgba(20,74,83,0.84)_100%)]",
    ruleFail:
      "border-rose-200 bg-rose-50 dark:border-[#87506b]/42 dark:bg-[linear-gradient(120deg,rgba(72,37,67,0.86)_0%,rgba(66,34,68,0.86)_100%)]",
    closeBtn: "",
    footer: lightFooter,
  },
  REJECTED: {
    frame: lightFrame,
    header: lightHeader,
    body:
      "bg-rose-50/40 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(225,103,118,0.14),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.08),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]",
    section: lightSection,
    summary:
      "border-rose-200 bg-rose-50/90 dark:border-[rgba(164,92,112,0.60)] dark:bg-[linear-gradient(135deg,rgba(106,54,74,0.34)_0%,rgba(84,46,82,0.24)_100%)]",
    rulePass:
      "border-emerald-200 bg-emerald-50 dark:border-[#1a735f]/45 dark:bg-[linear-gradient(120deg,rgba(22,84,78,0.84)_0%,rgba(20,74,83,0.84)_100%)]",
    ruleFail:
      "border-rose-200 bg-rose-50 dark:border-[#87506b]/42 dark:bg-[linear-gradient(120deg,rgba(72,37,67,0.86)_0%,rgba(66,34,68,0.86)_100%)]",
    closeBtn: "",
    footer: lightFooter,
  },
};

export function getRules(benefit: BenefitCardProps): EligibilityRule[] {
  if (benefit.eligibilityRules && benefit.eligibilityRules.length > 0) {
    return benefit.eligibilityRules;
  }
  const baseRule = (benefit.eligibilityCriteria ?? "").trim();
  const fallbackRule =
    baseRule ||
    (benefit.status === "LOCKED" ? "Role requirement" : "Eligibility rule");
  const failureDetail =
    benefit.status === "LOCKED"
      ? benefit.lockReason
      : benefit.status === "REJECTED"
        ? benefit.rejectReason
        : undefined;

  if (benefit.status === "LOCKED" || benefit.status === "REJECTED") {
    return [
      {
        rule: fallbackRule,
        passed: false,
        detail: failureDetail,
      },
    ];
  }

  return [
    {
      rule: fallbackRule,
      passed: true,
    },
  ];
}
