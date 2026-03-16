import { Hono } from "hono";
import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import {
  benefitRequests as benefitRequestsTable,
  contracts as contractsTable,
} from "../db/schema";
import { eq } from "drizzle-orm";

const adminContracts = new Hono<{ Bindings: Env }>();

// Keep only file-serving endpoints used by downloadUrl in GraphQL responses.
adminContracts.get("/employee-requests/:requestId/file", async (c) => {
  const requestId = c.req.param("requestId");
  const db = getDb(c.env);
  const rows = await db
    .select({
      id: benefitRequestsTable.id,
      r2ObjectKey: benefitRequestsTable.employeeContractR2Key,
    })
    .from(benefitRequestsTable)
    .where(eq(benefitRequestsTable.id, requestId))
    .limit(1);
  const row = rows[0];
  if (!row || !row.r2ObjectKey) {
    return c.json({ error: "Employee contract file not found" }, 404);
  }

  const object = await c.env.CONTRACTS.get(row.r2ObjectKey);
  if (!object) return c.json({ error: "Employee contract file missing in R2" }, 404);
  const bytes = await object.arrayBuffer();
  const filename = row.r2ObjectKey.split("/").pop() || `${requestId}.pdf`;
  return c.body(bytes, 200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="${filename}"`,
  });
});

adminContracts.get("/:contractId/file", async (c) => {
  const contractId = c.req.param("contractId");
  const db = getDb(c.env);
  const rows = await db
    .select({
      id: contractsTable.id,
      r2ObjectKey: contractsTable.r2ObjectKey,
    })
    .from(contractsTable)
    .where(eq(contractsTable.id, contractId))
    .limit(1);
  const row = rows[0];
  if (!row) return c.json({ error: "Contract not found" }, 404);

  const object = await c.env.CONTRACTS.get(row.r2ObjectKey);
  if (!object) return c.json({ error: "Contract file not found in R2" }, 404);

  const bytes = await object.arrayBuffer();
  const filename = row.r2ObjectKey.split("/").pop() || `${contractId}.pdf`;
  return c.body(bytes, 200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="${filename}"`,
  });
});

export default adminContracts;
