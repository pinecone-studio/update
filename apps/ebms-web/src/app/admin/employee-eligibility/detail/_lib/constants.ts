import type { BenefitStatus } from "./types";

export const statusOptions: BenefitStatus[] = [
  "ACTIVE",
  "PENDING",
  "ELIGIBLE",
  "LOCKED",
];

export const modalStatusOptions: Array<
  Exclude<BenefitStatus, "LOCKED" | "REJECTED">
> = ["ACTIVE", "PENDING", "ELIGIBLE"];

export const statusCopy: Record<BenefitStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  ELIGIBLE: "Eligible",
  LOCKED: "Locked",
  REJECTED: "Rejected",
};

export const statusButtonClass: Record<BenefitStatus, string> = {
  ACTIVE:
    "border-[rgba(46,93,116,0.48)] bg-[linear-gradient(180deg,rgba(26,53,72,0.98),rgba(28,53,72,0.96))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] dark:border-white/20",
  PENDING:
    "border-[rgba(138,82,18,0.48)] bg-[linear-gradient(180deg,rgba(138,82,18,0.98),rgba(118,68,13,0.96))] text-[#FFF2DA] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] dark:border-white/20",
  ELIGIBLE:
    "border-[rgba(69,90,134,0.48)] bg-[linear-gradient(180deg,rgba(43,55,94,0.97),rgba(41,52,90,0.96))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] dark:border-white/20",
  LOCKED:
    "border-[rgba(94,56,73,0.48)] bg-[linear-gradient(180deg,rgba(81,42,57,0.95),rgba(63,34,45,0.95))] text-white dark:border-white/20",
  REJECTED:
    "border-[rgba(94,56,73,0.48)] bg-[linear-gradient(180deg,rgba(81,42,57,0.95),rgba(63,34,45,0.95))] text-white dark:border-white/20",
};
