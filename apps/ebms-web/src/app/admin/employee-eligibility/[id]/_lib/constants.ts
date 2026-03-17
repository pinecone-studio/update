import type { BenefitStatus } from "./types";

export const statusOptions: BenefitStatus[] = [
  "ACTIVE",
  "PENDING",
  "ELIGIBLE",
  "LOCKED",
];

export const modalStatusOptions: Array<Exclude<BenefitStatus, "LOCKED">> = [
  "ACTIVE",
  "PENDING",
  "ELIGIBLE",
];

export const statusCopy: Record<BenefitStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  ELIGIBLE: "Eligible",
  LOCKED: "Locked",
};

export const statusButtonClass: Record<BenefitStatus, string> = {
  ACTIVE:
    "border-[#365C70] bg-[linear-gradient(180deg,rgba(30,60,79,0.95),rgba(24,47,63,0.95))] text-white",
  PENDING:
    "border-[#48405D] bg-[linear-gradient(180deg,rgba(52,48,73,0.95),rgba(42,38,60,0.95))] text-white",
  ELIGIBLE:
    "border-[#36527C] bg-[linear-gradient(180deg,rgba(41,63,101,0.95),rgba(33,51,82,0.95))] text-white",
  LOCKED:
    "border-[#5E3849] bg-[linear-gradient(180deg,rgba(81,42,57,0.95),rgba(63,34,45,0.95))] text-white",
};
