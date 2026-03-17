"use client";

import { gql } from "graphql-request";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VendorContractsSkeleton } from "../components/VendorContractsSkeleton";
import { getAdminClient, getApiBaseUrl, getApiErrorMessage } from "../_lib/api";
import type { BenefitOption, Contract, ContractApiRow } from "./types";

const BENEFITS_QUERY = gql`
  query BenefitsForContracts {
    benefits {
      id
      name
      category
      vendorName
      requiresContract
    }
  }
`;

const MAX_PDF_SIZE_MB = 10;

function mapRowsToContracts(items: ContractApiRow[]): Contract[] {
  const nowMs = Date.now();
  const base = getApiBaseUrl();
  return items.map((item) => {
    const endDate = item.expiryDate || "—";
    const msToEnd = item.expiryDate
      ? new Date(item.expiryDate).getTime() - nowMs
      : Number.POSITIVE_INFINITY;
    const isExpiringSoon = msToEnd > 0 && msToEnd < 1000 * 60 * 60 * 24 * 90;
    return {
      id: item.id,
      contractNumber: item.version || item.id,
      contractName: `${item.benefitName ?? item.benefitId} - ${item.vendorName ?? "Contract"}`,
      startDate: item.effectiveDate || "—",
      endDate,
      contractUrl: `${base}${item.downloadUrl}`,
      status: isExpiringSoon ? "Expiring soon" : "Active",
    };
  });
}

export function VendorContracts() {
  const [loading, setLoading] = useState(true);
  const [contractRows, setContractRows] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [benefitOptions, setBenefitOptions] = useState<BenefitOption[]>([]);
  const [selectedVendorBenefitId, setSelectedVendorBenefitId] = useState("");
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadContracts = useCallback(async () => {
    try {
      const base = getApiBaseUrl();
      const res = await fetch(`${base}/admin/contracts?tab=vendor`);
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          (data as { error?: unknown }).error
            ? String((data as { error?: unknown }).error)
            : "Failed to fetch contracts";
        throw new Error(msg);
      }
      const items =
        data && typeof data === "object" && "contracts" in data
          ? ((data as { contracts?: ContractApiRow[] }).contracts ?? [])
          : [];
      setContractRows(mapRowsToContracts(items));
    } catch (e) {
      setUploadError(getApiErrorMessage(e));
      setContractRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setBenefitsLoading(true);
    setUploadError(null);
    (async () => {
      try {
        const client = getAdminClient();
        const res = await client.request<{ benefits: BenefitOption[] }>(
          BENEFITS_QUERY,
        );
        const list = (res.benefits ?? []).filter((b) => b.requiresContract);
        if (!cancelled) {
          setBenefitOptions(list);
          setSelectedVendorBenefitId((prev) =>
            prev && list.some((b) => b.id === prev)
              ? prev
              : (list[0]?.id ?? ""),
          );
        }
      } catch (e) {
        if (!cancelled) setUploadError(getApiErrorMessage(e));
      } finally {
        if (!cancelled) setBenefitsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  const filteredContracts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contractRows;
    return contractRows.filter(
      (c) =>
        c.contractNumber.toLowerCase().includes(query) ||
        c.contractName.toLowerCase().includes(query) ||
        c.contractUrl.toLowerCase().includes(query),
    );
  }, [contractRows, search]);

  function validatePdf(file: File): string | null {
    if (file.type !== "application/pdf") return "PDF only";
    if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) return `Max ${MAX_PDF_SIZE_MB}MB`;
    return null;
  }

  function handlePdfSelect(file: File) {
    const err = validatePdf(file);
    setPdfError(err);
    setPdfFile(err ? null : file);
    if (fileInputRef.current && !err) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
    }
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pdfFile && !fileInputRef.current?.files?.length) {
      setPdfError("Please upload a PDF file");
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadMessage(null);
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    formData.set("benefitId", selectedVendorBenefitId);
    try {
      const base = getApiBaseUrl();
      const res = await fetch(`${base}/admin/contracts/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setUploadError(
          (data &&
            typeof data === "object" &&
            "error" in data &&
            (data as { error?: string }).error) ||
            res.statusText ||
            "Upload failed",
        );
        return;
      }
      setUploadMessage("Contract uploaded successfully.");
      await loadContracts();
      formEl.reset();
      setPdfFile(null);
      setPdfError(null);
      setShowUploadForm(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <VendorContractsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {uploadError && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {uploadError}
        </p>
      )}
      {uploadMessage && (
        <p className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-5 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
          {uploadMessage}
        </p>
      )}

      <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="min-w-0 h-[107px] rounded-xl border border-slate-200 bg-white p-3 dark:border-[#ffffff]/50 dark:bg-[#1D1A4180]/50">
          <div className="mb-2 flex items-start justify-between">
            <p className="text-[20px] font-normal dark:text-[#FFFFFF]">
              Active Contracts
            </p>
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#19D463]" />
          </div>
          <p className="text-[34px] font-normal text-slate-900 dark:text-white">
            {contractRows.filter((c) => c.status === "Active").length}
          </p>
        </article>
        <article className="min-w-0 h-[107px] rounded-xl border border-slate-200 bg-white p-3 dark:border-[#ffffff]/50 dark:bg-[#1D1A4180]/50">
          <div className="mb-2 flex items-start justify-between">
            <p className="text-[20px] font-normal dark:text-[#ffffff]">
              Expiring Soon
            </p>
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-amber-500 dark:bg-[#FFB21C]" />
          </div>
          <p className="text-[34px] font-normal text-slate-900 dark:text-white">
            {contractRows.filter((c) => c.status === "Expiring soon").length}
          </p>
        </article>
      </section>

      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6">
          <button
            type="button"
            aria-label="Close add contract modal"
            onClick={() => {
              setShowUploadForm(false);
              setPdfFile(null);
              setPdfError(null);
            }}
            className="absolute inset-0 bg-white/25 backdrop-blur-md dark:bg-black/30 dark:backdrop-blur-lg"
          />
          <section
            className="relative z-10 flex w-[900px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[28.63px] border bg-[#1A2037]"
            style={{
              borderWidth: "0.72px",
              borderColor: "rgba(158, 158, 158, 0.5)",
              padding: "40px 32px",
              gap: "24px",
            }}
          >
            <div className="flex shrink-0 items-center">
              <h2 className="text-[22px] font-normal text-white">Upload Vendor Contract</h2>
            </div>
            <form onSubmit={handleUpload} className="flex flex-col gap-6 overflow-hidden">
              <input type="hidden" name="tab" value="vendor" />
              <div className="flex flex-col gap-4">
                <h3 className="text-5 font-medium text-[#A7B6D3]">Basic Info</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-5 text-[#A7B6D3]">Benefit</label>
                    <select
                      name="benefitId"
                      required
                      value={selectedVendorBenefitId}
                      onChange={(e) => setSelectedVendorBenefitId(e.target.value)}
                      disabled={benefitsLoading || benefitOptions.length === 0}
                      className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-3 text-5 text-white outline-none focus:border-[#4B6FA8] disabled:opacity-60"
                    >
                      <option value="">
                        {benefitsLoading ? "Loading..." : "— Select benefit —"}
                      </option>
                      {benefitOptions.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-5 text-[#A7B6D3]">Version</label>
                    <input
                      name="version"
                      required
                      placeholder="vendor-2026.1"
                      className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-3 text-5 text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-5 text-[#A7B6D3]">Vendor Name (optional)</label>
                    <input
                      name="vendorName"
                      placeholder="PineFit"
                      className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-3 text-5 text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-5 font-medium text-[#A7B6D3]">Contract Details</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-5 text-[#A7B6D3]">Effective Date (optional)</label>
                    <input
                      name="effectiveDate"
                      type="date"
                      placeholder="yyyy-mm-dd"
                      className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-3 text-5 text-white outline-none focus:border-[#4B6FA8] [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-5 text-[#A7B6D3]">Expiry Date (optional)</label>
                    <input
                      name="expiryDate"
                      type="date"
                      placeholder="yyyy-mm-dd"
                      className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-3 text-5 text-white outline-none focus:border-[#4B6FA8] [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-10">
                <div
                  role="button"
                  tabIndex={0}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handlePdfSelect(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  className={`flex min-h-[120px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-4 transition-colors ${
                    isDragging
                      ? "border-[#4B6FA8] bg-[#24364F]/50"
                      : pdfError
                        ? "border-red-500"
                        : "border-[#324A70]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    name="file"
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handlePdfSelect(f);
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2F66E8] px-5 text-5 font-medium text-white transition hover:bg-[#3E82F7]"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload PDF
                  </button>
                  <p className="text-5 text-[#8595B6]">
                    Drag & drop or click to upload PDF only Max {MAX_PDF_SIZE_MB}MB
                  </p>
                  {pdfFile && (
                    <p className="text-5 text-green-400">{pdfFile.name}</p>
                  )}
                  {pdfError && (
                    <p className="text-5 text-red-400">{pdfError}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setPdfFile(null);
                    setPdfError(null);
                  }}
                  className="h-13 w-[172px] rounded-lg bg-[#B0B0B0] text-[20px] font-normal text-[#122459]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !pdfFile}
                  className="inline-flex w-[172px] h-13 items-center justify-center rounded-lg bg-[#0057AD] px-5 text-[20px] font-normal text-white transition hover:bg-[#3E82F7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <section className="rounded-3xl bg-white p-6 dark:border-[#2C4264] dark:bg-[#181743]/50">
        <div className="flex flex-col gap-12">
          <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-4 ">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8FA3C5]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by contract name"
                className="h-11 w-[368px] rounded-lg pl-12 pr-4 text-5 border bg-[#FFFFFF]/10 text-slate-200 placeholder:text-slate-200 outline-none dark:text-white dark:placeholder:text-[#FFFFFF80]/50"
              />
            </div>
          </div>
            <button
              type="button"
              onClick={() => {
                setShowUploadForm((prev) => !prev);
                setUploadError(null);
                setUploadMessage(null);
                setPdfFile(null);
                setPdfError(null);
              }}
              className="inline-flex h-11 min-w-[170px] gap-2 flex-[0_0_auto] items-center justify-center rounded-xl bg-[#0057ADCC]/80 border border-slate-300 px-4 text-[18px] font-medium text-white transition hover:bg-[#3E82F7]"
            >
              + <span className="text-[18px] font-normal">Add Contract</span>
            </button>
          </div>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-5 py-4 text-left text-[18px] font-normal dark:text-[#A7B6D3]">
                  №
                </th>
                <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
                  Гэрээний дугаар
                </th>
                <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
                  Гэрээний нэр
                </th>
                <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
                  Эхлэх хугацаа
                </th>
                <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
                  Дуусах хугацаа
                </th>
                <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
                  Гэрээний URL
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract, index) => (
                <tr key={contract.id}>
                  <td className="px-5 py-5 text-5 text-slate-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-5 py-5 text-5 font-semibold text-slate-900 dark:text-white">
                    {contract.contractNumber}
                  </td>
                  <td className="px-5 py-5 text-5 text-slate-900 dark:text-white">
                    {contract.contractName}
                  </td>
                  <td className="px-5 py-5 text-5 text-slate-600 dark:text-[#D1DBEF]">
                    {contract.startDate}
                  </td>
                  <td className="px-5 py-5 text-5 text-slate-600 dark:text-[#D1DBEF]">
                    {contract.endDate}
                  </td>
                  <td className="px-5 py-5 text-5">
                    <a
                      href={contract.contractUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline decoration-blue-600/40 underline-offset-4 hover:text-blue-700 dark:text-[#6FA3FF] dark:decoration-[#6FA3FF]/40 dark:hover:text-[#8AB6FF]"
                    >
                      {contract.contractUrl}
                    </a>
                  </td>
                </tr>
              ))}
              {filteredContracts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-5 text-slate-600 dark:text-[#A7B6D3]"
                  >
                    Contract олдсонгүй.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
