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
  subsidyPercent: 0,
  financeCheck: false,
  requiresContract: false,
  contractNumber: "",
  contractName: "",
  contractFileName: "",
  contractUrl: "",
};

/** Benefit санал болгох жишээнүүд — Suggest товч дархад field-үүдийг автоматаар бөглөнө */
export const BENEFIT_SUGGESTIONS: AddBenefitFormState[] = [
  {
    name: "Gym Pinefit",
    description: "Gym membership reimbursement for employee wellness.",
    category: "Wellness",
    subsidyPercent: 80,
    financeCheck: false,
    requiresContract: true,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
  },
  {
    name: "Health Insurance",
    description: "Company-supported health insurance package.",
    category: "Health",
    subsidyPercent: 100,
    financeCheck: false,
    requiresContract: true,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
  },
  {
    name: "Laptop Allowance",
    description: "Allowance for purchasing or upgrading work laptop.",
    category: "Equipment",
    subsidyPercent: 50,
    financeCheck: false,
    requiresContract: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
  },
  {
    name: "Learning Budget",
    description: "Annual budget for courses, certifications, and learning.",
    category: "Career Development",
    subsidyPercent: 60,
    financeCheck: false,
    requiresContract: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
  },
  {
    name: "Flexible Hours",
    description: "Flexible working schedule option based on team policy.",
    category: "Flexibility",
    subsidyPercent: 0,
    financeCheck: false,
    requiresContract: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
  },
  {
    name: "Mental Health Support",
    description: "Counseling and mental health support benefit.",
    category: "Wellness",
    subsidyPercent: 100,
    financeCheck: false,
    requiresContract: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
  },
  {
    name: "Home Office Stipend",
    description: "Stipend for home office setup and equipment.",
    category: "Equipment",
    subsidyPercent: 30,
    financeCheck: false,
    requiresContract: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
  },
  {
    name: "Transport Allowance",
    description: "Monthly transport reimbursement support.",
    category: "Financial",
    subsidyPercent: 40,
    financeCheck: false,
    requiresContract: false,
    contractNumber: "",
    contractName: "",
    contractFileName: "",
    contractUrl: "",
  },
];
