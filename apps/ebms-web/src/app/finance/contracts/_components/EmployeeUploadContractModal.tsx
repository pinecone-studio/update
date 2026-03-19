"use client";

import { useRef, useState } from "react";

const MAX_PDF_SIZE_MB = 10;

type EmployeeOption = { id: string; name: string | null };

type EmployeeUploadContractModalProps = {
  open: boolean;
  employeeOptions: EmployeeOption[];
  selectedEmployeeId: string;
  onEmployeeChange: (id: string) => void;
  vendorOptions: string[];
  selectedVendor: string;
  onVendorChange: (v: string) => void;
  employeesLoading: boolean;
  uploading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

function validatePdf(file: File): string | null {
  if (file.type !== "application/pdf") return "PDF only";
  if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) return `Max ${MAX_PDF_SIZE_MB}MB`;
  return null;
}

export function EmployeeUploadContractModal({
  open,
  employeeOptions,
  selectedEmployeeId,
  onEmployeeChange,
  vendorOptions,
  selectedVendor,
  onVendorChange,
  employeesLoading,
  uploading,
  onClose,
  onSubmit,
}: EmployeeUploadContractModalProps) {
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
        className="relative z-10 flex w-[900px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[28.63px] border bg-[radial-gradient(circle_at_18%_18%,rgba(126,97,210,0.20),transparent_42%),radial-gradient(circle_at_78%_72%,rgba(84,120,214,0.14),transparent_46%),linear-gradient(155deg,rgba(45,34,93,0.94),rgba(38,31,86,0.92))] backdrop-blur-[18px]"
        style={{
          borderWidth: "0.72px",
          borderColor: "rgba(138, 156, 233, 0.42)",
          padding: "40px 32px",
          gap: "24px",
        }}
      >
        <div className="flex shrink-0 items-center">
          <h2 className="text-[22px] font-normal text-white">
            Upload Contract
          </h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit(e);
          }}
          className="flex flex-col gap-6 overflow-hidden"
        >
          <input type="hidden" name="tab" value="employee" />
          <div className="flex flex-col gap-4">
            <h3 className="text-5 font-medium text-[#A7B6D3]">Basic Info</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2.5">
                <label className="text-5 text-[#A7B6D3]">Employee</label>
                <select
                  name="employeeId"
                  value={selectedEmployeeId}
                  onChange={(e) => onEmployeeChange(e.target.value)}
                  disabled={employeesLoading}
                  className="h-11 rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-5 text-white outline-none focus:border-[#B18CFF] disabled:opacity-60"
                >
                  <option value="">
                    {employeesLoading ? "Loading..." : "— Select employee —"}
                  </option>
                  {employeeOptions.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name || emp.id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-5 text-[#A7B6D3]">Benefit ID</label>
                <input
                  name="benefitId"
                  required
                  placeholder="gym-Pinefit"
                  className="h-11 rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-5 text-white placeholder:text-[#B7A9D9] outline-none focus:border-[#B18CFF]"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-5 text-[#A7B6D3]">Version</label>
                <input
                  name="version"
                  required
                  placeholder="2025.1"
                  className="h-11 rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-5 text-white placeholder:text-[#B7A9D9] outline-none focus:border-[#B18CFF]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-5 font-medium text-[#A7B6D3]">
              Contract Details
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2.5">
                <label className="text-5 text-[#A7B6D3]">
                  Vendor (optional)
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => onVendorChange(e.target.value)}
                  className="h-11 rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-5 text-white outline-none focus:border-[#B18CFF]"
                >
                  <option value="">— Select vendor —</option>
                  {vendorOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-5 text-[#A7B6D3]">
                  Effective Date (optional)
                </label>
                <input
                  name="effectiveDate"
                  type="date"
                  placeholder="yyyy-mm-dd"
                  className="h-11 rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-5 text-white outline-none focus:border-[#B18CFF] [color-scheme:dark]"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-5 text-[#A7B6D3]">Expiry Date</label>
                <input
                  name="expiryDate"
                  type="date"
                  required
                  placeholder="yyyy-mm-dd"
                  className="h-11 rounded-xl border border-[#6F5AA8] bg-[rgba(31,22,57,0.88)] px-3 text-5 text-white outline-none focus:border-[#B18CFF] [color-scheme:dark]"
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
              className="h-13 w-[156px] rounded-lg bg-[#B0B0B0] px-2 text-[20px] font-normal text-[#122459]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !pdfFile}
              className="inline-flex h-13 w-[156px] items-center justify-center rounded-lg bg-[#0057AD] px-2 text-[20px] font-normal text-white transition hover:bg-[#3E82F7] disabled:cursor-not-allowed disabled:bg-[#0057AD] disabled:text-white"
            >
              {uploading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
