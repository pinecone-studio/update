import { GraphQLError } from 'graphql';
import type { Env } from '../../types';

export type Ctx = {
  env: Env;
  employeeId: string | null;
  role: string | null;
};

function isRoleCheckDisabled(ctx: Ctx): boolean {
  const raw = String(ctx.env.DISABLE_ROLE_CHECKS ?? '').toLowerCase().trim();
  return raw === '1' || raw === 'true' || raw === 'yes' || raw === 'on';
}

export function requireEmployeeId(ctx: Ctx): string {
  if (!ctx.employeeId) {
    throw new GraphQLError('Unauthorized: missing x-employee-id header', {
      extensions: { code: 'UNAUTHORIZED' },
    });
  }
  return ctx.employeeId;
}

export function requireHR(ctx: Ctx): void {
  if (isRoleCheckDisabled(ctx)) return;
  const role = (ctx.role ?? '').toLowerCase();
  if (role !== 'hr' && role !== 'admin') {
    throw new GraphQLError('Forbidden: HR or admin role required', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}

/** Benefit нэмэх зэрэг үйлдлүүд — зөвхөн admin. */
export function requireAdmin(ctx: Ctx): void {
  if (isRoleCheckDisabled(ctx)) return;
  const role = (ctx.role ?? '').toLowerCase();
  if (role !== 'admin') {
    throw new GraphQLError('Forbidden: admin role required', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}

