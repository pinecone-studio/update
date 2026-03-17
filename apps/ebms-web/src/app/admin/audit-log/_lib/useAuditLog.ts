"use client";

import { gql } from "graphql-request";
import { useEffect, useMemo, useState } from "react";
import { getAdminClient, getApiErrorMessage } from "../../_lib/api";
import type { AuditEntry } from "./types";

const AUDIT_LOG_QUERY = gql`
  query AuditLogForAdmin {
    auditLog(filters: {}) {
      id
      employeeId
      benefitId
      oldStatus
      newStatus
      computedAt
      triggeredBy
      createdAt
    }
  }
`;

const EMPLOYEES_QUERY = gql`
  query AuditEmployees {
    employees {
      id
      name
    }
  }
`;

const BENEFITS_QUERY = gql`
  query AuditBenefits {
    benefits {
      id
      name
    }
  }
`;

export function useAuditLog() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [logIdFilter, setLogIdFilter] = useState("");
  const [benefitFilter, setBenefitFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | AuditEntry["status"]
  >("ALL");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const client = getAdminClient();
        const [auditRes, employeesRes, benefitsRes] = await Promise.all([
          client.request<{
            auditLog: Array<{
              id: string;
              employeeId: string;
              benefitId: string;
              oldStatus?: string | null;
              newStatus: string;
              computedAt: string;
              triggeredBy?: string | null;
              createdAt?: string | null;
            }>;
          }>(AUDIT_LOG_QUERY),
          client.request<{
            employees: Array<{ id: string; name?: string | null }>;
          }>(EMPLOYEES_QUERY),
          client.request<{ benefits: Array<{ id: string; name: string }> }>(
            BENEFITS_QUERY,
          ),
        ]);

        if (cancelled) return;

        const employeeNameById = new Map(
          (employeesRes.employees ?? []).map((e) => [
            e.id,
            e.name?.trim() || e.id,
          ]),
        );
        const benefitNameById = new Map(
          (benefitsRes.benefits ?? []).map((b) => [b.id, b.name]),
        );

        const mapped: AuditEntry[] = (auditRes.auditLog ?? []).map((item) => {
          const nextStatus = (
            item.newStatus ?? "LOCKED"
          ).toUpperCase() as AuditEntry["status"];
          const prev = (item.oldStatus ?? "").toUpperCase().trim();
          const action = prev
            ? `Status ${prev} -> ${nextStatus}`
            : "Override Granted";
          return {
            id: item.id,
            timestamp: item.computedAt || item.createdAt || "",
            action,
            status: nextStatus,
            employee: employeeNameById.get(item.employeeId) ?? item.employeeId,
            employeeId: item.employeeId,
            benefit: benefitNameById.get(item.benefitId) ?? item.benefitId,
            performedBy: item.triggeredBy ?? "system",
            details: prev
              ? "Eligibility status updated."
              : "Manual eligibility override recorded.",
            reason: "",
            contractStartDate: "—",
            contractEndDate: "—",
          };
        });

        setEntries(mapped);
      } catch (e) {
        if (!cancelled) {
          setEntries([]);
          setError(getApiErrorMessage(e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const benefitOptions = useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.benefit))),
    [entries],
  );
  const actionOptions = useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.action))),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const normalizedLogId = logIdFilter.trim().toLowerCase();
      if (
        normalizedSearch &&
        !(
          entry.employee.toLowerCase().includes(normalizedSearch) ||
          entry.employeeId.toLowerCase().includes(normalizedSearch) ||
          entry.benefit.toLowerCase().includes(normalizedSearch) ||
          entry.action.toLowerCase().includes(normalizedSearch) ||
          entry.status.toLowerCase().includes(normalizedSearch) ||
          entry.id.toLowerCase().includes(normalizedSearch) ||
          entry.performedBy.toLowerCase().includes(normalizedSearch)
        )
      ) {
        return false;
      }

      if (benefitFilter !== "ALL" && entry.benefit !== benefitFilter)
        return false;
      if (normalizedLogId && !entry.id.toLowerCase().includes(normalizedLogId))
        return false;
      if (actionFilter !== "ALL" && entry.action !== actionFilter) return false;
      if (statusFilter !== "ALL" && entry.status !== statusFilter) return false;

      if (!dateFrom && !dateTo) return true;
      const entryDate = new Date(entry.timestamp);
      if (Number.isNaN(entryDate.getTime())) return false;

      if (dateFrom) {
        const from = new Date(`${dateFrom}T00:00:00`);
        if (entryDate < from) return false;
      }
      if (dateTo) {
        const to = new Date(`${dateTo}T23:59:59`);
        if (entryDate > to) return false;
      }
      return true;
    });
  }, [
    entries,
    searchTerm,
    logIdFilter,
    benefitFilter,
    actionFilter,
    statusFilter,
    dateFrom,
    dateTo,
  ]);

  const activeFilters = useMemo(
    () =>
      [
        searchTerm.trim() ? `Search: ${searchTerm.trim()}` : null,
        logIdFilter.trim() ? `Log ID: ${logIdFilter.trim()}` : null,
        benefitFilter !== "ALL" ? `Benefit: ${benefitFilter}` : null,
        actionFilter !== "ALL" ? `Action: ${actionFilter}` : null,
        statusFilter !== "ALL" ? `Status: ${statusFilter}` : null,
        dateFrom ? `From: ${dateFrom}` : null,
        dateTo ? `To: ${dateTo}` : null,
      ].filter(Boolean) as string[],
    [
      searchTerm,
      logIdFilter,
      benefitFilter,
      actionFilter,
      statusFilter,
      dateFrom,
      dateTo,
    ],
  );

  const clearFilters = () => {
    setSearchTerm("");
    setLogIdFilter("");
    setBenefitFilter("ALL");
    setActionFilter("ALL");
    setStatusFilter("ALL");
    setDateFrom("");
    setDateTo("");
  };

  return {
    loading,
    error,
    entries,
    filteredEntries,
    benefitOptions,
    actionOptions,
    activeFilters,
    searchTerm,
    setSearchTerm,
    logIdFilter,
    setLogIdFilter,
    benefitFilter,
    setBenefitFilter,
    statusFilter,
    setStatusFilter,
    actionFilter,
    setActionFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    clearFilters,
  };
}
