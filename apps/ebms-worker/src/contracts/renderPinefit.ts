import { pinefitTemplate } from "./templates/pinefitTemplate";

export type PinefitTemplateData = {
  requestId: string;
  requestEmployeeId: string;
  contractAcceptedAt: string | null;
  requestCreatedAt: string | null;
  benefitName: string | null;
  benefitVendorName: string | null;
  benefitRequiresContract: number | null;
  contractId: string | null;
  contractVersion: string | null;
  contractEffectiveDate: string | null;
  contractExpiryDate: string | null;
  contractCreatedAt: string | null;
  employeeName: string | null;
  employeeCode: string | null;
};

type ContractTemplateContext = {
  contractNumber: string;
  contractDate: string;
  contractLocation: string;
  companyName: string;
  clientName: string;
  serviceName: string;
  serviceDescription: string;
  effectiveDate: string;
  expiryDate: string;
  amount: string;
  paymentTerms: string;
  providerSigner: string;
  providerRole: string;
  providerSignatureDate: string;
  clientSigner: string;
  clientId: string;
  signatureDate: string;
  providerRegister: string;
  providerAddress: string;
  clientAddress: string;
  authorityBasis: string;
  providerBankInfo: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderPinefitTemplate(ctx: ContractTemplateContext): string {
  return pinefitTemplate.replace(
    /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
    (_, key: string) => {
      const raw = ctx[key as keyof ContractTemplateContext];
      const value = raw == null ? "" : String(raw);
      return escapeHtml(value);
    },
  );
}

function toDateOnly(value?: string | null): string {
  if (!value) return "";
  return value.split("T")[0] ?? value;
}

export function toBool01(v: unknown): boolean {
  return v === 1 || v === true || v === "1";
}

export function renderPinefitContractHtml(row: PinefitTemplateData): string {
  const templateContext: ContractTemplateContext = {
    contractNumber: row.contractId ?? row.requestId,
    contractDate: toDateOnly(row.contractCreatedAt ?? row.requestCreatedAt),
    contractLocation: "Улаанбаатар",
    companyName: row.benefitVendorName ?? "Pinefit",
    clientName: row.employeeName ?? row.requestEmployeeId,
    serviceName: row.benefitName ?? "Pinefit үйлчилгээ",
    serviceDescription: `${row.benefitName ?? "Pinefit"} хөтөлбөрт хамрагдах үйлчилгээ`,
    effectiveDate: toDateOnly(row.contractEffectiveDate),
    expiryDate: toDateOnly(row.contractExpiryDate),
    amount: "Тохиролцоно",
    paymentTerms: "Байгууллагын дотоод бодлогын дагуу",
    providerSigner: row.benefitVendorName ?? "Pinefit төлөөлөгч",
    providerRole: "Гэрээ хариуцсан менежер",
    providerSignatureDate: toDateOnly(
      row.contractCreatedAt ?? row.requestCreatedAt,
    ),
    clientSigner: row.employeeName ?? row.requestEmployeeId,
    clientId: row.employeeCode ?? row.requestEmployeeId,
    signatureDate: toDateOnly(
      row.contractAcceptedAt ?? new Date().toISOString(),
    ),
    providerRegister: "Регистр оруулна",
    providerAddress: "Хаяг оруулна",
    clientAddress: "Хаяг оруулна",
    authorityBasis: "Эрхийн баримт бичгийн дагуу",
    providerBankInfo: "Банкны мэдээлэл оруулна",
  };

  return renderPinefitTemplate(templateContext);
}
