import { Hono } from "hono";
import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import { benefits as benefitsTable, contracts as contractsTable } from "../db/schema";
import { and, eq } from "drizzle-orm";

const adminContracts = new Hono<{ Bindings: Env }>();

function toHex(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * POST /admin/contracts/upload
 *
 * multipart/form-data:
 * - benefitId (required)
 * - version (required)
 * - vendorName (optional; falls back to benefits.vendor_name)
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
  const benefitId = String(body["benefitId"] ?? "").trim();
  const version = String(body["version"] ?? "").trim();
  const effectiveDate = String(body["effectiveDate"] ?? "").trim() || null;
  const expiryDate = String(body["expiryDate"] ?? "").trim() || null;
  const vendorNameFromBody = String(body["vendorName"] ?? "").trim() || null;
  const file = body["file"];

  if (!benefitId) return c.json({ error: "benefitId is required" }, 400);
  if (!version) return c.json({ error: "version is required" }, 400);
  if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
    return c.json({ error: "file is required" }, 400);
  }

  const pdf = file as File;
  const pdfBytes = await pdf.arrayBuffer();
  const sha256 = await crypto.subtle.digest("SHA-256", pdfBytes);
  const sha256Hex = toHex(sha256);

  const now = new Date().toISOString();
  const contractId = crypto.randomUUID();
  const safeName = (pdf.name || "contract.pdf").replace(/[^a-zA-Z0-9._-]+/g, "_");
  const r2ObjectKey = `contracts/${benefitId}/${version}/${contractId}-${safeName}`;

  // Ensure benefit exists and (optionally) infer vendor name.
  const db = getDb(c.env);
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

  // Store PDF in R2 first.
  await c.env.CONTRACTS.put(r2ObjectKey, pdfBytes, {
    httpMetadata: { contentType: "application/pdf" },
  });

  // Ensure only one active contract per benefit.
  await db
    .update(contractsTable)
    .set({ isActive: 0, updatedAt: now })
    .where(and(eq(contractsTable.benefitId, benefitId), eq(contractsTable.isActive, 1)));

  // Write contract metadata to D1 and set it as active.
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

