import { Hono } from "hono";
import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import {
  benefits as benefitsTable,
  benefitRequests as benefitRequestsTable,
  contracts as contractsTable,
  employeeContracts as employeeContractsTable,
  employees as employeesTable,
} from "../db/schema";
import { and, desc, eq, isNotNull } from "drizzle-orm";

const adminContracts = new Hono<{ Bindings: Env }>();

function toHex(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

adminContracts.get("/", async (c) => {
  const tab = (c.req.query("tab") ?? "employee").toLowerCase();
  const db = getDb(c.env);

  if (tab === "employee") {
    const rows = await db
      .select({
        id: employeeContractsTable.id,
        benefitId: employeeContractsTable.benefitId,
        benefitName: benefitsTable.name,
        vendorName: benefitsTable.vendorName,
        version: employeeContractsTable.version,
        effectiveDate: employeeContractsTable.effectiveDate,
        expiryDate: employeeContractsTable.expiryDate,
        r2ObjectKey: employeeContractsTable.r2ObjectKey,
        createdAt: employeeContractsTable.createdAt,
        updatedAt: employeeContractsTable.updatedAt,
        employeeName: employeesTable.name,
      })
      .from(employeeContractsTable)
      .leftJoin(benefitsTable, eq(employeeContractsTable.benefitId, benefitsTable.id))
      .leftJoin(employeesTable, eq(employeeContractsTable.employeeId, employeesTable.id))
      .orderBy(desc(employeeContractsTable.createdAt));

    return c.json({
      contracts: rows.map((r) => ({
        ...r,
        downloadUrl: `/admin/contracts/employee/${encodeURIComponent(r.id)}/file`,
      })),
    });
  }

  const where = eq(benefitsTable.requiresContract, 1);
  const rows = await db
    .select({
      id: contractsTable.id,
      benefitId: contractsTable.benefitId,
      benefitName: benefitsTable.name,
      vendorName: contractsTable.vendorName,
      version: contractsTable.version,
      effectiveDate: contractsTable.effectiveDate,
      expiryDate: contractsTable.expiryDate,
      isActive: contractsTable.isActive,
      r2ObjectKey: contractsTable.r2ObjectKey,
      createdAt: contractsTable.createdAt,
      updatedAt: contractsTable.updatedAt,
    })
    .from(contractsTable)
    .leftJoin(benefitsTable, eq(contractsTable.benefitId, benefitsTable.id))
    .where(where)
    .orderBy(desc(contractsTable.createdAt));

  return c.json({
    contracts: rows.map((r) => ({
      ...r,
      downloadUrl: `/admin/contracts/${encodeURIComponent(r.id)}/file`,
    })),
  });
});

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

/** Download employee contract PDF by employee_contracts.id */
adminContracts.get("/employee/:contractId/file", async (c) => {
  const contractId = c.req.param("contractId");
  const db = getDb(c.env);
  const rows = await db
    .select({
      id: employeeContractsTable.id,
      r2ObjectKey: employeeContractsTable.r2ObjectKey,
    })
    .from(employeeContractsTable)
    .where(eq(employeeContractsTable.id, contractId))
    .limit(1);
  const row = rows[0];
  if (!row) return c.json({ error: "Employee contract not found" }, 404);

  const object = await c.env.CONTRACTS.get(row.r2ObjectKey);
  if (!object) return c.json({ error: "Employee contract file not found in R2" }, 404);
  const bytes = await object.arrayBuffer();
  const filename = row.r2ObjectKey.split("/").pop() || `${contractId}.pdf`;
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

/**
 * POST /admin/contracts/upload
 *
 * multipart/form-data:
 * - tab (optional): "employee" | "vendor" — defaults to "vendor"
 * - employeeId (optional; for employee only; which employee this contract belongs to)
 * - benefitId (required)
 * - version (required)
 * - vendorName (optional; for vendor only; falls back to benefits.vendor_name)
 * - effectiveDate (optional)
 * - expiryDate (optional)
 * - file (required PDF)
 */
adminContracts.post("/upload", async (c) => {
  const contentType = c.req.header("content-type") ?? "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return c.json({ error: "Expected multipart/form-data" }, 400);
  }

  const body = await c.req.parseBody();
  const tab = String(body["tab"] ?? "vendor").trim().toLowerCase();
  const benefitId = String(body["benefitId"] ?? "").trim();
  const version = String(body["version"] ?? "").trim();
  const effectiveDate = String(body["effectiveDate"] ?? "").trim() || null;
  const expiryDate = String(body["expiryDate"] ?? "").trim() || null;
  const vendorNameFromBody = String(body["vendorName"] ?? "").trim() || null;
  const employeeId = String(body["employeeId"] ?? "").trim() || null;
  const file = body["file"];

  if (!benefitId) return c.json({ error: "benefitId is required" }, 400);
  if (!version) return c.json({ error: "version is required" }, 400);
  if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
    return c.json({ error: "file is required" }, 400);
  }

  const pdf = file as File;
  const pdfBytes = await pdf.arrayBuffer();
  const now = new Date().toISOString();
  const db = getDb(c.env);

  // ——— Employee contract (employee_contracts table) ———
  if (tab === "employee") {
    const benefitRows = await db
      .select({ id: benefitsTable.id })
      .from(benefitsTable)
      .where(eq(benefitsTable.id, benefitId))
      .limit(1);
    if (!benefitRows[0]) return c.json({ error: "Benefit not found" }, 404);

    const contractId = crypto.randomUUID();
    const safeName = (pdf.name || "contract.pdf").replace(/[^a-zA-Z0-9._-]+/g, "_");
    const r2ObjectKey = `contracts/employee-contracts/${benefitId}/${version}/${contractId}-${safeName}`;

    await c.env.CONTRACTS.put(r2ObjectKey, pdfBytes, {
      httpMetadata: { contentType: "application/pdf" },
    });

    await db.insert(employeeContractsTable).values({
      id: contractId,
      employeeId: employeeId || null,
      benefitId,
      version,
      r2ObjectKey,
      effectiveDate,
      expiryDate,
      createdAt: now,
      updatedAt: now,
    });

    return c.json({
      ok: true,
      contract: {
        id: contractId,
        benefitId,
        version,
        r2ObjectKey,
        effectiveDate,
        expiryDate,
        createdAt: now,
      },
    });
  }

  // ——— Vendor contract (contracts table) ———
  const sha256 = await crypto.subtle.digest("SHA-256", pdfBytes);
  const sha256Hex = toHex(sha256);
  const contractId = crypto.randomUUID();
  const safeName = (pdf.name || "contract.pdf").replace(/[^a-zA-Z0-9._-]+/g, "_");
  const r2ObjectKey = `contracts/${benefitId}/${version}/${contractId}-${safeName}`;

  const benefitRows = await db
    .select({
      id: benefitsTable.id,
      vendorName: benefitsTable.vendorName,
    })
    .from(benefitsTable)
    .where(eq(benefitsTable.id, benefitId))
    .limit(1);

  const benefitRow = benefitRows[0];
  if (!benefitRow) return c.json({ error: "Benefit not found" }, 404);

  const vendorName = vendorNameFromBody ?? benefitRow.vendorName ?? null;
  if (!vendorName) {
    return c.json(
      { error: "vendorName is required (either in request or benefit.vendorName)" },
      400,
    );
  }

  await c.env.CONTRACTS.put(r2ObjectKey, pdfBytes, {
    httpMetadata: { contentType: "application/pdf" },
  });

  await db
    .update(contractsTable)
    .set({ isActive: 0, updatedAt: now })
    .where(and(eq(contractsTable.benefitId, benefitId), eq(contractsTable.isActive, 1)));

  await db.insert(contractsTable).values({
    id: contractId,
    benefitId,
    vendorName,
    version,
    r2ObjectKey,
    sha256Hash: sha256Hex,
    effectiveDate,
    expiryDate,
    isActive: 1,
    createdAt: now,
    updatedAt: now,
  });

  await db
    .update(benefitsTable)
    .set({ activeContractId: contractId, updatedAt: now })
    .where(eq(benefitsTable.id, benefitId));

  return c.json({
    ok: true,
    contract: {
      id: contractId,
      benefitId,
      vendorName,
      version,
      sha256Hash: sha256Hex,
      r2ObjectKey,
      effectiveDate,
      expiryDate,
      createdAt: now,
    },
  });
});

export default adminContracts;

