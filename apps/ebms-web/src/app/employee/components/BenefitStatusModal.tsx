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
  onRequestBenefit?: (benefit: BenefitCardProps) => void;
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
      ? "max-w-[500px] rounded-[20px]"
      : benefit.status === "ELIGIBLE"
        ? "h-[min(669.8px,92vh)] max-w-[740px] rounded-[17.21px]"
        : "h-[min(86vh,760px)] max-w-[760px] rounded-[16.73px]";

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
            className={`px-4 pb-4 pt-6 sm:px-5 sm:pb-4 sm:pt-6 ${theme.header}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-white/15 bg-white/5 text-white/75">
                  <div className="h-6 w-6">{benefit.icon}</div>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      id="benefit-status-modal-title"
                      className="text-[20px] font-bold tracking-[0.4px] text-white"
                    >
                      {benefit.name}
                    </h2>
                  </div>
                  <p className="text-[14px] font-normal leading-5 tracking-[-0.15px] text-white/50">
                    {benefit.category} benefit
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`grid h-11 w-11 place-items-center rounded-[14px] border text-white/70 transition ${theme.closeBtn}`}
                aria-label="Close"
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          <div
            className={`${isActive ? "px-4 pb-4 pt-3 sm:px-5 sm:pb-5" : "min-h-0 flex-1 px-4 pb-4 pt-3 sm:px-5 sm:pb-5"} ${theme.body}`}
          >
            <div
              className={`${isActive ? "space-y-3" : "h-full space-y-3 overflow-y-auto pr-1"}`}
            >
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

          <div className="border-t border-white/10 bg-[#101a34]/85 px-4 py-4 sm:px-5">
            <div className="flex gap-3">
              {canRequest ? (
                <button
                  type="button"
                  onClick={onRequestClick}
                  className="h-[56px] rounded-2xl border border-[#4d78ff] bg-[#3d78ff] px-6 text-[16px] font-semibold text-white transition hover:bg-[#5285ff]"
                >
                  Request benefit
                </button>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="h-[50px] w-full rounded-2xl border border-white/20 bg-white/10 text-center text-[18px] font-semibold text-white transition hover:bg-white/15"
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
