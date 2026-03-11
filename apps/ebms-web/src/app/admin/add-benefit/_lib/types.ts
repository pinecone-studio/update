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
  category: string;
  subsidyPercent: number;
  requiresContract: boolean;
};

/** Eligibility config доторх benefit-ийн бүтэц (дүрмүүдтэй) */
export type BenefitConfig = {
  name: string;
  category: string;
  subsidyPercent?: number;
  requiresContract?: boolean;
  rules: Rule[];
};

/** Benefit нэмэх form-ийн утга */
export type AddBenefitFormState = {
  name: string;
  category: string;
  subsidyPercent: number;
  requiresContract: boolean;
};
