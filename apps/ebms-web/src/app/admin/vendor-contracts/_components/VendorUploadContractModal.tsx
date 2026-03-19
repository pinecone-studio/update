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
  if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024)
    return `Max ${MAX_PDF_SIZE_MB}MB`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close add contract modal"
        onClick={handleClose}
        className="absolute inset-0 bg-white/25 backdrop-blur-md dark:bg-black/30 dark:backdrop-blur-lg"
      />
      <section
        className="relative z-10 my-auto flex w-full max-w-[900px] flex-col overflow-hidden rounded-2xl border border-[rgba(138,156,233,0.42)] bg-[radial-gradient(circle_at_18%_18%,rgba(126,97,210,0.20),transparent_42%),radial-gradient(circle_at_78%_72%,rgba(84,120,214,0.14),transparent_46%),linear-gradient(155deg,rgba(45,34,93,0.94),rgba(38,31,86,0.92))] p-4 backdrop-blur-[18px] sm:p-6 md:p-8"
      >
        <div className="flex shrink-0 items-center">
          <h2 className="text-lg font-normal text-white sm:text-[22px]">
            Upload Vendor Contract
          </h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit(e);
          }}
          className="flex flex-col gap-4 overflow-y-auto sm:gap-6"
        >
          <input type="hidden" name="tab" value="vendor" />
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-[#A7B6D3] sm:text-base">Basic Info</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex min-w-0 flex-col gap-2.5">
                <label className="text-sm text-[#A7B6D3]">Benefit</label>
                <select
                  name="benefitId"
                  required
                  value={selectedBenefitId}
                  onChange={(e) => onBenefitChange(e.target.value)}
                  disabled={benefitsLoading || benefitOptions.length === 0}
                  className="h-11 min-w-0 w-full rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-sm text-white outline-none focus:border-[#B18CFF] disabled:opacity-60 sm:text-base"
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
              <div className="flex min-w-0 flex-col gap-2.5">
                <label className="text-sm text-[#A7B6D3]">Version</label>
                <input
                  name="version"
                  required
                  placeholder="vendor-2026.1"
                  className="h-11 min-w-0 w-full rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-sm text-white placeholder:text-[#B7A9D9] outline-none focus:border-[#B18CFF] sm:text-base"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-2.5">
                <label className="text-sm text-[#A7B6D3]">
                  Vendor Name (optional)
                </label>
                <input
                  name="vendorName"
                  placeholder="PineFit"
                  className="h-11 min-w-0 w-full rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-sm text-white placeholder:text-[#B7A9D9] outline-none focus:border-[#B18CFF] sm:text-base"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-[#A7B6D3] sm:text-base">
              Contract Details
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2.5">
                <label className="text-sm text-[#A7B6D3]">
                  Effective Date (optional)
                </label>
                <input
                  name="effectiveDate"
                  type="date"
                  placeholder="yyyy-mm-dd"
                  className="h-11 min-w-0 w-full rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-sm text-white outline-none focus:border-[#B18CFF] [color-scheme:dark] sm:text-base"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-2.5">
                <label className="text-sm text-[#A7B6D3]">
                  Expiry Date (optional)
                </label>
                <input
                  name="expiryDate"
                  type="date"
                  placeholder="yyyy-mm-dd"
                  className="h-11 min-w-0 w-full rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-sm text-white outline-none focus:border-[#B18CFF] [color-scheme:dark] sm:text-base"
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
                  ? "border-[#B18CFF] bg-[rgba(93,63,155,0.26)]"
                  : pdfError
                    ? "border-red-500"
                    : "border-[#6F5AA8] bg-[rgba(31,22,57,0.32)]"
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
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2F66E8] px-5 text-sm font-medium text-white transition hover:bg-[#3E82F7] sm:text-base"
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
              <p className="text-center text-xs text-[#8595B6] sm:text-sm">
                Drag & drop or click to upload PDF only Max {MAX_PDF_SIZE_MB}MB
              </p>
              {pdfFile && (
                <p className="text-sm text-green-400">{pdfFile.name}</p>
              )}
              {pdfError && <p className="text-sm text-red-400">{pdfError}</p>}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap justify-end gap-2.5 pt-1 pb-2 sm:pb-0">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#D1DBEF] dark:hover:bg-[#24364F]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !pdfFile}
              className="rounded-lg bg-[#3B82F6] px-4 py-2 font-medium text-white hover:bg-[#2563EB] disabled:opacity-50 dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
            >
              {uploading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
