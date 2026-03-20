/**
 * Demo утгууд — Fill Demo товч дархад эдгээр утгуудыг ашиглана.
 * Засварлахад хялбар болгох зорилгоор энд нэгтгэсэн.
 */
export const VENDOR_CONTRACT_DEMO = {
  version: "vendor-2026.1",
  vendorName: "PineFit",
  /** Effective date: 0 = өнөөдөр, эерэг = ирээдүйд */
  effectiveDateOffsetDays: 0,
  /** Expiry date: хэдэн жилийн дараа (1 = 1 жил) */
  expiryDateOffsetYears: 1,
} as const;

export function getDemoEffectiveDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + VENDOR_CONTRACT_DEMO.effectiveDateOffsetDays);
  return d.toISOString().split("T")[0];
}

export function getDemoExpiryDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + VENDOR_CONTRACT_DEMO.expiryDateOffsetYears);
  return d.toISOString().split("T")[0];
}
