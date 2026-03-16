import type { Ctx } from '../context';
import { requireEmployeeId } from '../context';
import type { QueryResolvers } from '../../generated/graphql';
import { getDb } from '../../../db/drizzle';
import { employeeNotifications } from '../../../db/schema';
import { and, desc, eq } from 'drizzle-orm';

function mapType(input: string): 'ELIGIBILITY_CHANGE' | 'REQUEST_STATUS' | 'WARNING' {
  const t = (input ?? '').toUpperCase();
  if (t === 'REQUEST_STATUS') return 'REQUEST_STATUS';
  if (t === 'WARNING') return 'WARNING';
  return 'ELIGIBILITY_CHANGE';
}

function mapTone(input: string): 'SUCCESS' | 'INFO' | 'WARNING' | 'NEUTRAL' {
  const t = (input ?? '').toUpperCase();
  if (t === 'SUCCESS') return 'SUCCESS';
  if (t === 'WARNING') return 'WARNING';
  if (t === 'NEUTRAL') return 'NEUTRAL';
  return 'INFO';
}

function mapChannel(input: string): 'IN_APP' | 'EMAIL' {
  return (input ?? '').toLowerCase() === 'email' ? 'EMAIL' : 'IN_APP';
}

export const myNotifications: NonNullable<
  QueryResolvers<Ctx>['myNotifications']
> = async (_, args, ctx) => {
  const employeeId = requireEmployeeId(ctx);
  const db = getDb(ctx.env);
  const limit = Math.min(Math.max(args.limit ?? 20, 1), 100);
  const conditions = [
    eq(employeeNotifications.employeeId, employeeId),
    eq(employeeNotifications.channel, 'in_app'),
  ];
  if (args.unreadOnly) {
    conditions.push(eq(employeeNotifications.isRead, 0));
  }

  const rows = await db
    .select({
      id: employeeNotifications.id,
      employeeId: employeeNotifications.employeeId,
      title: employeeNotifications.title,
      body: employeeNotifications.body,
      type: employeeNotifications.type,
      tone: employeeNotifications.tone,
      channel: employeeNotifications.channel,
      isRead: employeeNotifications.isRead,
      createdAt: employeeNotifications.createdAt,
      metadataJson: employeeNotifications.metadataJson,
    })
    .from(employeeNotifications)
    .where(and(...conditions))
    .orderBy(desc(employeeNotifications.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    employeeId: row.employeeId,
    title: row.title,
    body: row.body,
    type: mapType(row.type),
    tone: mapTone(row.tone),
    channel: mapChannel(row.channel),
    isRead: row.isRead === 1,
    createdAt: row.createdAt,
    metadata: row.metadataJson ?? null,
  }));
};
