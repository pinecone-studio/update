import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { PDFDocument, PDFFont, StandardFonts } from "pdf-lib";
import type { Env } from "../types";
import { getDb } from "../db/drizzle";
import {
  benefitRequests,
  benefits,
  contracts,
  employees,
} from "../db/schema";
import { renderPinefitContractHtml, toBool01 } from "../contracts/renderPinefit";

const contractsRoute = new Hono<{ Bindings: Env }>();

function htmlToText(html: string): string {
  const withBreaks = html
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|tr|section|article)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");
  const noTags = withBreaks.replace(/<[^>]*>/g, "");
  return noTags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function sanitizeForWinAnsi(value: string): string {
  // pdf-lib standard Helvetica uses WinAnsi; replace unsupported Unicode chars.
  return value.replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
}

function wrapLine(line: string, maxWidth: number, size: number, font: PDFFont): string[] {
  const safeLine = sanitizeForWinAnsi(line);
  const words = safeLine.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const rows: string[] = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const next = `${current} ${words[i]}`;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      rows.push(current);
      current = words[i];
    }
  }
  rows.push(current);
  return rows;
}

async function renderPdfFromHtml(html: string): Promise<Uint8Array> {
  const text = htmlToText(html);
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pageSize: [number, number] = [595.28, 841.89]; // A4
  const margin = 40;
  const fontSize = 10;
  const lineHeight = 14;
  const maxWidth = pageSize[0] - margin * 2;

  let page = pdfDoc.addPage(pageSize);
  let y = page.getHeight() - margin;
  const sourceLines = text ? text.split("\n") : ["Contract content unavailable."];

  for (const rawLine of sourceLines) {
    const rows = wrapLine(rawLine, maxWidth, fontSize, font);
    for (const row of rows) {
      if (y <= margin) {
        page = pdfDoc.addPage(pageSize);
        y = page.getHeight() - margin;
      }
      page.drawText(row, { x: margin, y, size: fontSize, font });
      y -= lineHeight;
    }
    y -= 2;
  }

  return await pdfDoc.save();
}

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
    return c.json({ error: "Forbidden: request does not belong to employee" }, 403);
  }

  const requiresContract = toBool01(row.benefitRequiresContract);
  if (requiresContract && !row.contractId) {
    return c.json({ error: "Active contract is not configured for this benefit" }, 409);
  }

  const html = renderPinefitContractHtml(row);
  return c.html(html);
});

contractsRoute.get("/benefits/:benefitId/template-preview", async (c) => {
  const benefitId = c.req.param("benefitId");
  const actorEmployeeId =
    c.req.header("x-employee-id") ?? c.req.query("employeeId") ?? null;

  if (!actorEmployeeId) {
    return c.json({ error: "Unauthorized: missing employee identity" }, 401);
  }

  const db = getDb(c.env);
  const rows = await db
    .select({
      requestId: benefits.id,
      requestEmployeeId: employees.id,
      contractAcceptedAt: benefitRequests.contractAcceptedAt,
      requestCreatedAt: benefits.createdAt,
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
    .from(benefits)
    .leftJoin(contracts, eq(benefits.activeContractId, contracts.id))
    .leftJoin(employees, eq(employees.id, actorEmployeeId))
    .leftJoin(
      benefitRequests,
      and(eq(benefitRequests.benefitId, benefits.id), eq(benefitRequests.employeeId, actorEmployeeId)),
    )
    .where(eq(benefits.id, benefitId))
    .limit(1);

  const row = rows[0];
  if (!row) return c.json({ error: "Benefit not found" }, 404);
  if (!row.requestEmployeeId) return c.json({ error: "Employee not found" }, 404);
  if (toBool01(row.benefitRequiresContract) && !row.contractId) {
    return c.json({ error: "Active contract is not configured for this benefit" }, 409);
  }

  const previewHtml = renderPinefitContractHtml({
    ...row,
    requestEmployeeId: row.requestEmployeeId,
    requestId: `preview-${benefitId}-${actorEmployeeId}`,
    requestCreatedAt: new Date().toISOString(),
    contractAcceptedAt: null,
  });
  return c.html(previewHtml);
});

contractsRoute.post("/requests/:requestId/archive-pdf", async (c) => {
  const requestId = c.req.param("requestId");
  const actorEmployeeId = c.req.header("x-employee-id");
  if (!actorEmployeeId) {
    return c.json({ error: "Unauthorized: missing x-employee-id header" }, 401);
  }

  const payload =
    (await c.req.json<{ html?: string }>().catch(
      () => null,
    )) satisfies { html?: string } | null;
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
  if (!row) return c.json({ error: "Benefit request not found" }, 404);
  if (row.requestEmployeeId !== actorEmployeeId) {
    return c.json({ error: "Forbidden: request does not belong to employee" }, 403);
  }
  if (!toBool01(row.benefitRequiresContract)) {
    return c.json({ error: "This benefit does not require contract archive" }, 400);
  }

  const html =
    payload?.html && payload.html.trim().length > 0
      ? payload.html
      : renderPinefitContractHtml(row);
  const pdfBytes = await renderPdfFromHtml(html);
  const uploadedAt = new Date().toISOString();
  const objectKey = `contracts/requests/${requestId}/employee-${Date.now()}.pdf`;

  await c.env.CONTRACTS.put(objectKey, pdfBytes, {
    httpMetadata: { contentType: "application/pdf" },
  });

  await db
    .update(benefitRequests)
    .set({
      employeeContractR2Key: objectKey,
      employeeContractUploadedAt: uploadedAt,
      updatedAt: uploadedAt,
    })
    .where(eq(benefitRequests.id, requestId));

  return c.json({ ok: true, requestId, objectKey, uploadedAt });
});

export default contractsRoute;
