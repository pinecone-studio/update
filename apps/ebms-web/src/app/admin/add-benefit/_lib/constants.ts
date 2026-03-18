/** Дүрмийн operator-ууд (харьцуулалт) */
export const OPERATORS = [
  { value: "eq", label: "Тэнцүү (eq)" },
  { value: "ne", label: "Үлгаатай (ne)" },
  { value: "lt", label: "Бага (lt)" },
  { value: "lte", label: "Бага буюу тэнцүү (lte)" },
  { value: "gte", label: "Их буюу тэнцүү (gte)" },
  { value: "gt", label: "Их (gt)" },
] as const;

/** String талбарууд (employment_status, role) — зөвхөн eq, ne */
export const OPERATORS_STRING = [
  { value: "eq", label: "Тэнцүү (eq)" },
  { value: "ne", label: "Үлгаатай (ne)" },
] as const;

/** Role утгууд (employees.role) */
export const ROLE_VALUES = [
  "admin",
  "employee",
  "hr",
  "finance",
  "ux_engineer",
] as const;

/** Rule type солиход тохирох default value */
export function getDefaultValueForRuleType(
  type: string,
): string | number | boolean {
  switch (type) {
    case "employment_status":
      return "active";
    case "okr_submitted":
      return true;
    case "responsibility_level":
      return 1;
    case "late_arrival_count":
    case "attendance":
      return 0;
    case "tenure":
      return 180;
    case "role":
      return "employee";
    default:
      return "active";
  }
}

/** String талбар (employment_status, role) — operator eq эсвэл ne байх ёстой */
export function getDefaultOperatorForRuleType(type: string): string {
  if (type === "employment_status" || type === "role") {
    return "eq";
  }
  return "eq";
}

/** Алдааны мессежүүд (нэг дор, тодорхой) */
export const ERROR_MESSAGES = {
  NAME_REQUIRED: "Нэр заавал бөглөнө үү.",
  CATEGORY_REQUIRED: "Ангилал заавал бөглөнө үү.",
  SUBSIDY_RANGE: "Хөнгөлөлтийн хувь 0–100 хооронд байх ёстой.",
  SELECT_BENEFIT: "Дүрэм тохируулах benefit-ийг сонгоно уу.",
  RULE_VALUE_REQUIRED: "Дүрмийн утга бөглөнө үү.",
  D1_CREATE: "D1 руу benefit нэмэхэд алдаа гарлаа: ",
  CONFIG_LOAD: "Дүрмийн config унших үед алдаа: ",
  CONFIG_SAVE: "Дүрэм хадгалах үед алдаа: ",
  BENEFITS_LOAD: "D1-ээс benefit жагсаалт татах үед алдаа: ",
  FINANCE_CHECK_REQUIRED: "Finance check заавал хийнэ үү.",
  CONTRACT_NUMBER_REQUIRED: "Гэрээний дугаар заавал бөглөнө үү.",
  CONTRACT_NAME_REQUIRED: "Гэрээний нэр заавал бөглөнө үү.",
  CONTRACT_FILE_REQUIRED: "Гэрээний файл upload хийнэ үү.",
} as const;

import type { AddBenefitFormState } from "./types";

export const DEFAULT_FORM: AddBenefitFormState = {
  name: "",
  description: "",
  category: "wellness",
  benefitType: "core",
  subsidyPercent: 0,
  financeCheck: false,
  requiresContract: false,
  managerApproval: false,
  contractNumber: "",
  contractName: "",
  contractFileName: "",
  contractUrl: "",
  expiryDuration: 1,
  expiryUnit: "year",
  usagePeriod: 1,
  usagePeriodUnit: "day",
  usageLimit: 1,
  requestDeadline: undefined,
  usageLimitCount: 1,
  usageLimitPeriod: "month",
  activeFromDate: new Date().toISOString().split("T")[0],
};

/** Benefit санал болгох жишээнүүд — Suggest товч дархад field-үүдийг автоматаар бөглөнө */
export const BENEFIT_SUGGESTIONS: AddBenefitFormState[] = [
  {
    name: "Gym Pinefit",
    description: "Gym membership reimbursement for employee wellness.",
    category: "wellness",
    benefitType: "core",
    subsidyPercent: 80,
    financeCheck: false,
    requiresContract: true,
    managerApproval: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
    expiryDuration: 0,
    expiryUnit: "month",
    usagePeriod: 0,
    usagePeriodUnit: "day",
    usageLimit: 0,
    requestDeadline: undefined,
    usageLimitCount: 1,
    usageLimitPeriod: "month",
  },
  {
    name: "Health Insurance",
    description: "Company-supported health insurance package.",
    category: "health",
    benefitType: "core",
    subsidyPercent: 100,
    financeCheck: false,
    requiresContract: true,
    managerApproval: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
    expiryDuration: 0,
    expiryUnit: "month",
    usagePeriod: 0,
    usagePeriodUnit: "day",
    usageLimit: 0,
    requestDeadline: undefined,
    usageLimitCount: 1,
    usageLimitPeriod: "year",
  },
  {
    name: "Laptop Allowance",
    description: "Allowance for purchasing or upgrading work laptop.",
    category: "equipment",
    benefitType: "core",
    subsidyPercent: 50,
    financeCheck: false,
    requiresContract: false,
    managerApproval: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
    expiryDuration: 0,
    expiryUnit: "month",
    usagePeriod: 0,
    usagePeriodUnit: "day",
    usageLimit: 0,
    requestDeadline: undefined,
    usageLimitCount: 1,
    usageLimitPeriod: "year",
  },
  {
    name: "Learning Budget",
    description: "Annual budget for courses, certifications, and learning.",
    category: "career development",
    benefitType: "core",
    subsidyPercent: 60,
    financeCheck: false,
    requiresContract: false,
    managerApproval: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
    expiryDuration: 0,
    expiryUnit: "month",
    usagePeriod: 0,
    usagePeriodUnit: "day",
    usageLimit: 0,
    requestDeadline: undefined,
    usageLimitCount: 1,
    usageLimitPeriod: "year",
  },
  {
    name: "Flexible Hours",
    description: "Flexible working schedule option based on team policy.",
    category: "flexibility",
    benefitType: "core",
    subsidyPercent: 0,
    financeCheck: false,
    requiresContract: false,
    managerApproval: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
    expiryDuration: 0,
    expiryUnit: "month",
    usagePeriod: 0,
    usagePeriodUnit: "day",
    usageLimit: 0,
    requestDeadline: undefined,
    usageLimitCount: 1,
    usageLimitPeriod: "",
  },
  {
    name: "Mental Health Support",
    description: "Counseling and mental health support benefit.",
    category: "wellness",
    benefitType: "core",
    subsidyPercent: 100,
    financeCheck: false,
    requiresContract: false,
    managerApproval: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
    expiryDuration: 0,
    expiryUnit: "month",
    usagePeriod: 0,
    usagePeriodUnit: "day",
    usageLimit: 0,
    requestDeadline: undefined,
    usageLimitCount: 1,
    usageLimitPeriod: "",
  },
  {
    name: "Home Office Stipend",
    description: "Stipend for home office setup and equipment.",
    category: "equipment",
    benefitType: "core",
    subsidyPercent: 30,
    financeCheck: false,
    requiresContract: false,
    managerApproval: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
    expiryDuration: 0,
    expiryUnit: "month",
    usagePeriod: 0,
    usagePeriodUnit: "day",
    usageLimit: 0,
    requestDeadline: undefined,
    usageLimitCount: 1,
    usageLimitPeriod: "year",
  },
  {
    name: "Transport Allowance",
    description: "Monthly transport reimbursement support.",
    category: "financial",
    benefitType: "core",
    subsidyPercent: 40,
    financeCheck: false,
    requiresContract: false,
    managerApproval: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
    expiryDuration: 0,
    expiryUnit: "month",
    usagePeriod: 0,
    usagePeriodUnit: "day",
    usageLimit: 0,
    requestDeadline: undefined,
    usageLimitCount: 1,
    usageLimitPeriod: "month",
  },
];
