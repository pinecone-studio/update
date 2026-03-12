/** Дүрмийн operator-ууд (харьцуулалт) */
export const OPERATORS = [
  { value: 'eq', label: 'Тэнцүү (eq)' },
  { value: 'lt', label: 'Бага (lt)' },
  { value: 'lte', label: 'Бага буюу тэнцүү (lte)' },
  { value: 'gte', label: 'Их буюу тэнцүү (gte)' },
  { value: 'gt', label: 'Их (gt)' },
] as const;

/** Алдааны мессежүүд (нэг дор, тодорхой) */
export const ERROR_MESSAGES = {
  NAME_REQUIRED: 'Нэр заавал бөглөнө үү.',
  CATEGORY_REQUIRED: 'Ангилал заавал бөглөнө үү.',
  SUBSIDY_RANGE: 'Хөнгөлөлтийн хувь 0–100 хооронд байх ёстой.',
  SELECT_BENEFIT: 'Дүрэм тохируулах benefit-ийг сонгоно уу.',
  RULE_VALUE_REQUIRED: 'Дүрмийн утга бөглөнө үү.',
  D1_CREATE: 'D1 руу benefit нэмэхэд алдаа гарлаа: ',
  CONFIG_LOAD: 'Дүрмийн config унших үед алдаа: ',
  CONFIG_SAVE: 'Дүрэм хадгалах үед алдаа: ',
  BENEFITS_LOAD: 'D1-ээс benefit жагсаалт татах үед алдаа: ',
} as const;

import type { AddBenefitFormState } from './types';

export const DEFAULT_FORM: AddBenefitFormState = {
  name: '',
  category: 'wellness',
  subsidyPercent: 0,
  requiresContract: false,
};

/** Benefit санал болгох жишээнүүд — Suggest товч дархад field-үүдийг автоматаар бөглөнө */
export const BENEFIT_SUGGESTIONS: AddBenefitFormState[] = [
  { name: 'Gym Pinefit', category: 'Wellness', subsidyPercent: 80, requiresContract: true },
  { name: 'Health Insurance', category: 'Health', subsidyPercent: 100, requiresContract: true },
  { name: 'Laptop Allowance', category: 'Equipment', subsidyPercent: 50, requiresContract: false },
  { name: 'Learning Budget', category: 'Career Development', subsidyPercent: 60, requiresContract: false },
  { name: 'Flexible Hours', category: 'Flexibility', subsidyPercent: 0, requiresContract: false },
  { name: 'Mental Health Support', category: 'Wellness', subsidyPercent: 100, requiresContract: false },
  { name: 'Home Office Stipend', category: 'Equipment', subsidyPercent: 30, requiresContract: false },
  { name: 'Transport Allowance', category: 'Financial', subsidyPercent: 40, requiresContract: false },
];
