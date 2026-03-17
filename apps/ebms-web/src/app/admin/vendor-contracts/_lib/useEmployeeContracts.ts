"use client";

import { gql } from "graphql-request";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminClient, getApiBaseUrl, getApiErrorMessage } from "../../_lib/api";
import type { BenefitOption, Contract } from "../types";
import { mapRowsToContracts } from "./employee-contracts-api";

export type EmployeeOption = { id: string; name: string | null };

const EMPLOYEES_QUERY = gql`
  query EmployeesForContracts {
    employees {
      id
      name
    }
  }
`;

const BENEFITS_QUERY = gql`
  query BenefitsForVendorOptions {
    benefits {
      id
      name
      vendorName
    }
  }
`;

export function useEmployeeContracts() {
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
  const [vendorOptions, setVendorOptions] = useState<string[]>([]);
  const [selectedVendor, setSelectedVendor] = useState("");

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
          ? ((data as { contracts?: import("../types").ContractApiRow[] }).contracts ?? [])
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const client = getAdminClient();
        const res = await client.request<{ benefits: BenefitOption[] }>(BENEFITS_QUERY);
        const list = res.benefits ?? [];
        const vendors = [...new Set(list.map((b) => b.vendorName).filter(Boolean))] as string[];
        if (!cancelled) {
          setVendorOptions(vendors.sort());
        }
      } catch {
        if (!cancelled) setVendorOptions([]);
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

  const openUploadForm = useCallback(() => {
    setShowUploadForm(true);
    setUploadError(null);
    setUploadMessage(null);
  }, []);

  const closeUploadForm = useCallback(() => {
    setShowUploadForm(false);
  }, []);

  const handleUpload = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formEl = e.currentTarget;
      const fileInput = formEl.querySelector<HTMLInputElement>('input[name="file"]');
      const file = fileInput?.files?.[0];
      if (!file) return;

      setUploading(true);
      setUploadError(null);
      setUploadMessage(null);
      const formData = new FormData(formEl);
      if (selectedVendor) formData.set("vendorName", selectedVendor);

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
    },
    [loadContracts, selectedVendor],
  );

  return {
    loading,
    contractRows,
    filteredContracts,
    search,
    setSearch,
    filterByEmployeeId,
    setFilterByEmployeeId,
    employeeOptions,
    vendorOptions,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedVendor,
    setSelectedVendor,
    employeesLoading,
    showUploadForm,
    uploading,
    uploadError,
    uploadMessage,
    openUploadForm,
    closeUploadForm,
    handleUpload,
  };
}
