import type { Ctx } from "../context";
import { requireEmployeeId } from "../context";
import type { QueryResolvers } from "../../generated/graphql";
import { getBenefitEligibilityForEmployee } from "../getBenefitEligibility";

export const myBenefits: NonNullable<
  QueryResolvers<Ctx>["myBenefits"]
> = async (_, __, ctx) => {
  const employeeId = requireEmployeeId(ctx);
  return getBenefitEligibilityForEmployee(ctx.env, employeeId);
};
