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

export const MODAL_THEME: Record<
  Status,
  {
    frame: string;
    header: string;
    body: string;
    section: string;
    rulePass: string;
    ruleFail: string;
    closeBtn: string;
  }
> = {
  ACTIVE: {
    frame:
      "border-[0.58px] border-[#00D49266] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
    header:
      "bg-[linear-gradient(90deg,rgba(8,44,72,0.98)_0%,rgba(11,35,66,0.98)_52%,rgba(14,28,60,0.98)_100%)]",
    body: "bg-[radial-gradient(circle_at_16%_22%,rgba(0,160,138,0.22),transparent_38%),radial-gradient(circle_at_68%_56%,rgba(11,149,201,0.18),transparent_42%),linear-gradient(120deg,rgba(4,62,73,0.96)_0%,rgba(9,54,83,0.95)_42%,rgba(12,36,66,0.97)_100%)]",
    section:
      "border-[#2e6f82]/55 bg-[linear-gradient(120deg,rgba(30,80,99,0.93)_0%,rgba(27,67,98,0.94)_52%,rgba(26,57,89,0.95)_100%)]",
    rulePass:
      "border-[#00D492]/35 bg-[linear-gradient(120deg,rgba(10,93,99,0.94)_0%,rgba(11,73,91,0.94)_100%)]",
    ruleFail: "border-[#ff6d8f]/35 bg-[#5d2840]/45",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
  },
  ELIGIBLE: {
    frame:
      "border-[0.41px] border-[#51A2FF66] shadow-[0_17.92px_35.85px_-8.6px_rgba(0,0,0,0.25)]",
    header:
      "bg-[linear-gradient(135deg,rgba(43,127,255,0.25)_0%,rgba(97,95,255,0.25)_50%,rgba(152,16,250,0.25)_100%),rgba(15,23,43,0.95)]",
    body: "bg-[linear-gradient(135deg,rgba(43,127,255,0.25)_0%,rgba(97,95,255,0.25)_50%,rgba(152,16,250,0.25)_100%),rgba(15,23,43,0.95)]",
    section:
      "border-[#5f74b8]/45 bg-[linear-gradient(120deg,rgba(58,76,141,0.88)_0%,rgba(62,65,137,0.88)_100%)]",
    rulePass:
      "border-[#22c6b2]/45 bg-[linear-gradient(120deg,rgba(40,76,128,0.90)_0%,rgba(45,58,121,0.90)_100%)]",
    ruleFail: "border-[#ff6d8f]/35 bg-[#5d2840]/45",
    closeBtn: "border-[#5a6fae] bg-[#303e68] hover:bg-[#394b7e]",
  },
  PENDING: {
    frame:
      "border-[0.4px] border-[#FF9C2D80] shadow-[0_17.43px_34.85px_-8.36px_rgba(0,0,0,0.25)]",
    header:
      "bg-[linear-gradient(90deg,rgba(8,44,72,0.98)_0%,rgba(11,35,66,0.98)_52%,rgba(14,28,60,0.98)_100%)]",
    body: "bg-[radial-gradient(circle_at_16%_22%,rgba(0,160,138,0.22),transparent_38%),radial-gradient(circle_at_68%_56%,rgba(11,149,201,0.18),transparent_42%),linear-gradient(120deg,rgba(4,62,73,0.96)_0%,rgba(9,54,83,0.95)_42%,rgba(12,36,66,0.97)_100%)]",
    section:
      "border-[#2e6f82]/55 bg-[linear-gradient(120deg,rgba(30,80,99,0.93)_0%,rgba(27,67,98,0.94)_52%,rgba(26,57,89,0.95)_100%)]",
    rulePass:
      "border-[#27c5ad]/45 bg-[linear-gradient(120deg,#215349_0%,#214B59_100%)]",
    ruleFail:
      "border-[#FF637E66] bg-[linear-gradient(120deg,#74274D_0%,#611E66_100%)]",
    closeBtn: "border-[#806643] bg-[#3f455a] hover:bg-[#4a5168]",
  },
  LOCKED: {
    frame:
      "border-[0.4px] border-[#FF637E66] shadow-[0_17.43px_34.85px_-8.36px_rgba(0,0,0,0.25)]",
    header:
      "bg-[linear-gradient(135deg,rgba(255,32,86,0.25)_0%,rgba(246,51,154,0.25)_50%,rgba(200,0,222,0.25)_100%),#0F172B]",
    body: "bg-[linear-gradient(135deg,rgba(255,32,86,0.25)_0%,rgba(246,51,154,0.25)_50%,rgba(200,0,222,0.25)_100%),#0F172B]",
    section:
      "border-[#8d4b76]/50 bg-[linear-gradient(120deg,#5A2B55_0%,#47265D_100%)]",
    rulePass:
      "border-[#27c5ad]/45 bg-[linear-gradient(120deg,#154F5F_0%,#214764_100%)]",
    ruleFail:
      "border-[#FF637E66] bg-[linear-gradient(120deg,#74274D_0%,#611E66_100%)]",
    closeBtn: "border-[#5b4563] bg-[#2d2d50] hover:bg-[#373760]",
  },
  REJECTED: {
    frame:
      "border-[#e16776]/45 shadow-[0_0_0_1px_rgba(225,103,118,0.16),0_24px_80px_rgba(0,0,0,0.58)]",
    header:
      "bg-[radial-gradient(circle_at_18%_32%,rgba(170,57,73,0.30),transparent_54%),linear-gradient(120deg,#2a1f4a_0%,#2f1e3f_100%)]",
    body: "bg-[radial-gradient(circle_at_24%_24%,rgba(173,64,87,0.24),transparent_48%),linear-gradient(135deg,#4b2337_0%,#3b1f58_100%)]",
    section: "border-white/12 bg-white/5",
    rulePass: "border-[#4de7b5]/40 bg-[#0f5e58]/45",
    ruleFail: "border-[#ff6d8f]/35 bg-[#652246]/50",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
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
