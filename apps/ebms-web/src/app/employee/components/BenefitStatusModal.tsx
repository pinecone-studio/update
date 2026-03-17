/** @format */

"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import { BenefitModalDetails } from "./benefit-modal/BenefitModalDetails";
import { MODAL_THEME, STATUS_BADGE, getRules } from "./benefit-modal/theme";

interface BenefitStatusModalProps {
  benefit: BenefitCardProps | null;
  onClose: () => void;
  onRequestBenefit?: (
    benefit: BenefitCardProps,
  ) => boolean | void | Promise<boolean | void>;
  onViewContract?: (benefit: BenefitCardProps) => void | Promise<void>;
}

export function BenefitStatusModal({
  benefit,
  onClose,
  onRequestBenefit,
  onViewContract,
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
  const isActive = benefit.status === "ACTIVE";
  const canRequest =
    (benefit.status === "ELIGIBLE" || benefit.status === "REJECTED") &&
    !!onRequestBenefit;

  const onRequestClick = () => {
    onRequestBenefit?.(benefit);
    onClose();
  };

  const dialogSizeClass =
    benefit.status === "ACTIVE" || benefit.status === "PENDING"
      ? "max-w-[calc(100vw-24px)] sm:max-w-[500px] rounded-[20px]"
      : benefit.status === "ELIGIBLE"
        ? "h-[min(760px,92vh)] max-w-[calc(100vw-24px)] sm:max-w-[500px] rounded-[17.21px]"
        : "h-[min(760px,92vh)] max-w-[calc(100vw-24px)] sm:max-w-[500px] rounded-[16.73px]";

  return (
    <div
      className="fixed inset-0 z-[100] bg-[rgba(15,23,43,0.55)] backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="benefit-status-modal-title"
    >
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div
          className={`relative flex w-full flex-col overflow-hidden border ${dialogSizeClass} ${theme.frame}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`px-3 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-6 ${theme.header}`}
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-white/15 bg-white/5 text-white/75 sm:h-14 sm:w-14">
                  <div className="h-5 w-5 sm:h-6 sm:w-6">{benefit.icon}</div>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      id="benefit-status-modal-title"
                      className="text-[18px] font-bold tracking-[0.2px] text-white sm:text-[20px]"
                    >
                      {benefit.name}
                    </h2>
                  </div>
                  <p className="text-[13px] font-normal leading-5 tracking-[-0.15px] text-white/50 sm:text-[14px]">
                    {benefit.category} benefit
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`grid h-10 w-10 place-items-center rounded-[14px] border text-white/70 transition sm:h-11 sm:w-11 ${theme.closeBtn}`}
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          <div
            className={`${isActive ? "px-3 pb-3 pt-3 sm:px-5 sm:pb-5" : "min-h-0 flex-1 px-3 pb-3 pt-3 sm:px-5 sm:pb-4"} ${theme.body}`}
          >
            <div className={`${isActive ? "space-y-3" : "h-full space-y-3"}`}>
              <BenefitModalDetails
                benefit={benefit}
                theme={{
                  section: theme.section,
                  rulePass: theme.rulePass,
                  ruleFail: theme.ruleFail,
                }}
                rules={rules}
                onViewContract={onViewContract}
              />
            </div>
          </div>

          <div className={`border-t px-3 py-3 sm:px-5 sm:py-4 ${theme.footer}`}>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              {canRequest ? (
                <button
                  type="button"
                  onClick={onRequestClick}
                  className="h-[50px] rounded-2xl border border-[#4d78ff] bg-[#3d78ff] px-6 text-[15px] font-semibold text-white transition hover:bg-[#5285ff] sm:h-[56px] sm:text-[16px]"
                >
                  Request benefit
                </button>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="h-[46px] w-full rounded-2xl border border-white/20 bg-white/10 text-center text-[16px] font-semibold text-white transition hover:bg-white/15 sm:h-[50px] sm:text-[18px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
