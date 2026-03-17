import type { Ctx } from '../context';
import { requireEmployeeId } from '../context';
import type { QueryResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { asBool01 } from '../utils';
import {
  benefitRequests as benefitRequestsTable,
  employees,
  benefits,
  contracts,
} from '../../../db/schema';
import { eq, sql } from 'drizzle-orm';

const statusMap: Record<string, string> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const benefitRequests: NonNullable<
  QueryResolvers<Ctx>['benefitRequests']
> = async (_, args, ctx) => {
  const actorId = requireEmployeeId(ctx);
  const role = (ctx.role ?? '').toLowerCase();
  const isHrOrAdminOrFinance = role === 'hr' || role === 'admin' || role === 'finance-manager';
  const db = getDb(ctx.env);

  const statusFilter = args.status
    ? statusMap[args.status] ?? args.status.toLowerCase()
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
      if (isHrOrAdminOrFinance) {
        if (!statusFilter) return true;
        return (r.status ?? '').toLowerCase() === statusFilter;
      }
      if (r.employeeId !== actorId) return false;
      if (!statusFilter) return true;
      return (r.status ?? '').toLowerCase() === statusFilter;
    })
    .map((r) => ({
    id: r.id,
    employeeId: r.employeeId,
    benefitId: r.benefitId,
    status: (r.status?.toUpperCase() ?? 'PENDING') as
      | 'PENDING'
      | 'APPROVED'
      | 'REJECTED'
      | 'CANCELLED',
    createdAt: r.createdAt ?? '',
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
