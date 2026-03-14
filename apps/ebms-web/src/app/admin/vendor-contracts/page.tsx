"use client";

import { useState } from "react";

type Contract = {
  id: number;
  contractNumber: string;
  contractName: string;
  startDate: string;
  endDate: string;
  contractUrl: string;
  status: "Active" | "Expiring soon";
  renewal?: "Auto-renew";
};

const contracts: Contract[] = [
  {
    id: 1,
    contractNumber: "CNT-001",
    contractName: "Mack Vendor Master Agreement",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    contractUrl: "https://contracts.update.mn/cnt-001",
    status: "Active",
    renewal: "Auto-renew",
  },
  {
    id: 2,
    contractNumber: "CNT-002",
    contractName: "Mack Employee Benefit Contract",
    startDate: "2025-03-01",
    endDate: "2026-05-31",
    contractUrl: "https://contracts.update.mn/cnt-002",
    status: "Expiring soon",
  },
  {
    id: 3,
    contractNumber: "CNT-003",
    contractName: "Mack Medical Support Addendum",
    startDate: "2026-01-15",
    endDate: "2027-01-14",
    contractUrl: "https://contracts.update.mn/cnt-003",
    status: "Active",
  },
];

function getApiBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_API_URL || "";
  const base = env.replace(/\/graphql\/?$/, "").trim();
  return base || "http://localhost:8787";
}

export default function VendorContractsPage() {
  const [activeTab, setActiveTab] = useState<"employee" | "vendor">("employee");
  const [contractRows, setContractRows] = useState<Contract[]>(contracts);
  const [search, setSearch] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const filteredContracts = contractRows.filter((contract) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      contract.contractNumber.toLowerCase().includes(query) ||
      contract.contractName.toLowerCase().includes(query) ||
      contract.contractUrl.toLowerCase().includes(query)
    );
  });

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);
    setUploadMessage(null);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const contractNumber = String(formData.get("contractNumber") ?? "").trim();
    const vendorName = String(formData.get("vendorName") ?? "").trim();
    const effectiveDate = String(formData.get("effectiveDate") ?? "").trim();
    const expiryDate = String(formData.get("expiryDate") ?? "").trim();
    const uploadedFile = formData.get("file");

    try {
      const base = getApiBaseUrl();
      const res = await fetch(`${base}/admin/contracts/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          (data &&
            typeof data === "object" &&
            "error" in data &&
            (data as any).error) ||
          res.statusText ||
          "Upload failed";
        setUploadError(String(msg));
        return;
      }
      setUploadMessage("Contract uploaded successfully.");
      const contractName =
        vendorName.length > 0
          ? `${vendorName} Contract`
          : activeTab === "employee"
            ? `Employee Contract ${contractNumber || "New"}`
            : `Vendor Contract ${contractNumber || "New"}`;
      const fallbackUrl = contractNumber
        ? `https://contracts.update.mn/${contractNumber.toLowerCase()}`
        : "https://contracts.update.mn/new-contract";
      const responseUrl =
        data && typeof data === "object" && "url" in data && typeof (data as any).url === "string"
          ? (data as any).url
          : fallbackUrl;
      const isExpiringSoon = !!expiryDate && new Date(expiryDate).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 90;
      setContractRows((prev) => [
        ...prev,
        (() => {
          const nextId = prev.length > 0 ? Math.max(...prev.map((row) => row.id)) + 1 : 1;
          return {
            id: nextId,
            contractNumber: contractNumber || `CNT-${String(nextId).padStart(3, "0")}`,
            contractName,
            startDate: effectiveDate || "—",
            endDate: expiryDate || "—",
            contractUrl:
              responseUrl ||
              (uploadedFile instanceof File && uploadedFile.name
                ? `https://contracts.update.mn/files/${encodeURIComponent(uploadedFile.name)}`
                : fallbackUrl),
            status: isExpiringSoon ? "Expiring soon" : "Active",
          };
        })(),
      ]);
      formEl.reset();
      setShowUploadForm(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div
          className="flex flex-wrap items-center gap-3"
          role="tablist"
          aria-label="Contract type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "employee"}
            onClick={() => setActiveTab("employee")}
            className={`rounded-xl px-3 py-2 text-5 font-semibold transition ${
              activeTab === "employee"
                ? "bg-blue-600 text-white dark:bg-[#2F66E8]"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#24364F] dark:hover:text-white"
            }`}
          >
            Employee contract
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "vendor"}
            onClick={() => setActiveTab("vendor")}
            className={`rounded-xl px-3 py-2 text-5 font-semibold transition ${
              activeTab === "vendor"
                ? "bg-blue-600 text-white dark:bg-[#2F66E8]"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#24364F] dark:hover:text-white"
            }`}
          >
            Vendor contract
          </button>
        </div>
        <p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
          {activeTab === "employee"
            ? "Manage employee contracts and track lifecycle status"
            : "Manage vendor contracts and track lifecycle status"}
        </p>
      </div>
      {uploadError && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {uploadError}
        </p>
      )}

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div
          className={`grid grid-cols-1 gap-2 ${
            activeTab === "vendor" ? "sm:grid-cols-2 lg:col-span-2" : "sm:grid-cols-3 lg:col-span-3"
          }`}
        >
          <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-[#2C4264] dark:bg-[#1E293B]">
            <div className="mb-2 flex items-start justify-between">
              <p className="text-6 text-slate-600 dark:text-[#A7B6D3]">
                Active Contracts
              </p>
              <span className="mt-1 h-3 w-3 rounded-full bg-[#19D463]" />
            </div>
            <p className="text-5 font-semibold text-slate-900 dark:text-white">
              {contractRows.filter((c) => c.status === "Active").length}
            </p>
          </article>

          <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-[#2C4264] dark:bg-[#1E293B]">
            <div className="mb-2 flex items-start justify-between">
              <p className="text-6 text-slate-600 dark:text-[#A7B6D3]">
                Expiring Soon
              </p>
              <span className="mt-1 h-3 w-3 rounded-full bg-amber-500 dark:bg-[#FFB21C]" />
            </div>
            <p className="text-5 font-semibold text-slate-900 dark:text-white">
              {contractRows.filter((c) => c.status === "Expiring soon").length}
            </p>
          </article>

          {activeTab !== "vendor" && (
            <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 dark:border-[#2C4264] dark:bg-[#1E293B]">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-6 text-slate-600 dark:text-[#A7B6D3]">
                  Pending Renewal
                </p>
                <span className="mt-1 h-3 w-3 rounded-full bg-[#3E82F7]" />
              </div>
              <p className="text-5 font-semibold text-slate-900 dark:text-white">
                {contractRows.filter((c) => c.renewal === "Auto-renew").length}
              </p>
            </article>
          )}
        </div>

        <div
          className={`rounded-xl border border-slate-200 bg-white p-3 dark:border-[#2C4264] dark:bg-[#1E293B] ${
            activeTab === "vendor" ? "lg:col-span-2" : "lg:col-span-1"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[260px] flex-1">
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
                placeholder="Search by contract number, name, or URL..."
                className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 pl-12 pr-4 text-5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8595B6] dark:focus:border-[#4B6FA8]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setShowUploadForm((prev) => !prev);
                setUploadError(null);
                setUploadMessage(null);
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2F66E8] px-4 text-5 font-medium text-white transition hover:bg-[#3E82F7]"
            >
              {showUploadForm ? "Close" : "+ Add Contract"}
            </button>
          </div>
        </div>
      </section>

      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close add contract modal"
            onClick={() => setShowUploadForm(false)}
            className="absolute inset-0 bg-[#020B1FCC] backdrop-blur-md"
          />
          <section className="relative z-10 w-full max-w-6xl rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-5 font-semibold text-white">
                {activeTab === "employee"
                  ? "Upload Employee Contract PDF"
                  : "Upload Vendor Contract PDF"}
              </h2>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-[#324A70] px-3 text-5 text-[#D4DEEF] transition hover:bg-[#24364F]"
              >
                Close
              </button>
            </div>
            {uploadError && (
              <p className="mb-3 rounded-xl border border-[#7F1D1D] bg-[#2F1212] p-3 text-[#FCA5A5] text-5">
                {uploadError}
              </p>
            )}
            {uploadMessage && (
              <p className="mb-3 rounded-xl border border-[#166534] bg-[#052E25] p-3 text-[#BBF7D0] text-5">
                {uploadMessage}
              </p>
            )}
            <form
              onSubmit={handleUpload}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              <div className="flex flex-col gap-1">
                <label className="text-5 text-[#A7B6D3]">Contract Number</label>
                <input
                  name="contractNumber"
                  required
                  placeholder="gym_pinefit"
                  className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-3 text-5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8595B6] dark:focus:border-[#4B6FA8]"
                />
              </div>
              {activeTab === "employee" ? (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-5 text-[#A7B6D3]">Benefit ID</label>
                    <input
                      name="benefitId"
                      required
                      placeholder="gym_pinefit"
                      className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-3 text-5 text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-5 text-[#A7B6D3]">Version</label>
                    <input
                      name="version"
                      required
                      placeholder="2025.1"
                      className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-3 text-5 text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <input type="hidden" name="benefitId" value="vendor_contract" />
                  <input type="hidden" name="version" value="1.0" />
                </>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-5 text-[#A7B6D3]">
                  Vendor Name (optional)
                </label>
                <input
                  name="vendorName"
                  placeholder="PineFit"
                  className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-3 text-5 text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-5 text-[#A7B6D3]">
                  Effective Date (optional)
                </label>
                <input
                  name="effectiveDate"
                  type="date"
                  className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-3 text-5 text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-5 text-[#A7B6D3]">
                  Expiry Date (optional)
                </label>
                <input
                  name="expiryDate"
                  type="date"
                  className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-3 text-5 text-white placeholder:text-[#8595B6] outline-none focus:border-[#4B6FA8]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-5 text-[#A7B6D3]">Contract PDF</label>
                <input
                  name="file"
                  type="file"
                  accept="application/pdf"
                  required
                  className="h-11 rounded-xl border border-[#324A70] bg-[#0F172A] px-2 text-5 text-white file:mr-3 file:rounded-lg file:border-none file:bg-[#334160] file:px-3 file:py-1.5 file:text-5 file:text-[#D4DEEF] hover:file:bg-[#3A4A6C]"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2F66E8] px-5 text-5 font-medium text-white transition hover:bg-[#3E82F7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload Contract"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
        <h2 className="text-5 font-semibold text-slate-900 dark:text-white">
          {activeTab === "employee"
            ? "All Employee Contracts"
            : "All Vendor Contracts"}
        </h2>

        <div className="mt-5 overflow-x-auto rounded-3xl border border-slate-200 dark:border-[#2C4264]">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-[#2C4264]">
            <thead className="bg-slate-50 dark:bg-[#0F1D3A]">
              <tr>
                <th className="px-5 py-4 text-left text-5 font-semibold text-slate-600 dark:text-[#A7B6D3]">
                  №
                </th>
                <th className="px-5 py-4 text-left text-5 font-semibold text-slate-600 dark:text-[#A7B6D3]">
                  Гэрээний дугаар
                </th>
                <th className="px-5 py-4 text-left text-5 font-semibold text-slate-600 dark:text-[#A7B6D3]">
                  Гэрээний нэр
                </th>
                <th className="px-5 py-4 text-left text-5 font-semibold text-slate-600 dark:text-[#A7B6D3]">
                  Эхлэх хугацаа
                </th>
                <th className="px-5 py-4 text-left text-5 font-semibold text-slate-600 dark:text-[#A7B6D3]">
                  Дуусах хугацаа
                </th>
                <th className="px-5 py-4 text-left text-5 font-semibold text-slate-600 dark:text-[#A7B6D3]">
                  Гэрээний URL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-[#2C4264] dark:bg-[#0E2047]">
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
                    className="px-5 py-6 text-center text-5 text-slate-500 dark:text-[#A7B6D3]"
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
