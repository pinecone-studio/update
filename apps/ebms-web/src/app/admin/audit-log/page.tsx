"use client";

import { AuditLogSkeleton } from "../components/AuditLogSkeleton";
import { AuditLogHeader } from "./_components/AuditLogHeader";
import { AuditLogFilters } from "./_components/AuditLogFilters";
import { AuditLogTable } from "./_components/AuditLogTable";
import { useAuditLog } from "./_lib/useAuditLog";

export default function AuditLogPage() {
  const {
    loading,
    error,
    cachedEntryCount,
    filteredEntries,
    benefitOptions,
    actionOptions,
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
  } = useAuditLog();

  if (loading) {
    return <AuditLogSkeleton rowCount={cachedEntryCount} />;
  }

  return (
    <div className="space-y-6">
      <AuditLogHeader />

      <AuditLogFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        logIdFilter={logIdFilter}
        onLogIdFilterChange={setLogIdFilter}
        benefitFilter={benefitFilter}
        onBenefitFilterChange={setBenefitFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        benefitOptions={benefitOptions}
        actionOptions={actionOptions}
        onClearAll={clearFilters}
      />

      {error && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700 dark:border-red-500/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <AuditLogTable entries={filteredEntries} />
    </div>
  );
}
