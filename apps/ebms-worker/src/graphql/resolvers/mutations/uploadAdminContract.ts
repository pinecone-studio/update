import { GraphQLError } from "graphql";
import { and, eq } from "drizzle-orm";
import type { MutationResolvers } from "../../generated/graphql";
import type { Ctx } from "../context";
import { requireAdmin } from "../context";
import { getDb } from "../../../db/drizzle";
import {
  benefits as benefitsTable,
  contracts as contractsTable,
} from "../../../db/schema";

function toHex(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function decodeBase64(input: string): Uint8Array {
  const normalized = input.includes(",")
    ? (input.split(",").pop() ?? "")
    : input;
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export const uploadAdminContract: NonNullable<
  MutationResolvers<Ctx>["uploadAdminContract"]
> = async (_, { input }, ctx) => {
  requireAdmin(ctx);

  const benefitId = input.benefitId.trim();
  const version = input.version.trim();
  if (!benefitId)
    throw new GraphQLError("benefitId is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  if (!version)
    throw new GraphQLError("version is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  if (!input.fileBase64.trim()) {
    throw new GraphQLError("fileBase64 is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const db = getDb(ctx.env);
  const benefitRows = await db
    .select({
      id: benefitsTable.id,
      name: benefitsTable.name,
      vendorName: benefitsTable.vendorName,
    })
    .from(benefitsTable)
    .where(eq(benefitsTable.id, benefitId))
    .limit(1);
  const benefitRow = benefitRows[0];
  if (!benefitRow)
    throw new GraphQLError("Benefit not found", {
      extensions: { code: "NOT_FOUND" },
    });

  const vendorName = input.vendorName?.trim() || benefitRow.vendorName || null;
  if (!vendorName) {
    throw new GraphQLError(
      "vendorName is required (or set benefit vendor name)",
      {
        extensions: { code: "BAD_USER_INPUT" },
      },
    );
  }

  const pdfBytes = decodeBase64(input.fileBase64);
  const digestInput = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength,
  );
  const sha256 = await crypto.subtle.digest(
    "SHA-256",
    digestInput as ArrayBuffer,
  );
  const sha256Hex = toHex(sha256);
  const now = new Date().toISOString();
  const contractId = crypto.randomUUID();
  const safeName = (input.fileName || "contract.pdf").replace(
    /[^a-zA-Z0-9._-]+/g,
    "_",
  );
  const r2ObjectKey = `contracts/${benefitId}/${version}/${contractId}-${safeName}`;

  await ctx.env.CONTRACTS.put(r2ObjectKey, pdfBytes, {
    httpMetadata: { contentType: input.contentType || "application/pdf" },
  });

  await db
    .update(contractsTable)
    .set({ isActive: 0, updatedAt: now })
    .where(
      and(
        eq(contractsTable.benefitId, benefitId),
        eq(contractsTable.isActive, 1),
      ),
    );

  await db.insert(contractsTable).values({
    id: contractId,
    benefitId,
    vendorName,
    version,
    r2ObjectKey,
    sha256Hash: sha256Hex,
    effectiveDate: input.effectiveDate?.trim() || null,
    expiryDate: input.expiryDate?.trim() || null,
    isActive: 1,
    createdAt: now,
    updatedAt: now,
  });

  await db
    .update(benefitsTable)
    .set({ activeContractId: contractId, updatedAt: now })
    .where(eq(benefitsTable.id, benefitId));

  return {
    ok: true,
    contract: {
      id: contractId,
      benefitId,
      benefitName: benefitRow.name ?? null,
      vendorName,
      version,
      effectiveDate: input.effectiveDate?.trim() || null,
      expiryDate: input.expiryDate?.trim() || null,
      isActive: true,
      r2ObjectKey,
      createdAt: now,
      updatedAt: now,
      employeeName: null,
      downloadUrl: `/admin/contracts/${encodeURIComponent(contractId)}/file`,
    },
  };
};
