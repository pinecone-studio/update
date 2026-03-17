import { getApiBaseUrl } from "../../_lib/api";
import type { Contract, ContractApiRow } from "../types";

export function mapRowsToContracts(items: ContractApiRow[]): Contract[] {
  const nowMs = Date.now();
  const base = getApiBaseUrl();
  return items.map((item) => {
    const endDate = item.expiryDate || "—";
    const msToEnd = item.expiryDate
      ? new Date(item.expiryDate).getTime() - nowMs
      : Number.POSITIVE_INFINITY;
    const isExpiringSoon = msToEnd > 0 && msToEnd < 1000 * 60 * 60 * 24 * 90;
    return {
      id: item.id,
      contractNumber: item.version || item.id,
      contractName: `${item.benefitName ?? item.benefitId} - ${item.vendorName ?? "Contract"}`,
      startDate: item.effectiveDate || "—",
      endDate,
      contractUrl: `${base}${item.downloadUrl}`,
      status: isExpiringSoon ? "Expiring soon" : "Active",
    };
  });
}
