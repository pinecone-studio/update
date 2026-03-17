"use client";

import type { BenefitRow, BenefitStatus } from "../_lib/types";
import { statusCopy } from "../_lib/constants";

type BenefitsTableProps = {
  employeeId: string;
  benefits: BenefitRow[];
  onOpenBenefitModal: (key: string, currentStatus: BenefitStatus) => void;
};

export function BenefitsTable({
  employeeId,
  benefits,
  onOpenBenefitModal,
}: BenefitsTableProps) {
  return (
    <section className="overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,rgba(36,24,56,0.78),rgba(22,15,39,0.54))] shadow-[0_18px_70px_rgba(5,3,16,0.34)] backdrop-blur-[3px]">
      <div className="grid grid-cols-[2.2fr_1.1fr_1.45fr_1.2fr_0.65fr] items-center bg-[linear-gradient(90deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08),rgba(255,255,255,0.12))] px-[20px] py-[22px] text-[20px] text-white/50">
        <div>Benefit</div>
        <div>Status</div>
        <div>Reason</div>
        <div>Last Date</div>
        <div>Action</div>
      </div>

      <div className="px-[20px]">
        {benefits.map((benefit) => {
          const key = `${employeeId}-${benefit.benefitId}`;

          return (
            <div
              key={benefit.benefitId || benefit.name}
              className="grid min-h-[72px] grid-cols-[2.2fr_1.1fr_1.45fr_1.2fr_0.65fr] items-center border-b border-white/14 text-[18px] text-white/92 last:border-b-0"
            >
              <div className="pr-6 font-medium">{benefit.name}</div>
              <div>{statusCopy[benefit.status]}</div>
              <div className="pr-6 text-white/90">{benefit.reason}</div>
              <div>{benefit.lastDate} . 20:00pm</div>
              <button
                type="button"
                onClick={() => onOpenBenefitModal(key, benefit.status)}
                className="inline-flex items-center gap-[10px] text-[18px] font-medium text-[#1E78FF] transition hover:text-[#56A5FF]"
              >
                <span>Fix</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-[18px] w-[18px]"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M7 17L17 7" />
                  <path d="M10 7h7v7" />
                </svg>
              </button>
            </div>
          );
        })}

        {benefits.length === 0 && (
          <div className="py-12 text-center text-[18px] text-white/58">
            Benefit мэдээлэл олдсонгүй.
          </div>
        )}
      </div>
    </section>
  );
}
