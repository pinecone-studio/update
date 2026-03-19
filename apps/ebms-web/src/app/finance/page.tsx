/** @format */
"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
    () =>
      statCards
        .filter((card) => card.key !== "budget")
        .find((card) => card.key === selectedCardKey) ?? null,
    [selectedCardKey, statCards]
  );

  const visibleStatCards = useMemo(
    () => statCards.filter((card) => card.key !== "budget"),
    [statCards]
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

  const statusCounts = useMemo(() => {
    const counts = {
      ADMIN_APPROVED: 0,
      APPROVED: 0,
      REJECTED: 0,
      ALL: requests.length,
    };

    for (const request of requests) {
      const status = (request.status || "PENDING").toUpperCase();
      if (status === "ADMIN_APPROVED") counts.ADMIN_APPROVED += 1;
      if (status === "APPROVED") counts.APPROVED += 1;
      if (status === "REJECTED") counts.REJECTED += 1;
    }
    return counts;
  }, [requests]);

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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-stretch">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleStatCards.map((card) => (
            <FinanceStatCard
              key={card.key}
              card={card}
              onClick={() => {
                if (card.key === "contracts") {
                  router.push("/finance/contracts");
                  return;
                }
                setSelectedCardKey(card.key);
              }}
            />
          ))}
        </div>

        <div className="xl:h-full">
          <FinanceRightWidgets requests={requests} />
        </div>
      </section>

      <section>
        <FinanceRequestsSection
          requests={visibleRequests}
          statusCounts={statusCounts}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          employees={employees}
          benefitSubsidyMap={benefitSubsidyMap}
          submittingRequestId={submittingRequestId}
          onApprove={(id) => void handleDecision(id, true)}
          onReject={handleRejectClick}
          onViewTemplate={handleViewTemplate}
        />
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
