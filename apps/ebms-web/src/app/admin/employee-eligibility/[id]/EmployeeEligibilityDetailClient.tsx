/** @format */

"use client";

import { EmployeeEligibilityDetailHeader } from "./_components/EmployeeEligibilityDetailHeader";
import { BenefitsTable } from "./_components/BenefitsTable";
import { BenefitStatusModal } from "./_components/BenefitStatusModal";
import { useEmployeeEligibilityDetail } from "./_lib/useEmployeeEligibilityDetail";

export default function EmployeeEligibilityDetailClient() {
  const {
    id,
    loading,
    employee,
    activeBenefit,
    activeBenefitKey,
    draftStatusByKey,
    setDraftStatusByKey,
    draftReasonByKey,
    setDraftReasonByKey,
    savedReasonByKey,
    errorByKey,
    savingByKey,
    openBenefitModal,
    closeBenefitModal,
    handleSaveStatus,
  } = useEmployeeEligibilityDetail();

  if (!id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/70">
        Ажилтан олдсонгүй.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] animate-pulse px-6 pb-10 pt-10">
        <div className="mb-10 h-24 w-80 rounded-3xl bg-white/10" />
        <div className="h-[540px] rounded-[28px] bg-white/10" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/70">
        Ажилтан олдсонгүй.
      </div>
    );
  }

  const activeDraftStatus = activeBenefit
    ? (draftStatusByKey[activeBenefitKey ?? ""] ?? activeBenefit.status)
    : "ACTIVE";
  const activeDraftReason = activeBenefitKey
    ? (draftReasonByKey[activeBenefitKey] ?? "")
    : "";
  const activeError = activeBenefitKey
    ? (errorByKey[activeBenefitKey] ?? "")
    : "";
  const activeSavedReason = activeBenefitKey
    ? (savedReasonByKey[activeBenefitKey] ?? "")
    : "";
  const activeSaving = activeBenefitKey
    ? (savingByKey[activeBenefitKey] ?? false)
    : false;

  return (
    <>
      <div className="min-h-[80vh] px-[28px] pb-12 pt-[34px] text-white">
        <div className="mx-auto max-w-[1512px]">
          <EmployeeEligibilityDetailHeader
            employeeName={employee.name}
            employeeRole={employee.role}
          />

          <BenefitsTable
            employeeId={employee.id}
            benefits={employee.benefits}
            onOpenBenefitModal={openBenefitModal}
          />
        </div>
      </div>

      {activeBenefit && activeBenefitKey && (
        <BenefitStatusModal
          open
          benefit={activeBenefit}
          employeeName={employee.name}
          employeeRole={employee.role}
          draftStatus={activeDraftStatus}
          draftReason={activeDraftReason}
          error={activeError}
          savedReason={activeSavedReason}
          saving={activeSaving}
          onDraftStatusChange={(status) =>
            setDraftStatusByKey((prev) => ({
              ...prev,
              [activeBenefitKey]: status,
            }))
          }
          onDraftReasonChange={(reason) =>
            setDraftReasonByKey((prev) => ({
              ...prev,
              [activeBenefitKey]: reason,
            }))
          }
          onClose={closeBenefitModal}
          onSave={() =>
            void handleSaveStatus(
              activeBenefit.benefitId,
              activeBenefitKey,
              activeBenefit.reason,
            )
          }
        />
      )}
    </>
  );
}
