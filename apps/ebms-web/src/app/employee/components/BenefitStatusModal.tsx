/** @format */

"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import { BenefitModalDetails } from "./benefit-modal/BenefitModalDetails";
import { MODAL_THEME, getRules } from "./benefit-modal/theme";

interface BenefitStatusModalProps {
  benefit: BenefitCardProps | null;
  onClose: () => void;
  onRequestBenefit?: (
    benefit: BenefitCardProps,
  ) => boolean | void | Promise<boolean | void>;
  onViewContract?: (benefit: BenefitCardProps) => void | Promise<void>;
  onViewUploadedContract?: (requestId: string) => void | Promise<void>;
}

export function BenefitStatusModal({
  benefit,
  onClose,
  onRequestBenefit,
  onViewContract,
  onViewUploadedContract,
}: BenefitStatusModalProps) {
  useEffect(() => {
    if (!benefit) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [benefit, onClose]);

  if (!benefit) return null;

  const theme = MODAL_THEME[benefit.status];
  const rules = getRules(benefit);
  const canRequest =
    (benefit.status === "ELIGIBLE" || benefit.status === "REJECTED") &&
    !!onRequestBenefit;

  const onRequestClick = () => {
    onRequestBenefit?.(benefit);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-md dark:bg-[rgba(15,23,43,0.55)]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="benefit-status-modal-title"
    >
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div
          className={`relative flex w-full max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[22px] border sm:max-w-[500px] ${theme.frame}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`px-3 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-6 ${theme.header}`}
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-slate-200 bg-slate-100 text-slate-700 sm:h-14 sm:w-14 dark:border-white/15 dark:bg-white/5 dark:text-white/75">
                  <div className="h-5 w-5 sm:h-6 sm:w-6">{benefit.icon}</div>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      id="benefit-status-modal-title"
                      className="text-[18px] font-bold tracking-[0.2px] text-slate-900 sm:text-[20px] dark:text-white"
                    >
                      {benefit.name}
                    </h2>
                  </div>
                  <p className="text-[13px] font-normal leading-5 tracking-[-0.15px] text-slate-600 sm:text-[14px] dark:text-white/50">
                    {benefit.category} benefit
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-[14px] border border-slate-200 bg-slate-100 text-slate-600 transition hover:bg-slate-200 sm:h-11 sm:w-11 dark:border-white/10 dark:bg-white/6 dark:text-white/70 dark:hover:bg-white/12"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          <div
            className={`min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-3 sm:px-5 sm:pb-4 ${theme.body}`}
          >
            <div className="space-y-3">
              <BenefitModalDetails
                benefit={benefit}
                theme={{
                  section: theme.section,
                  summary: theme.summary,
                  rulePass: theme.rulePass,
                  ruleFail: theme.ruleFail,
                }}
                rules={rules}
                onViewContract={onViewContract}
                onViewUploadedContract={onViewUploadedContract}
              />
            </div>
          </div>

          {canRequest ? (
            <div className={`border-t px-3 py-3 sm:px-5 sm:py-4 ${theme.footer}`}>
              <button
                type="button"
                onClick={onRequestClick}
                className="h-[50px] w-full rounded-2xl border border-blue-300 bg-blue-600 px-6 text-[15px] font-semibold text-white transition hover:bg-blue-500 sm:h-[56px] sm:text-[16px] dark:border-[#4d78ff] dark:bg-[#3d78ff] dark:hover:bg-[#5285ff]"
              >
                Request benefit
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
