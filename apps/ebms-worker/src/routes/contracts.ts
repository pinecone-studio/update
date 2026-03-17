import { Hono } from "hono";
import { eq } from "drizzle-orm";
import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import { benefitRequests, benefits, contracts, employees } from "../db/schema";
import {
  renderPinefitContractHtml,
  toBool01,
} from "../contracts/renderPinefit";

const contractsRoute = new Hono<{ Bindings: Env }>();

// Legacy HTML endpoint kept for existing contractTemplateUrl links.
contractsRoute.get("/requests/:requestId/template", async (c) => {
  const requestId = c.req.param("requestId");
  const actorEmployeeId = c.req.header("x-employee-id");
  const actorRole = (c.req.header("x-role") ?? "").toLowerCase();
  const isHrOrAdmin = actorRole === "hr" || actorRole === "admin";

  if (!actorEmployeeId) {
    return c.json({ error: "Unauthorized: missing x-employee-id header" }, 401);
  }

  const db = getDb(c.env);
  const rows = await db
    .select({
      requestId: benefitRequests.id,
      requestEmployeeId: benefitRequests.employeeId,
      contractAcceptedAt: benefitRequests.contractAcceptedAt,
      requestCreatedAt: benefitRequests.createdAt,
      benefitName: benefits.name,
      benefitVendorName: benefits.vendorName,
      benefitRequiresContract: benefits.requiresContract,
      contractId: contracts.id,
      contractVersion: contracts.version,
      contractEffectiveDate: contracts.effectiveDate,
      contractExpiryDate: contracts.expiryDate,
      contractCreatedAt: contracts.createdAt,
      employeeName: employees.name,
      employeeCode: employees.employeeCode,
    })
    .from(benefitRequests)
    .leftJoin(benefits, eq(benefitRequests.benefitId, benefits.id))
    .leftJoin(contracts, eq(benefits.activeContractId, contracts.id))
    .leftJoin(employees, eq(benefitRequests.employeeId, employees.id))
    .where(eq(benefitRequests.id, requestId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return c.json({ error: "Benefit request not found" }, 404);
  }

  if (!isHrOrAdmin && row.requestEmployeeId !== actorEmployeeId) {
    return c.json(
      { error: "Forbidden: request does not belong to employee" },
      403,
    );
  }

  const requiresContract = toBool01(row.benefitRequiresContract);
  if (requiresContract && !row.contractId) {
    return c.json(
      { error: "Active contract is not configured for this benefit" },
      409,
    );
  }

  const html = renderPinefitContractHtml(row);
  return c.html(html);
});

export default contractsRoute;
