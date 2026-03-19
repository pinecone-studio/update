"use client";

import { VendorContractsSkeleton } from "../components/VendorContractsSkeleton";
import { VendorContractStatsCards } from "./_components/VendorContractStatsCards";
import { VendorContractTableSection } from "./_components/VendorContractTableSection";
import { VendorUploadContractModal } from "./_components/VendorUploadContractModal";
import { useVendorContracts } from "./_lib/useVendorContracts";

export function VendorContracts() {
  const {
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
  } = useVendorContracts();

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

      <VendorContractStatsCards contracts={contractRows} />

      <VendorUploadContractModal
        open={showUploadForm}
        benefitOptions={benefitOptions}
        selectedBenefitId={selectedVendorBenefitId}
        onBenefitChange={setSelectedVendorBenefitId}
        benefitsLoading={benefitsLoading}
        uploading={uploading}
        onClose={closeUploadForm}
        onSubmit={handleUpload}
      />

      <VendorContractTableSection
        contracts={filteredContracts}
        search={search}
        onSearchChange={setSearch}
        onAddContract={openUploadForm}
      />
    </div>
  );
}
