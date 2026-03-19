/** @format */

"use client";

import { FiCheck, FiClock, FiLock, FiStar } from "react-icons/fi";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import { BenefitPortfolio } from "@/app/_components/BenefitPortfolio";
import { EmployeeDashboardSkeleton } from "./components/EmployeeDashboardSkeleton";
import { ContractTaskCard } from "./components/ContractTaskCard";
import {
  EmployeeDashboardOverview,
  type EmployeeStatusFilter,
} from "./components/EmployeeDashboardOverview";
import { HelpFeedbackWidget } from "./components/HelpFeedbackWidget";
import { useEmployeeDashboardData } from "./_hooks/useEmployeeDashboardData";
import { useCallback, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";

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
    requestBenefitDirect,
    handleViewContract,
    handleViewUploadedContract,
    handleUploadSignedContract,
  } = useEmployeeDashboardData();

  const [confirmBenefit, setConfirmBenefit] =
    useState<BenefitCardProps | null>(null);
  const confirmResolver = useRef<((value: boolean) => void) | null>(null);

  const handleRequestBenefit = useCallback(
    (benefit: BenefitCardProps) => {
      return new Promise<boolean>((resolve) => {
        confirmResolver.current = resolve;
        setConfirmBenefit(benefit);
      });
    },
    [],
  );

  const handleConfirmRequest = useCallback(async () => {
    if (!confirmBenefit) return;
    const benefit = confirmBenefit;
    setConfirmBenefit(null);
    const ok = await requestBenefitDirect(benefit);
    confirmResolver.current?.(ok !== false);
    confirmResolver.current = null;
  }, [confirmBenefit, requestBenefitDirect]);

  const handleCancelRequest = useCallback(() => {
    setConfirmBenefit(null);
    confirmResolver.current?.(false);
    confirmResolver.current = null;
  }, []);

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

    <AlertDialog
      open={!!confirmBenefit}
      onOpenChange={(open) => {
        if (!open) handleCancelRequest();
      }}
    >
      <AlertDialogContent className="z-[120]">
        <AlertDialogHeader>
          <AlertDialogTitle>Request benefit</AlertDialogTitle>
          <AlertDialogDescription>
            Та{" "}
            <span className="font-semibold text-white">
              "{confirmBenefit?.name}"
            </span>{" "}
            benefit‑ийг хүсэхдээ итгэлтэй байна уу?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#D1DBEF] dark:hover:bg-[#24364F]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmRequest}
            className="rounded-lg bg-[#0057ADCC] px-4 py-2 font-medium text-white transition hover:bg-[#3E82F7] dark:bg-[#0057ADCC] dark:hover:bg-[#3E82F7]"
          >
            Request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
  );
}
