import type { Ctx } from "../context";
import { requireHR } from "../context";
import type { QueryResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import {
  benefits as benefitsTable,
  benefitRequests as benefitRequestsTable,
  contracts as contractsTable,
  employees as employeesTable,
} from "../../../db/schema";
import { desc, eq, isNotNull } from "drizzle-orm";
import { asBool01 } from "../utils";

export const adminContracts: NonNullable<
  QueryResolvers<Ctx>["adminContracts"]
> = async (_, args, ctx) => {
  requireHR(ctx);
  const tab = (args.tab ?? "employee").toLowerCase();
  const db = getDb(ctx.env);

  if (tab === "employee") {
    const rows = await db
      .select({
        id: benefitRequestsTable.id,
        benefitId: benefitRequestsTable.benefitId,
        benefitName: benefitsTable.name,
        vendorName: benefitsTable.vendorName,
        version: benefitRequestsTable.contractVersionAccepted,
        effectiveDate: contractsTable.effectiveDate,
        expiryDate: contractsTable.expiryDate,
        isActive: contractsTable.isActive,
        r2ObjectKey: benefitRequestsTable.employeeContractR2Key,
        createdAt: benefitRequestsTable.employeeContractUploadedAt,
        updatedAt: benefitRequestsTable.updatedAt,
        employeeName: employeesTable.name,
      })
      .from(benefitRequestsTable)
      .leftJoin(
        benefitsTable,
        eq(benefitRequestsTable.benefitId, benefitsTable.id),
      )
      .leftJoin(
        contractsTable,
        eq(benefitsTable.activeContractId, contractsTable.id),
      )
      .leftJoin(
        employeesTable,
        eq(benefitRequestsTable.employeeId, employeesTable.id),
      )
      .where(isNotNull(benefitRequestsTable.employeeContractR2Key))
      .orderBy(desc(benefitRequestsTable.employeeContractUploadedAt));

    return rows.map((r) => ({
      id: r.id,
      benefitId: r.benefitId,
      benefitName: r.benefitName ?? null,
      vendorName: r.vendorName ?? null,
      version: r.version ?? null,
      effectiveDate: r.effectiveDate ?? null,
      expiryDate: r.expiryDate ?? null,
      isActive: asBool01(r.isActive),
      r2ObjectKey: r.r2ObjectKey ?? null,
      createdAt: r.createdAt ?? null,
      updatedAt: r.updatedAt ?? null,
      employeeName: r.employeeName ?? null,
      downloadUrl: `/admin/contracts/employee-requests/${encodeURIComponent(r.id)}/file`,
    }));
  }

  const rows = await db
    .select({
      id: contractsTable.id,
      benefitId: contractsTable.benefitId,
      benefitName: benefitsTable.name,
      vendorName: contractsTable.vendorName,
      version: contractsTable.version,
      effectiveDate: contractsTable.effectiveDate,
      expiryDate: contractsTable.expiryDate,
      isActive: contractsTable.isActive,
      r2ObjectKey: contractsTable.r2ObjectKey,
      createdAt: contractsTable.createdAt,
      updatedAt: contractsTable.updatedAt,
    })
    .from(contractsTable)
    .leftJoin(benefitsTable, eq(contractsTable.benefitId, benefitsTable.id))
    .where(eq(benefitsTable.requiresContract, 1))
    .orderBy(desc(contractsTable.createdAt));

  return rows.map((r) => ({
    id: r.id,
    benefitId: r.benefitId,
    benefitName: r.benefitName ?? null,
    vendorName: r.vendorName ?? null,
    version: r.version ?? null,
    effectiveDate: r.effectiveDate ?? null,
    expiryDate: r.expiryDate ?? null,
    isActive: asBool01(r.isActive),
    r2ObjectKey: r.r2ObjectKey ?? null,
    createdAt: r.createdAt ?? null,
    updatedAt: r.updatedAt ?? null,
    employeeName: null,
    downloadUrl: `/admin/contracts/${encodeURIComponent(r.id)}/file`,
  }));
};
