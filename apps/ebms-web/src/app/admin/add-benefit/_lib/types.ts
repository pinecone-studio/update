/** Нэг eligibility дүрмийн талбар */
export type Rule = {
  type: string;
  operator: string;
  value: string | number | boolean;
  errorMessage?: string;
};

/** D1 benefits хүснэгтээс ирсэн benefit */
export type BenefitFromCatalog = {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  subsidyPercent: number;
  requiresContract: boolean;
  /** ISO date — хүсэлт илгээх хугацаа дууссны дараа LOCKED */
  requestDeadline?: string | null;
  /** Хугацаанд хэдэн удаа ашиглах */
  usageLimitCount?: number;
  /** Хугацаа: month | year */
  usageLimitPeriod?: string | null;
};

/** Benefit-ийн хүчинтэй хугацааны нэгж */
export type ExpiryUnit = "day" | "month" | "year";

/** Eligibility config доторх benefit-ийн бүтэц (дүрмүүдтэй) */
export type BenefitConfig = {
  name: string;
  description?: string;
  category: string;
  subsidyPercent?: number;
  financeCheck?: boolean;
  requiresContract?: boolean;
  managerApproval?: boolean;
  contractNumber?: string;
  contractName?: string;
  contractFileName?: string;
  contractUrl?: string;
  expiryDuration?: number;
  expiryUnit?: ExpiryUnit;
  /** Ажилтан хэдэн хугацаанд ашиглах эрхтэй (жишээ: 7 хоног) */
  usagePeriod?: number;
  usagePeriodUnit?: ExpiryUnit;
  /** Тухайн хугацаанд хэдэн удаа ашиглах (жишээ: 1 удаа) */
  usageLimit?: number;
  rules: Rule[];
};

/** Benefit нэмэх form-ийн утга */
export type AddBenefitFormState = {
  name: string;
  description: string;
  category: string;
  benefitType: string;
  subsidyPercent: number;
  financeCheck: boolean;
  requiresContract: boolean;
  managerApproval: boolean;
  contractNumber: string;
  contractName: string;
  contractFileName: string;
  contractUrl: string;
  /** Хүчинтэй хугацаа (тоо) */
  expiryDuration: number;
  /** Хүчинтэй хугацааны нэгж: day, month, year */
  expiryUnit: ExpiryUnit;
  /** Ажилтан хэдэн хугацаанд ашиглах (жишээ: 7 хоног) */
  usagePeriod: number;
  usagePeriodUnit: ExpiryUnit;
  /** Тухайн хугацаанд хэдэн удаа ашиглах (жишээ: 1 удаа) */
  usageLimit: number;
  /** Backend: ISO date — хүсэлт илгээх хугацаа (энэ өдрөөс хойш LOCKED) */
  requestDeadline?: string;
  /** Backend: хугацаанд хэдэн удаа ашиглах */
  usageLimitCount?: number;
  /** Backend: хугацаа — month | year */
  usageLimitPeriod?: "month" | "year" | "";
};
