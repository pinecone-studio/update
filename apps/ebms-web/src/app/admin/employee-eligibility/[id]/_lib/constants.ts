import type { BenefitStatus } from "./types";

export const statusOptions: BenefitStatus[] = [
  "ACTIVE",
  "PENDING",
  "ELIGIBLE",
  "LOCKED",
];

export const modalStatusOptions: BenefitStatus[] = [
  "ACTIVE",
  "PENDING",
  "ELIGIBLE",
  "LOCKED",
];

export const statusCopy: Record<BenefitStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  ELIGIBLE: "Eligible",
  LOCKED: "Locked",
  REJECTED: "Rejected",
};

export const statusButtonClass: Record<BenefitStatus, string> = {
  ACTIVE:
    "border-emerald-600 bg-emerald-600 text-white dark:border-[#365C70] dark:bg-[linear-gradient(180deg,rgba(30,60,79,0.95),rgba(24,47,63,0.95))]",
  PENDING:
    "border-amber-600 bg-amber-600 text-white dark:border-[#D6A743] dark:bg-[linear-gradient(180deg,rgba(120,88,29,0.92),rgba(97,69,24,0.92))]",
  ELIGIBLE:
    "border-blue-600 bg-blue-600 text-white dark:border-[#36527C] dark:bg-[linear-gradient(180deg,rgba(41,63,101,0.95),rgba(33,51,82,0.95))]",
  LOCKED:
    "border-rose-600 bg-rose-600 text-white dark:border-[#5E3849] dark:bg-[linear-gradient(180deg,rgba(81,42,57,0.95),rgba(63,34,45,0.95))]",
  REJECTED:
    "border-rose-600 bg-rose-600 text-white dark:border-[#5E3849] dark:bg-[linear-gradient(180deg,rgba(81,42,57,0.95),rgba(63,34,45,0.95))]",
};
