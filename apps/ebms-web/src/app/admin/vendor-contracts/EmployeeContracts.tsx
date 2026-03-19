"use client";

import { VendorContractsSkeleton } from "../components/VendorContractsSkeleton";
import { ContractStatsCards } from "./_components/ContractStatsCards";
import { ContractTableSection } from "./_components/ContractTableSection";
import { EmployeeUploadContractModal } from "./_components/EmployeeUploadContractModal";
import { useEmployeeContracts } from "./_lib/useEmployeeContracts";

export function EmployeeContracts() {
  const {
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
  } = useEmployeeContracts();

  if (loading) {
    return <VendorContractsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {uploadError && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700">
          {uploadError}
        </p>
      )}
      {uploadMessage && (
        <p className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-5 text-green-800">
          {uploadMessage}
        </p>
      )}

      <ContractStatsCards contracts={contractRows} />

      <EmployeeUploadContractModal
        open={showUploadForm}
        employeeOptions={employeeOptions}
        selectedEmployeeId={selectedEmployeeId}
        onEmployeeChange={setSelectedEmployeeId}
        vendorOptions={vendorOptions}
        selectedVendor={selectedVendor}
        onVendorChange={setSelectedVendor}
        employeesLoading={employeesLoading}
        uploading={uploading}
        onClose={closeUploadForm}
        onSubmit={handleUpload}
      />

      <ContractTableSection
        contracts={filteredContracts}
        search={search}
        onSearchChange={setSearch}
        filterByEmployeeId={filterByEmployeeId}
        onFilterByEmployeeChange={setFilterByEmployeeId}
        employeeOptions={employeeOptions}
        onAddContract={openUploadForm}
      />
    </div>
  );
}
