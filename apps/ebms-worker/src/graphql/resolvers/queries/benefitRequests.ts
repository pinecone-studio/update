import type { Ctx } from '../context';
import { requireHR } from '../context';
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
  requireHR(ctx);
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
      employeeName: employees.name,
      benefitName: benefits.name,
      requiresContract: benefits.requiresContract,
      contractId: contracts.id,
    })
    .from(benefitRequestsTable)
    .leftJoin(employees, eq(benefitRequestsTable.employeeId, employees.id))
    .leftJoin(benefits, eq(benefitRequestsTable.benefitId, benefits.id))
    .leftJoin(contracts, eq(benefits.activeContractId, contracts.id))
    .where(
      statusFilter
        ? eq(benefitRequestsTable.status, statusFilter)
        : sql`1=1`
    )
    .orderBy(sql`${benefitRequestsTable.createdAt} DESC`);

  return rows.map((r) => ({
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
    contractTemplateUrl: asBool01(r.requiresContract) ? `/contracts/requests/${r.id}/template` : null,
  }));
};
