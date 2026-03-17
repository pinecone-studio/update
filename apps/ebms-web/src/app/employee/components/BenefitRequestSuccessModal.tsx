/** @format */

"use client";

import { FiCheck, FiX } from "react-icons/fi";

interface BenefitRequestSuccessModalProps {
  benefitName?: string;
  onClose: () => void;
}

export function BenefitRequestSuccessModal({
  benefitName,
  onClose,
}: BenefitRequestSuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-[110] bg-[rgba(15,23,43,0.62)] backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="benefit-request-success-title"
    >
      <div className="flex min-h-full items-center justify-center p-3">
        <div
          className="relative w-full max-w-[640px] overflow-hidden rounded-[28px] border border-[#d58b38]/35 bg-[radial-gradient(circle_at_50%_45%,rgba(255,197,94,0.16),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(255,170,58,0.12),transparent_48%),linear-gradient(180deg,rgba(64,42,30,0.98)_0%,rgba(49,33,26,0.98)_100%)] px-5 py-7 shadow-[0_24px_80px_rgba(32,18,8,0.55)] sm:px-8 sm:py-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-white/45 transition hover:bg-[#d58b38]/10 hover:text-[#ffd79d]"
            aria-label="Close"
          >
            <FiX size={22} />
          </button>

          <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full border border-[#d89a42]/60 bg-[radial-gradient(circle_at_50%_35%,rgba(255,205,114,0.26),rgba(89,58,33,0.32)_65%,rgba(58,39,26,0.18)_100%)] shadow-[0_0_0_1px_rgba(216,154,66,0.12),0_18px_60px_rgba(73,40,15,0.28)]">
              <FiCheck size={33} className="text-[#ffcf76]" strokeWidth={2.8} />
            </div>

            <p className="mt-3 max-w-[560px] text-[18px] leading-7 text-[#f7e0bd]">
              Admin руу амжилттай илгээгдлээ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
