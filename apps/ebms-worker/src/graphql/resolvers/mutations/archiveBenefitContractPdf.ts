import { GraphQLError } from "graphql";
import { eq } from "drizzle-orm";
import { PDFDocument, type PDFFont, StandardFonts } from "pdf-lib";
import type { MutationResolvers } from "../../generated/graphql";
import type { Ctx } from "../context";
import { requireEmployeeId } from "../context";
import { getDb } from "../../../db/drizzle";
import {
  benefitEligibility,
  benefitRequests,
  benefits,
  contracts,
  eligibilityAudit,
  employees,
} from "../../../db/schema";
import {
  renderPinefitContractHtml,
  toBool01,
} from "../../../contracts/renderPinefit";
import { dispatchEmployeeNotification } from "../../../notifications/dispatcher";
import { dispatchRoleNotification } from "../../../notifications/roleDispatcher";
import { and } from "drizzle-orm";
import { requireHROrAdminOrFinance } from "../context";

function decodeBase64Pdf(input: string): Uint8Array {
  const b64 = input.trim();
  const bytes = atob(b64);
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) out[i] = bytes.charCodeAt(i);
  return out;
}

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
  return value.replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
}

function wrapLine(
  line: string,
  maxWidth: number,
  size: number,
  font: PDFFont,
): string[] {
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
  const pageSize: [number, number] = [595.28, 841.89];
  const margin = 40;
  const fontSize = 10;
  const lineHeight = 14;
  const maxWidth = pageSize[0] - margin * 2;

  let page = pdfDoc.addPage(pageSize);
  let y = page.getHeight() - margin;
  const sourceLines = text
    ? text.split("\n")
    : ["Contract content unavailable."];

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

export const archiveBenefitContractPdf: NonNullable<
  MutationResolvers<Ctx>["archiveBenefitContractPdf"]
> = async (_, args, ctx) => {
  const actorEmployeeId = requireEmployeeId(ctx);
  const role = (ctx.role ?? "").toLowerCase();
  const isHrOrAdminOrFinance =
    role === "hr" || role === "admin" || role === "finance-manager";
  if (isHrOrAdminOrFinance) {
    requireHROrAdminOrFinance(ctx);
  }
  const db = getDb(ctx.env);

  const rows = await db
    .select({
      requestId: benefitRequests.id,
      requestEmployeeId: benefitRequests.employeeId,
      benefitId: benefitRequests.benefitId,
      requestStatus: benefitRequests.status,
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
    .where(eq(benefitRequests.id, args.requestId))
    .limit(1);

  const row = rows[0];
  if (!row)
    throw new GraphQLError("Benefit request not found", {
      extensions: { code: "NOT_FOUND" },
    });
  if (!isHrOrAdminOrFinance && row.requestEmployeeId !== actorEmployeeId) {
    throw new GraphQLError("Forbidden: request does not belong to employee", {
      extensions: { code: "FORBIDDEN" },
    });
  }
  if ((row.requestStatus ?? "").toLowerCase() !== "approved") {
    throw new GraphQLError(
      "Signed contract upload is allowed only for approved requests",
      {
        extensions: { code: "BAD_USER_INPUT" },
      },
    );
  }
  if (!toBool01(row.benefitRequiresContract)) {
    throw new GraphQLError("This benefit does not require contract archive", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  const payload = args.html?.trim() ?? "";
  let pdfBytes: Uint8Array;
  if (payload.startsWith("data:application/pdf;base64,")) {
    const encoded = payload.slice("data:application/pdf;base64,".length);
    if (!encoded) {
      throw new GraphQLError("Signed contract PDF payload is empty", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    pdfBytes = decodeBase64Pdf(encoded);
  } else {
    const html = payload || renderPinefitContractHtml(row);
    pdfBytes = await renderPdfFromHtml(html);
  }
  const uploadedAt = new Date().toISOString();
  const objectKey = `contracts/requests/${args.requestId}/employee-${Date.now()}.pdf`;

  await ctx.env.CONTRACTS.put(objectKey, pdfBytes, {
    httpMetadata: { contentType: "application/pdf" },
  });

  await db
    .update(benefitRequests)
    .set({
      employeeContractR2Key: objectKey,
      employeeContractUploadedAt: uploadedAt,
      updatedAt: uploadedAt,
    })
    .where(eq(benefitRequests.id, args.requestId));

  const existingEligibility = await db
    .select({
      employeeId: benefitEligibility.employeeId,
      status: benefitEligibility.status,
    })
    .from(benefitEligibility)
    .where(
      and(
        eq(benefitEligibility.employeeId, row.requestEmployeeId),
        eq(benefitEligibility.benefitId, row.benefitId),
      ),
    )
    .limit(1);
  const prevEligibilityStatus = existingEligibility[0]?.status ?? null;

  if (existingEligibility[0]) {
    await db
      .update(benefitEligibility)
      .set({
        status: "active",
        computedAt: uploadedAt,
        overrideBy: actorEmployeeId,
        overrideReason: "Signed contract uploaded",
      })
      .where(
        and(
          eq(benefitEligibility.employeeId, row.requestEmployeeId),
          eq(benefitEligibility.benefitId, row.benefitId),
        ),
      );
  } else {
    await db.insert(benefitEligibility).values({
      employeeId: row.requestEmployeeId,
      benefitId: row.benefitId,
      status: "active",
      ruleEvaluationJson: "[]",
      computedAt: uploadedAt,
      overrideBy: actorEmployeeId,
      overrideReason: "Signed contract uploaded",
      overrideExpiresAt: null,
    });
  }

  await db.insert(eligibilityAudit).values({
    id: crypto.randomUUID(),
    employeeId: row.requestEmployeeId,
    benefitId: row.benefitId,
    oldStatus: prevEligibilityStatus,
    newStatus: "active",
    ruleTraceJson: JSON.stringify({
      action: "contract_uploaded",
      requestId: args.requestId,
      uploadedBy: actorEmployeeId,
      reason: "Signed contract uploaded",
    }),
    triggeredBy: actorEmployeeId,
    computedAt: uploadedAt,
    createdAt: uploadedAt,
  });

  await dispatchEmployeeNotification(ctx.env, {
    employeeId: row.requestEmployeeId,
    type: "REQUEST_STATUS",
    tone: "success",
    dedupeKey: `request:${args.requestId}:contract-uploaded`,
    title: "Signed Contract Uploaded",
    body: `Your signed contract for ${row.benefitName ?? "benefit"} has been uploaded. Your benefit is now ACTIVE.`,
    metadata: {
      requestId: args.requestId,
      benefitId: row.benefitId,
      status: "ACTIVE",
      uploadedBy: actorEmployeeId,
    },
  });

  await dispatchRoleNotification(ctx.env, {
    recipientRole: "admin",
    title: "Employee Contract Uploaded",
    body: `${row.employeeName ?? row.requestEmployeeId} uploaded a signed contract for ${row.benefitName ?? "benefit"}.`,
    type: "document",
    tone: "info",
    metadata: {
      requestId: args.requestId,
      employeeId: row.requestEmployeeId,
      benefitId: row.benefitId,
    },
  });

  return {
    ok: true,
    requestId: args.requestId,
    objectKey,
    uploadedAt,
  };
};
