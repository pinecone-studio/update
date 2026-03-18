/** @format */
"use client";

import { useCallback, useMemo, useState } from "react";
import { FinanceDashboardSkeleton } from "./components/FinanceDashboardSkeleton";
import { FinanceStatCard } from "./components/FinanceStatCard";
import { FinanceStatCardModal } from "./components/FinanceStatCardModal";
import { FinanceRequestsSection } from "./components/FinanceRequestsSection";
import FinanceRightWidgets from "./components/FinanceRightWidgets";
import { RejectRequestModal } from "./components/RejectRequestModal";
import {
  confirmBenefitRequest,
  fetchBenefitRequestContractHtml,
  getApiErrorMessage,
  getFinanceClient,
} from "./_lib/api";
import { useFinanceDashboard } from "./_lib/useFinanceDashboard";

export default function FinancePage() {
  const {
    loading,
    error,
    setError,
    requests,
    employees,
    benefitSubsidyMap,
    statCards,
    loadData,
  } = useFinanceDashboard();

  const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "PENDING" | "ADMIN_APPROVED" | "APPROVED" | "REJECTED" | undefined
  >("ADMIN_APPROVED");
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(
    null
  );
  const [submittingRequestId, setSubmittingRequestId] = useState<string | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const selectedCard = useMemo(
    () => statCards.find((card) => card.key === selectedCardKey) ?? null,
    [selectedCardKey, statCards]
  );

  const visibleRequests = useMemo(
    () =>
      statusFilter
        ? requests.filter(
            (r) => (r.status || "PENDING").toUpperCase() === statusFilter
          )
        : requests,
    [requests, statusFilter]
  );

  const handleDecision = useCallback(
    async (
      requestId: string,
      accepted: boolean,
      rejectReason?: string
    ) => {
      setSubmittingRequestId(requestId);
      setError(null);
      try {
        await confirmBenefitRequest(
          getFinanceClient(),
          requestId,
          accepted,
          accepted ? undefined : rejectReason?.trim() || undefined
        );
        await loadData();
      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        setSubmittingRequestId(null);
      }
    },
    [loadData, setError]
  );

  const handleViewTemplate = useCallback(async (requestId: string) => {
    try {
      const html = await fetchBenefitRequestContractHtml(
        getFinanceClient(),
        requestId
      );
      const popup = window.open("", "_blank", "noopener,noreferrer");
      if (popup) {
        popup.document.open();
        popup.document.write(html);
        popup.document.close();
      }
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }, [setError]);

  const handleRejectClick = useCallback((requestId: string) => {
    setRejectingRequestId(requestId);
    setRejectionReason("");
  }, []);

  const handleRejectConfirm = useCallback(() => {
    if (!rejectingRequestId) return;
    void handleDecision(rejectingRequestId, false, rejectionReason);
    setRejectingRequestId(null);
    setRejectionReason("");
  }, [rejectingRequestId, rejectionReason, handleDecision]);

  if (loading) return <FinanceDashboardSkeleton />;

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-5 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <FinanceStatCard
            key={card.key}
            card={card}
            onClick={() => setSelectedCardKey(card.key)}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FinanceRequestsSection
            requests={visibleRequests}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            employees={employees}
            benefitSubsidyMap={benefitSubsidyMap}
            submittingRequestId={submittingRequestId}
            onApprove={(id) => void handleDecision(id, true)}
            onReject={handleRejectClick}
            onViewTemplate={handleViewTemplate}
          />
        </div>

        <div className="lg:col-span-1">
          <FinanceRightWidgets />
        </div>
      </section>

      {selectedCard && (
        <FinanceStatCardModal
          card={selectedCard}
          onClose={() => setSelectedCardKey(null)}
        />
      )}

      {rejectingRequestId !== null && (
        <RejectRequestModal
          rejectionReason={rejectionReason}
          onRejectionReasonChange={setRejectionReason}
          onCancel={() => {
            setRejectingRequestId(null);
            setRejectionReason("");
          }}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  );
}
