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
    footer: string;
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
      "border-[#14989c]/45 bg-[linear-gradient(120deg,rgba(16,101,108,0.94)_0%,rgba(17,91,111,0.94)_100%)]",
    ruleFail:
      "border-[#b6546d]/40 bg-[linear-gradient(120deg,rgba(84,39,55,0.95)_0%,rgba(73,34,55,0.95)_100%)]",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
    footer: "border-white/10 bg-[#101a34]/85",
  },
  ELIGIBLE: {
    frame:
      "border-[0.41px] border-[#51A2FF66] shadow-[0_17.92px_35.85px_-8.6px_rgba(0,0,0,0.25)]",
    header:
      "bg-[radial-gradient(circle_at_18%_16%,rgba(168,117,255,0.18),transparent_46%),radial-gradient(circle_at_78%_72%,rgba(90,128,255,0.14),transparent_48%),linear-gradient(135deg,rgba(53,41,112,0.62)_0%,rgba(42,34,104,0.56)_52%,rgba(35,29,96,0.52)_100%)]",
    body: "bg-[radial-gradient(circle_at_18%_16%,rgba(168,117,255,0.15),transparent_50%),radial-gradient(circle_at_76%_70%,rgba(90,128,255,0.12),transparent_50%),linear-gradient(135deg,rgba(53,41,112,0.56)_0%,rgba(42,34,104,0.50)_52%,rgba(35,29,96,0.46)_100%)]",
    section:
      "border-[rgba(122,139,201,0.45)] bg-[linear-gradient(120deg,rgba(82,82,154,0.38)_0%,rgba(77,72,147,0.34)_52%,rgba(72,66,141,0.30)_100%)]",
    rulePass:
      "border-[#14989c]/45 bg-[linear-gradient(120deg,rgba(16,101,108,0.94)_0%,rgba(17,91,111,0.94)_100%)]",
    ruleFail:
      "border-[#b6546d]/40 bg-[linear-gradient(120deg,rgba(84,39,55,0.95)_0%,rgba(73,34,55,0.95)_100%)]",
    closeBtn: "border-[#5a6fae] bg-[#303e68] hover:bg-[#394b7e]",
    footer: "border-white/10 bg-[#101a34]/85",
  },
  PENDING: {
    frame:
      "border-[0.4px] border-[#FF9C2D80] shadow-[0_17.43px_34.85px_-8.36px_rgba(0,0,0,0.25)]",
    header:
      "bg-[linear-gradient(90deg,rgba(8,44,72,0.98)_0%,rgba(11,35,66,0.98)_52%,rgba(14,28,60,0.98)_100%)]",
    body: "bg-[radial-gradient(circle_at_18%_20%,rgba(255,180,72,0.18),transparent_34%),radial-gradient(circle_at_74%_58%,rgba(255,218,133,0.1),transparent_42%),linear-gradient(120deg,rgba(77,50,28,0.96)_0%,rgba(68,43,28,0.95)_42%,rgba(54,34,25,0.97)_100%)]",
    section:
      "border-[#9c7240]/85 bg-[linear-gradient(120deg,rgba(108,72,41,0.93)_0%,rgba(94,62,39,0.94)_52%,rgba(79,52,35,0.95)_100%)]",
    rulePass:
      "border-[#14989c]/45 bg-[linear-gradient(120deg,rgba(16,101,108,0.94)_0%,rgba(17,91,111,0.94)_100%)]",
    ruleFail:
      "border-[#b6546d]/40 bg-[linear-gradient(120deg,rgba(84,39,55,0.95)_0%,rgba(73,34,55,0.95)_100%)]",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
    footer: "border-white/10 bg-[#101a34]/85",
  },
  LOCKED: {
      frame:
      "border-[0.58px] border-[#00D49266] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
    header:
      "bg-[linear-gradient(90deg,rgba(8,44,72,0.98)_0%,rgba(11,35,66,0.98)_52%,rgba(14,28,60,0.98)_100%)]",
    body: "bg-[radial-gradient(circle_at_18%_18%,rgba(214,66,102,0.18),transparent_34%),radial-gradient(circle_at_78%_56%,rgba(188,58,120,0.12),transparent_42%),linear-gradient(120deg,rgba(75,35,49,0.96)_0%,rgba(64,31,56,0.95)_42%,rgba(48,25,52,0.97)_100%)]",
    section:
      "border-[#8d4b76]/50 bg-[linear-gradient(120deg,#5A2B55_0%,#47265D_100%)]",
    rulePass:
      "border-[#14989c]/45 bg-[linear-gradient(120deg,rgba(16,101,108,0.94)_0%,rgba(17,91,111,0.94)_100%)]",
    ruleFail:
      "border-[#b6546d]/40 bg-[linear-gradient(120deg,rgba(84,39,55,0.95)_0%,rgba(73,34,55,0.95)_100%)]",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
    footer: "border-white/10 bg-[#101a34]/85",
  },
  REJECTED: {
    frame:
      "border-[#e16776]/45 shadow-[0_0_0_1px_rgba(225,103,118,0.16),0_24px_80px_rgba(0,0,0,0.58)]",
    header:
      "bg-[radial-gradient(circle_at_18%_32%,rgba(170,57,73,0.30),transparent_54%),linear-gradient(120deg,#2a1f4a_0%,#2f1e3f_100%)]",
    body: "bg-[radial-gradient(circle_at_24%_24%,rgba(173,64,87,0.24),transparent_48%),linear-gradient(135deg,#4b2337_0%,#3b1f58_100%)]",
    section: "border-white/12 bg-white/5",
    rulePass:
      "border-[#14989c]/45 bg-[linear-gradient(120deg,rgba(16,101,108,0.94)_0%,rgba(17,91,111,0.94)_100%)]",
    ruleFail:
      "border-[#b6546d]/40 bg-[linear-gradient(120deg,rgba(84,39,55,0.95)_0%,rgba(73,34,55,0.95)_100%)]",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
    footer: "border-white/10 bg-[#101a34]/85",
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
