import type { Ctx } from "../context";
import { requireEmployeeId } from "../context";
import type { QueryResolvers } from "../../generated/graphql";
import { getDb } from "../../../db/drizzle";
import { asBool01 } from "../utils";
import { getActiveEligibilityConfig } from "../../../eligibility/engine";
import {
  benefitRequests as benefitRequestsTable,
  employees,
  benefits,
  contracts,
} from "../../../db/schema";
import { eq, sql } from "drizzle-orm";

const statusMap: Record<string, string> = {
  PENDING: "pending",
  ADMIN_APPROVED: "admin_approved",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

function isFinanceRole(role: string | null | undefined): boolean {
  const normalized = (role ?? "").toLowerCase();
  return normalized.includes("finance");
}

export const benefitRequests: NonNullable<
  QueryResolvers<Ctx>["benefitRequests"]
> = async (_, args, ctx) => {
  const actorId = requireEmployeeId(ctx);
  const role = (ctx.role ?? "").toLowerCase();
  const isHrOrAdmin = role === "hr" || role === "admin";
  const isFinance = isFinanceRole(role);
  const db = getDb(ctx.env);
  const config = await getActiveEligibilityConfig(ctx.env);

  const statusFilter = args.status
    ? (statusMap[args.status] ?? args.status.toLowerCase())
    : undefined;

  const rows = await db
    .select({
      id: benefitRequestsTable.id,
      employeeId: benefitRequestsTable.employeeId,
      benefitId: benefitRequestsTable.benefitId,
      status: benefitRequestsTable.status,
      createdAt: benefitRequestsTable.createdAt,
      contractVersionAccepted: benefitRequestsTable.contractVersionAccepted,
      contractAcceptedAt: benefitRequestsTable.contractAcceptedAt,
      rejectReason: benefitRequestsTable.rejectReason,
      employeeContractR2Key: benefitRequestsTable.employeeContractR2Key,
      employeeName: employees.name,
      benefitName: benefits.name,
      requiresContract: benefits.requiresContract,
      contractId: contracts.id,
    })
    .from(benefitRequestsTable)
    .leftJoin(employees, eq(benefitRequestsTable.employeeId, employees.id))
    .leftJoin(benefits, eq(benefitRequestsTable.benefitId, benefits.id))
    .leftJoin(contracts, eq(benefits.activeContractId, contracts.id))
    .where(sql`1=1`)
    .orderBy(sql`${benefitRequestsTable.createdAt} DESC`);

  return rows
    .filter((r) => {
      const rowStatus = (r.status ?? "").toLowerCase();
      if (isHrOrAdmin) {
        const needsFinanceApproval = Boolean(
          config?.[r.benefitId]?.financeCheck,
        );
        if (needsFinanceApproval) {
          if (rowStatus === "admin_approved") return false;
          if (rowStatus === "pending") return !statusFilter || statusFilter === "pending";
          return false;
        }
        if (!statusFilter) return true;
        return rowStatus === statusFilter;
      }
      if (isFinance) {
        const needsFinanceApproval = Boolean(
          config?.[r.benefitId]?.financeCheck,
        );
        if (!needsFinanceApproval) return false;
        if (!statusFilter) return true;
        return (r.status ?? '').toLowerCase() === statusFilter;
      }
      if (r.employeeId !== actorId) return false;
      if (!statusFilter) return true;
      return rowStatus === statusFilter;
    })
    .map((r) => ({
      id: r.id,
      employeeId: r.employeeId,
      benefitId: r.benefitId,
      status: (r.status === "admin_approved"
        ? "ADMIN_APPROVED"
        : r.status?.toUpperCase() ?? "PENDING") as
        | "PENDING"
        | "ADMIN_APPROVED"
        | "APPROVED"
        | "REJECTED"
        | "CANCELLED",
      createdAt: r.createdAt ?? "",
      employeeName: r.employeeName ?? null,
      benefitName: r.benefitName ?? null,
      rejectReason: r.rejectReason ?? null,
      contractVersionAccepted: r.contractVersionAccepted ?? null,
      contractAcceptedAt: r.contractAcceptedAt ?? null,
      requiresContract: asBool01(r.requiresContract),
      contractId: r.contractId ?? null,
      // Reused as downloadable employee-signed contract URL when uploaded.
      contractTemplateUrl: r.employeeContractR2Key
        ? `/admin/contracts/employee-requests/${encodeURIComponent(r.id)}/file`
        : null,
    }));
};
