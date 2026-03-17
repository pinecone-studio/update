import type { Ctx } from '../context';
import { GraphQLError } from 'graphql';
import { asBool01, mapEmploymentStatus } from '../utils';
import type { QueryResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { employees as employeesTable } from '../../../db/schema';
import { and, eq, sql } from 'drizzle-orm';

export const employees: NonNullable<QueryResolvers<Ctx>['employees']> = async (
  _,
  args,
  ctx
) => {
  const role = (ctx.role ?? '').toLowerCase();
  const isHrOrAdmin = role === 'hr' || role === 'admin';
  const isFinance = role.includes('finance');
  if (!isHrOrAdmin && !isFinance) {
    throw new GraphQLError('Forbidden: HR/admin or finance role required', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
  const db = getDb(ctx.env);

  const conditions = [];
  if (args.department) {
    conditions.push(eq(employeesTable.department, args.department));
  }
  if (args.employmentStatus) {
    conditions.push(eq(employeesTable.employmentStatus, args.employmentStatus));
  }

  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: employeesTable.id,
      name: employeesTable.name,
      role: employeesTable.role,
      responsibilityLevel: employeesTable.responsibilityLevel,
      employmentStatus: employeesTable.employmentStatus,
      okrSubmitted: employeesTable.okrSubmitted,
      lateArrivalCount: employeesTable.lateArrivalCount,
    })
    .from(employeesTable)
    .where(whereClause ?? sql`1=1`)
    .orderBy(employeesTable.name, employeesTable.id);

  return rows.map((row) => ({
    id: row.id,
    name: row.name ?? '',
    role: row.role,
    responsibilityLevel: row.responsibilityLevel ?? 1,
    employmentStatus: mapEmploymentStatus(row.employmentStatus ?? 'probation'),
    okrSubmitted: asBool01(row.okrSubmitted),
    lateArrivalCount: row.lateArrivalCount ?? 0,
    benefits: [],
  }));
};
