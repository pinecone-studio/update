"use client";

import { gql } from "graphql-request";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminClient, getApiBaseUrl, getApiErrorMessage } from "../../_lib/api";
import type { BenefitOption, Contract } from "../types";
import { mapRowsToContracts } from "./vendor-contracts-api";

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

export function useVendorContracts() {
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
        setShowUploadForm(false);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : String(err));
      } finally {
        setUploading(false);
      }
    },
    [loadContracts, selectedVendorBenefitId],
  );

  return {
    loading,
    contractRows,
    filteredContracts,
    search,
    setSearch,
    benefitOptions,
    selectedVendorBenefitId,
    setSelectedVendorBenefitId,
    benefitsLoading,
    showUploadForm,
    uploading,
    uploadError,
    uploadMessage,
    openUploadForm,
    closeUploadForm,
    handleUpload,
  };
}
