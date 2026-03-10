import { GraphQLError } from 'graphql';
import type { Env } from '../../types';

export type Ctx = {
  env: Env;
  employeeId: string | null;
  role: string | null;
};

export function requireEmployeeId(ctx: Ctx): string {
  if (!ctx.employeeId) {
    throw new GraphQLError('Unauthorized: missing x-employee-id header', {
      extensions: { code: 'UNAUTHORIZED' },
    });
  }
  return ctx.employeeId;
}

