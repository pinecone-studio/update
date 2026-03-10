import { benefitEligibility, benefits, employees } from "../db/schema";
import { eq } from "drizzle-orm";

const resolvers = {
  Benefit: {
    requiresContract: (parent: any) => Boolean(parent?.requiresContract),
    isActive: (parent: any) => Boolean(parent?.isActive),
  },
  Query: {
    getEmployeeById: async (_: any, args: { id: string }, ctx: any) => {
      const db = ctx.db;
      try {
        const employee = await db
          .select()
          .from(employees)
          .where(eq(employees.id, args.id));
        return employee[0];
      } catch (err) {
        console.error("Failed to get data. Error:", err);
        return null;
      }
    },
    myBenefits: async (_: any, args: { employeeId: string }, ctx: any) => {
      const db = ctx.db;
      try {
        const employeeBenefits = await db
          .select()
          .from(benefitEligibility)
          .where(eq(benefitEligibility.employeeId, args.employeeId));
        return employeeBenefits;
      } catch (err) {
        console.error("Failed to get data. Error:", err);
        return [];
      }
    },
    getBenefitsByCategory: async (
      _: any,
      args: { category: string },
      ctx: any,
    ) => {
      const db = ctx.db;
      try {
        const benefitsByCategory = await db
          .select()
          .from(benefits)
          .where(eq(benefits.category, args.category));
        return benefitsByCategory;
      } catch (err) {
        console.error("Failed to get data. Error:", err);
        return [];
      }
    },
    getAllEmployees: async (_: any, args: {}, ctx: any) => {
      const db = ctx.db;
      try {
        const allEmployees = await db.select().from(employees);
        return allEmployees;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
};
export default resolvers;
