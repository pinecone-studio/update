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
  } = useAuditLog();

  if (loading) {
    return <AuditLogSkeleton />;
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

      <p className="text-5 text-slate-600 dark:text-[#A7B6D3]">
        Showing {filteredEntries.length} of {entries.length} entries
      </p>

      {error && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filterLabel) => (
            <span
              key={filterLabel}
              className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:border-[#4B5D83] dark:bg-[#334160] dark:text-[#D4DEEF]"
            >
              {filterLabel}
            </span>
          ))}
        </div>
      )}

      <AuditLogTable entries={filteredEntries} />
    </div>
  );
}
