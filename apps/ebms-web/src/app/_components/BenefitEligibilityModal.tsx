/** @format */

"use client";

import { useState, useEffect } from "react";
import { FiCheck, FiX, FiExternalLink, FiInfo } from "react-icons/fi";
import type { BenefitCardProps, EligibilityRule } from "./BenefitCard";

const STATUS_STYLES: Record<BenefitCardProps["status"], string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400",
  ELIGIBLE: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
  LOCKED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  PENDING:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
};

interface BenefitEligibilityModalProps {
  benefit: BenefitCardProps | null;
  onClose: () => void;
  onRequestBenefit?: (benefit: BenefitCardProps) => void;
  onViewContract?: (benefit: BenefitCardProps) => void | Promise<void>;
  /** When true, open with contract acceptance step visible (e.g. when clicking Request benefit from card) */
  initialOpenContractStep?: boolean;
}

export function BenefitEligibilityModal({
  benefit,
  onClose,
  onRequestBenefit,
  onViewContract,
  initialOpenContractStep = false,
}: BenefitEligibilityModalProps) {
  const [showContractStep, setShowContractStep] = useState(
    initialOpenContractStep,
  );
  const [contractAccepted, setContractAccepted] = useState(false);

  // Reset or set contract step when benefit or initialOpenContractStep changes
  useEffect(() => {
    setShowContractStep(initialOpenContractStep);
    setContractAccepted(false);
  }, [benefit?.benefitId, initialOpenContractStep]);

  if (benefit == null) return null;

  const rules = benefit.eligibilityRules ?? [
    {
      rule: benefit.eligibilityCriteria,
      passed: benefit.status !== "LOCKED",
      detail: benefit.lockReason,
    },
  ];

  const canRequest =
    (benefit.status === "ELIGIBLE" || benefit.status === "REJECTED") &&
    onRequestBenefit;

  const needsContractAcceptance =
    canRequest && (benefit.requiresContract || benefit.contractLink);

  const handleRequestClick = () => {
    if (needsContractAcceptance) {
      setShowContractStep(true);
      setContractAccepted(false);
    } else {
      onRequestBenefit?.(benefit);
    }
  };

  const handleSubmitWithContract = () => {
    if (contractAccepted) {
      onRequestBenefit?.(benefit);
      setShowContractStep(false);
      setContractAccepted(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="eligibility-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl max-h-[90vh] overflow-hidden flex flex-col dark:bg-[#1A2536] dark:border-[#2d3a4d]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-200 dark:border-[#2d3a4d]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                id="eligibility-modal-title"
                className="text-xl font-bold text-slate-900 dark:text-white"
              >
                {benefit.name}
              </h2>
              <div className="flex items-center gap-1.5">
                {benefit.status === "ACTIVE" && rules.length > 0 && (
                  <span className="relative group">
                    <FiInfo
                      size={14}
                      className="text-slate-500 hover:text-slate-700 cursor-help dark:text-slate-400 dark:hover:text-slate-200"
                      aria-label="Requirements to maintain benefit"
                    />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2.5 py-2 w-48 rounded-lg bg-slate-800 text-white text-xs font-normal shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                      <p className="font-semibold mb-1.5">
                        To maintain this benefit
                      </p>
                      <ul className="space-y-1 list-disc list-inside">
                        {rules.slice(0, 4).map((r, i) => (
                          <li key={i}>{r.rule}</li>
                        ))}
                      </ul>
                    </span>
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${STATUS_STYLES[benefit.status]}`}
                >
                  {benefit.status}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
              {benefit.category}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-[#94A3B8] dark:hover:bg-[#2d3a4d] dark:hover:text-white shrink-0"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {showContractStep && needsContractAcceptance ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-950/30">
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                Accept vendor contract before requesting
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                You must read and accept the vendor contract before your request
                can be submitted.
              </p>
              {benefit.contractLink ? (
                <a
                  href={benefit.contractLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 dark:text-blue-400"
                >
                  View vendor contract
                  <FiExternalLink size={14} />
                </a>
              ) : benefit.requiresContract &&
                benefit.benefitId &&
                onViewContract ? (
                <button
                  type="button"
                  onClick={() => onViewContract(benefit)}
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 dark:text-blue-400"
                >
                  View vendor contract
                  <FiExternalLink size={14} />
                </button>
              ) : null}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contractAccepted}
                  onChange={(e) => setContractAccepted(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  I have read and accept the terms of the vendor contract.
                </span>
              </label>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleSubmitWithContract}
                  disabled={!contractAccepted}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Submit request
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowContractStep(false);
                    setContractAccepted(false);
                  }}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {!showContractStep && benefit.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {benefit.description}
              </p>
            </div>
          )}

          {!showContractStep && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Subsidy
                  </h3>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {benefit.subsidyPercentage ?? "—"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Vendor
                  </h3>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {benefit.vendorDetails ?? "—"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Eligibility criteria
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {benefit.eligibilityCriteria}
                </p>
              </div>

              {benefit.contractLink != null ? (
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Vendor contract
                  </h3>
                  <a
                    href={benefit.contractLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View vendor contract
                    <FiExternalLink size={14} />
                  </a>
                </div>
              ) : benefit.requiresContract &&
                benefit.benefitId &&
                onViewContract ? (
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Vendor contract
                  </h3>
                  <button
                    type="button"
                    onClick={() => onViewContract(benefit)}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View vendor contract
                    <FiExternalLink size={14} />
                  </button>
                </div>
              ) : null}

              {(benefit.status === "ACTIVE" &&
                benefit.benefitStartDate != null &&
                benefit.benefitStartDate !== "") ||
              (benefit.benefitEndDate != null &&
                benefit.benefitEndDate !== "") ? (
                <div className="grid grid-cols-2 gap-4">
                  {benefit.status === "ACTIVE" &&
                  benefit.benefitStartDate != null &&
                  benefit.benefitStartDate !== "" ? (
                    <div>
                      <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        Benefit started
                      </h3>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {benefit.benefitStartDate}
                      </p>
                    </div>
                  ) : null}
                  {benefit.benefitEndDate != null &&
                  benefit.benefitEndDate !== "" ? (
                    <div>
                      <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        Benefit ends
                      </h3>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {benefit.benefitEndDate}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {benefit.status === "LOCKED" && benefit.lockReason && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 dark:bg-amber-950/30 dark:border-amber-800/50">
                  <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1 dark:text-amber-400">
                    Why it&apos;s locked
                  </h3>
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    {benefit.lockReason}
                  </p>
                </div>
              )}

              {benefit.status === "REJECTED" && benefit.rejectReason && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-950/30 dark:border-red-800/50">
                  <h3 className="text-xs font-semibold text-red-800 uppercase tracking-wide mb-1 dark:text-red-400">
                    Rejection reason
                  </h3>
                  <p className="text-sm text-red-900 dark:text-red-200">
                    {benefit.rejectReason}
                  </p>
                </div>
              )}

              {rules.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Eligibility rules
                  </h3>
                  <div className="space-y-2">
                    {rules.map((r: EligibilityRule, i: number) => (
                      <RuleRow key={i} rule={r} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-5 pt-4 border-t border-slate-200 dark:border-[#2d3a4d] flex flex-col gap-2">
          {canRequest && !showContractStep && (
            <button
              type="button"
              onClick={handleRequestClick}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Request benefit
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
              canRequest
                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
                : "bg-slate-800 hover:bg-slate-700 text-white dark:bg-[#0f172a] dark:hover:bg-[#1e293b]"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RuleRow({ rule }: { rule: EligibilityRule }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 dark:bg-[#0f172a]/50 dark:border-[#2d3a4d]">
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          rule.passed
            ? "bg-green-100 text-green-600 dark:bg-[#4CAF50]/20 dark:text-[#4CAF50]"
            : "bg-red-100 text-red-600 dark:bg-[#F44336]/20 dark:text-[#F44336]"
        }`}
      >
        {rule.passed ? <FiCheck size={16} /> : <FiX size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {rule.rule}
        </p>
        {rule.detail != null && (
          <p className="text-xs text-slate-600 mt-0.5 dark:text-[#94A3B8]">
            {rule.detail}
          </p>
        )}
        <span
          className={`inline-block mt-1 text-xs font-semibold ${
            rule.passed
              ? "text-green-600 dark:text-[#4CAF50]"
              : "text-red-600 dark:text-[#F44336]"
          }`}
        >
          {rule.passed ? "PASS" : "FAIL"}
        </span>
      </div>
    </div>
  );
}
