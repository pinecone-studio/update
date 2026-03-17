"use client";

import { useRef, useState } from "react";

const MAX_PDF_SIZE_MB = 10;

type BenefitOption = { id: string; name: string };

type VendorUploadContractModalProps = {
  open: boolean;
  benefitOptions: BenefitOption[];
  selectedBenefitId: string;
  onBenefitChange: (id: string) => void;
  benefitsLoading: boolean;
  uploading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

function validatePdf(file: File): string | null {
  if (file.type !== "application/pdf") return "PDF only";
  if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) return `Max ${MAX_PDF_SIZE_MB}MB`;
  return null;
}

export function VendorUploadContractModal({
  open,
  benefitOptions,
  selectedBenefitId,
  onBenefitChange,
  benefitsLoading,
  uploading,
  onClose,
  onSubmit,
}: VendorUploadContractModalProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfSelect = (file: File) => {
    const err = validatePdf(file);
    setPdfError(err);
    setPdfFile(err ? null : file);
    if (fileInputRef.current && !err) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
    }
  };

  const handleClose = () => {
    setPdfFile(null);
    setPdfError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6">
      <button
        type="button"
        aria-label="Close add contract modal"
        onClick={handleClose}
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
          <h2 className="text-[22px] font-normal text-white">
            Upload Vendor Contract
          </h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit(e);
          }}
          className="flex flex-col gap-6 overflow-hidden"
        >
          <input type="hidden" name="tab" value="vendor" />
          <div className="flex flex-col gap-4">
            <h3 className="text-5 font-medium text-[#A7B6D3]">Basic Info</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2.5">
                <label className="text-5 text-[#A7B6D3]">Benefit</label>
                <select
                  name="benefitId"
                  required
                  value={selectedBenefitId}
                  onChange={(e) => onBenefitChange(e.target.value)}
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
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="2"
                >
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
              onClick={handleClose}
              className="h-13 w-[172px] rounded-lg bg-[#B0B0B0] text-[20px] font-normal text-[#122459]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !pdfFile}
              className="inline-flex h-13 w-[172px] items-center justify-center rounded-lg bg-[#0057AD] px-5 text-[20px] font-normal text-white transition hover:bg-[#3E82F7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
