import type { Ctx } from '../context';
import type { EmployeeResolvers } from '../../generated/graphql';
import { getBenefitEligibilityForEmployee } from '../getBenefitEligibility';

export const Employee: EmployeeResolvers<Ctx> = {
  benefits: (parent, _, ctx) => getBenefitEligibilityForEmployee(ctx.env, parent.id),
};
