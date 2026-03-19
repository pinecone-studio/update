/** @format */

"use client";

import { FiCheck, FiClock, FiLock, FiStar } from "react-icons/fi";
import { BenefitPortfolio } from "@/app/_components/BenefitPortfolio";
import { EmployeeDashboardSkeleton } from "./components/EmployeeDashboardSkeleton";
import { ContractTaskCard } from "./components/ContractTaskCard";
import {
  EmployeeDashboardOverview,
  type EmployeeStatusFilter,
} from "./components/EmployeeDashboardOverview";
import { HelpFeedbackWidget } from "./components/HelpFeedbackWidget";
import { useEmployeeDashboardData } from "./_hooks/useEmployeeDashboardData";

export default function EmployeeDashboardPage() {
  const {
    me,
    loading,
    error,
    benefits,
    cachedBenefitCount,
    statusFilter,
    setStatusFilter,
    counts,
    filteredBenefits,
    orderedBenefits,
    contractTasksByBenefitId,
    selectedContractFileByRequestId,
    uploadingContractByRequestId,
    contractUploadErrorByRequestId,
    setSelectedContractFileByRequestId,
    handleRequestBenefit,
    handleViewContract,
    handleViewUploadedContract,
    handleUploadSignedContract,
  } = useEmployeeDashboardData();

  const filterItems = [
    {
      key: "ACTIVE" as const,
      count: counts.active,
      icon: <FiCheck size={16} />,
    },
    {
      key: "ELIGIBLE" as const,
      count: counts.eligible,
      icon: <FiStar size={16} />,
    },
    {
      key: "PENDING" as const,
      count: counts.pending,
      icon: <FiClock size={16} />,
    },
    {
      key: "LOCKED" as const,
      count: counts.locked,
      icon: <FiLock size={16} />,
    },
  ];

  const benefitsWithContractFlow = orderedBenefits.map((benefit) => {
    if (benefit.status !== "PENDING" || !benefit.benefitId) return benefit;
    const task = contractTasksByBenefitId[benefit.benefitId];
    if (!task) return benefit;

    return {
      ...benefit,
      footerActions: (
        <ContractTaskCard
          task={task}
          isUploading={uploadingContractByRequestId[task.requestId] ?? false}
          selectedFile={selectedContractFileByRequestId[task.requestId] ?? null}
          errorText={contractUploadErrorByRequestId[task.requestId]}
          onSelectFile={(requestId, file) =>
            setSelectedContractFileByRequestId((prev) => ({
              ...prev,
              [requestId]: file,
            }))
          }
          onUpload={(requestId) => {
            void handleUploadSignedContract(requestId);
          }}
        />
      ),
    };
  });

  const title =
    statusFilter === "ALL"
      ? "All Benefits"
      : `${statusFilter.charAt(0)}${statusFilter.slice(1).toLowerCase()} Benefits`;

  const subtitle =
    statusFilter === "ALL"
      ? "Showing all your benefits"
      : `Showing ${filteredBenefits.length} ${statusFilter.toLowerCase()} benefits`;

  return (
    <div className="flex min-h-screen w-full flex-col items-center px-0 py-2 sm:px-2 sm:py-4 lg:px-4 lg:py-6">
      <div className="flex w-full max-w-[1512px] min-w-0 flex-col">
        {loading ? (
          <EmployeeDashboardSkeleton benefitCount={cachedBenefitCount} />
        ) : (
          <>
            <EmployeeDashboardOverview
              meName={me?.name}
              error={error}
              activeCount={counts.active}
              pendingCount={counts.pending}
              statusFilter={statusFilter}
              filterItems={filterItems}
              onToggleStatus={(key: Exclude<EmployeeStatusFilter, "ALL">) =>
                setStatusFilter((prev) => (prev === key ? "ALL" : key))
              }
            />

            <section className="mt-2 w-full sm:mt-8 lg:mt-10">
              <div className=" sm:mb-6">
                <h2 className="text-[18px] font-semibold tracking-[-0.4px] text-white sm:text-[20px] sm:tracking-[-0.6px]">
                  {title}
                </h2>
                <p className="mt-1 text-[14px] text-white/45 sm:text-[15px]">
                  {subtitle}
                </p>
              </div>

              <BenefitPortfolio
                benefits={benefitsWithContractFlow}
                onRequestBenefit={handleRequestBenefit}
                onViewContract={handleViewContract}
                onViewUploadedContract={handleViewUploadedContract}
              />
            </section>
          </>
        )}
      </div>

      <HelpFeedbackWidget />
    </div>
  );
}
