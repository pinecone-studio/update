"use client";

import { gql } from "graphql-request";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VendorContractsSkeleton } from "../components/VendorContractsSkeleton";
import { getAdminClient, getApiBaseUrl, getApiErrorMessage } from "../_lib/api";
import type { Contract, ContractApiRow } from "./types";

type EmployeeOption = { id: string; name: string | null };

const EMPLOYEES_QUERY = gql`
  query EmployeesForContracts {
    employees {
      id
      name
    }
  }
`;

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
      employeeId: item.employeeId ?? null,
      contractNumber: item.version || item.id,
      contractName: `${item.benefitName ?? item.benefitId} - ${item.employeeName ?? "Employee"}`,
      startDate: item.effectiveDate || "—",
      endDate,
      contractUrl: `${base}${item.downloadUrl}`,
      status: isExpiringSoon ? "Expiring soon" : "Active",
    };
  });
}

export function EmployeeContracts() {
  const [loading, setLoading] = useState(true);
  const [contractRows, setContractRows] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOption[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [filterByEmployeeId, setFilterByEmployeeId] = useState("");

  const loadContracts = useCallback(async () => {
    try {
      const base = getApiBaseUrl();
      const res = await fetch(`${base}/admin/contracts?tab=employee`);
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
    loadContracts();
  }, [loadContracts]);

  useEffect(() => {
    let cancelled = false;
    setEmployeesLoading(true);
    (async () => {
      try {
        const client = getAdminClient();
        const res = await client.request<{ employees: EmployeeOption[] }>(
          EMPLOYEES_QUERY,
        );
        const list = res.employees ?? [];
        if (!cancelled) {
          setEmployeeOptions(list);
          setSelectedEmployeeId((prev) =>
            prev && list.some((e) => e.id === prev)
              ? prev
              : (list[0]?.id ?? ""),
          );
        }
      } catch {
        if (!cancelled) setEmployeeOptions([]);
      } finally {
        if (!cancelled) setEmployeesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredContracts = useMemo(() => {
    let list = contractRows;
    if (filterByEmployeeId) {
      list = list.filter((c) => c.employeeId === filterByEmployeeId);
    }
    const query = search.trim().toLowerCase();
    if (!query) return list;
    return list.filter(
      (c) =>
        c.contractNumber.toLowerCase().includes(query) ||
        c.contractName.toLowerCase().includes(query) ||
        c.contractUrl.toLowerCase().includes(query),
    );
  }, [contractRows, search, filterByEmployeeId]);

  const pendingRenewalCount = useMemo(
    () => contractRows.filter((c) => c.status === "Expiring soon").length,
    [contractRows],
  );

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);
    setUploadMessage(null);
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
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
        <article className="min-w-0 h-[107px] rounded-xl border border-slate-200 bg-white p-3 dark:border-[#ffffff]/50 dark:bg-[#1D1A4180]/50">
          <div className="mb-2 flex items-start justify-between">
            <p className="text-[20px] font-normal dark:text-[#ffffff]">
              Pending Renewal
            </p>
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#3E82F7]" />
          </div>
          <p className="text-[34px] font-normal text-slate-900 dark:text-white">
            {pendingRenewalCount}
          </p>
        </article>
        <article className="min-w-0 h-[107px] rounded-xl border border-slate-200 bg-white p-3 dark:border-[#ffffff]/50 dark:bg-[#1D1A4180]/50">
          <div className="mb-2 flex items-start justify-between">
            <p className="text-[20px] font-normal dark:text-[#ffffff]">
              Total Contracts
            </p>
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#ffffff]" />
          </div>
          <p className="text-[34px] font-normal text-slate-900 dark:text-white">
            {contractRows.length}
          </p>
        </article>
      </section>

      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close add contract modal"
            onClick={() => setShowUploadForm(false)}
            className="absolute inset-0 bg-white/25 backdrop-blur-md dark:bg-black/30 dark:backdrop-blur-lg"
          />
          <section className="relative z-10 max-h-[92vh] w-full max-w-7xl overflow-auto rounded-3xl border border-slate-200 bg-white p-6 dark:border-[#2C4264] dark:bg-[#1E293B]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-5 font-semibold text-slate-900 dark:text-white">
                Upload Employee Contract PDF
              </h2>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-[#324A70] dark:text-[#C9D5EA] dark:hover:bg-[#24364F] dark:hover:text-white"
              >
                Close
              </button>
            </div>
            <form
              onSubmit={handleUpload}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              <input type="hidden" name="tab" value="employee" />
              <div className="flex flex-col gap-1">
                <label className="text-5 text-slate-600 dark:text-[#A7B6D3]">
                  Ажилтан
                </label>
                <select
                  name="employeeId"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  disabled={employeesLoading}
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-5 text-slate-900 outline-none focus:border-blue-500 disabled:opacity-60 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
                >
                  <option value="">
                    {employeesLoading ? "Уншиж байна..." : "— Ажилтан сонгох —"}
                  </option>
                  {employeeOptions.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name || emp.id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-5 text-slate-600 dark:text-[#A7B6D3]">
                  Benefit ID
                </label>
                <input
                  name="benefitId"
                  required
                  placeholder="gym_pinefit"
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8595B6] dark:focus:border-[#4B6FA8]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-5 text-slate-600 dark:text-[#A7B6D3]">
                  Version
                </label>
                <input
                  name="version"
                  required
                  placeholder="2025.1"
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8595B6] dark:focus:border-[#4B6FA8]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-5 text-slate-600 dark:text-[#A7B6D3]">
                  Vendor Name (optional)
                </label>
                <input
                  name="vendorName"
                  placeholder="PineFit"
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:placeholder:text-[#8595B6] dark:focus:border-[#4B6FA8]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-5 text-slate-600 dark:text-[#A7B6D3]">
                  Effective Date (optional)
                </label>
                <input
                  name="effectiveDate"
                  type="date"
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-5 text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-5 text-slate-600 dark:text-[#A7B6D3]">
                  Expiry Date (optional)
                </label>
                <input
                  name="expiryDate"
                  type="date"
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-5 text-slate-900 outline-none focus:border-blue-500 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:focus:border-[#4B6FA8]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-5 text-slate-600 dark:text-[#A7B6D3]">
                  Contract PDF
                </label>
                <input
                  name="file"
                  type="file"
                  accept="application/pdf"
                  required
                  className="h-11 rounded-xl border border-slate-300 bg-white px-2 text-5 text-slate-900 file:mr-3 file:rounded-lg file:border-none file:bg-blue-600 file:px-3 file:py-1.5 file:text-5 file:text-white hover:file:bg-blue-700 dark:border-[#324A70] dark:bg-[#0F172A] dark:text-white dark:file:bg-[#334160] dark:file:text-[#D4DEEF] dark:hover:file:bg-[#3A4A6C]"
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

      <section className="rounded-3xl  bg-white p-6 dark:border-[#2C4264] dark:bg-[#181743]/50">
        <div className="flex flex-col gap-12">
          <div className="flex items-center justify-between">
            <h2 className="text-[26px] font-semibold  dark:text-white">
              Contracts
            </h2>
            <div className="flex items-center gap-3">
              <select
                aria-label="Ажилтанаар шүүх"
                value={filterByEmployeeId}
                onChange={(e) => setFilterByEmployeeId(e.target.value)}
                className="h-11 min-w-[160px] rounded-xl border border-slate-200 bg-[#FFFFFF]/10 px-3 text-5 text-slate-900 outline-none  dark:text-white "
              >
                <option value="" className="text-[18px] font-normal">
                  Status{" "}
                </option>
                {employeeOptions.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name || emp.id}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm((prev) => !prev);
                  setUploadError(null);
                  setUploadMessage(null);
                }}
                className="inline-flex h-11 min-w-[170px] gap-2 flex-[0_0_auto] items-center justify-center rounded-xl bg-[#0057ADCC]/80 border border-slate-300 px-4 text-[18px] font-medium text-white transition hover:bg-[#3E82F7]"
              >
                {" "}
                +<span className="text-[18px] font-normal">Add Contract</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <select
              aria-label="Ажилтанаар шүүх"
              value={filterByEmployeeId}
              onChange={(e) => setFilterByEmployeeId(e.target.value)}
              className="h-11 min-w-[94px] rounded-lg border border-slate-20 bg-[#FFFFFF]/10  px-3 text-5 text-slate-900 outline-none  dark:text-white "
            >
              <option value="">All</option>
              {employeeOptions.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name || emp.id}
                </option>
              ))}
            </select>
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
                className="h-11 w-[368px] rounded-xl  pl-12 pr-4 text-5 border bg-[#FFFFFF]/10  text-slate-200 placeholder:text-slate-200 outline-none  dark:text-white dark:placeholder:text-[#FFFFFF80]/50 "
              />
            </div>
          </div>

          <table className="min-w-full ">
            <thead className="">
              <tr>
                <th className="px-5 py-4 text-left text-[18px] font-normal dark:text-[#A7B6D3]">
                  №
                </th>
                <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
                  Contract name{" "}
                </th>
                <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
                  Contract code{" "}
                </th>
                <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
                  Start date
                </th>
                <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
                  {" "}
                  End date
                </th>
                <th className="px-5 py-4 text-left text-[18px] font-normal text-slate-600 dark:text-[#A7B6D3]">
                  Contract URL
                </th>
              </tr>
            </thead>
            <tbody className="">
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
