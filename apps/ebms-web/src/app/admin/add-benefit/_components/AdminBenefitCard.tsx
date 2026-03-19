/** @format */

"use client";

import type { ReactNode } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type AdminBenefitCardProps = {
  id: string;
  name: string;
  category: string;
  subsidyPercent: number;
  vendorDisplay: string;
  ruleSummary: string;
  validityPeriodDisplay?: string;
  usagePeriodDisplay?: string;
  requestDeadlineDisplay?: string;
  financeApproval?: boolean;
  vendorContract?: boolean;
  managerApproval?: boolean;
  icon: ReactNode;
  iconBgClass?: string;
  iconColorClass?: string;
  isHighlighted?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
};

export function AdminBenefitCard({
  id,
  name,
  category,
  subsidyPercent,
  vendorDisplay,
  ruleSummary,
  validityPeriodDisplay,
  usagePeriodDisplay,
  requestDeadlineDisplay,
  financeApproval,
  vendorContract,
  managerApproval,
  icon,
  iconBgClass = "bg-slate-500/20",
  iconColorClass = "text-slate-300",
  isHighlighted,
  onEdit,
  onDelete,
  isDeleting,
}: AdminBenefitCardProps) {
  const categoryLabel = category
    ? `${category.charAt(0).toUpperCase()}${category.slice(1)} benefit`
    : "Benefit";

  const durationDisplay = [validityPeriodDisplay, usagePeriodDisplay]
    .filter(Boolean)
    .join(" · ") || "—";

  const approvalDisplay = [
    financeApproval && "Finance",
    vendorContract && "Vendor Contract",
    managerApproval && "Manager",
  ]
    .filter(Boolean)
    .join(", ") || "—";

  const labelClass = "text-sm text-white/55";
  const valueClass = "text-sm font-semibold text-white/90";

  return (
    <div
      id={`benefit-card-${id}`}
      className={`flex min-h-[320px] flex-col rounded-xl border-t border-white/40 transition sm:h-[310px] ${
        isHighlighted ? "ring-2 ring-[#2A8BFF]" : ""
      } bg-[#1A2037] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]`}
    >
      <div className="flex flex-1 min-h-0 flex-col p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 sm:h-12 sm:w-12 ${iconBgClass} ${iconColorClass}`}
          >
            <div className="flex h-5 w-5 items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold text-white sm:text-base">
              {name}
            </h3>
            <p className="mt-1 text-[13px] text-white/50 sm:text-sm">
              {categoryLabel}
            </p>
          </div>
        </div>

        <div className="mt-3 flex-1 space-y-1.5 overflow-hidden text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal text-[#FFFFFF]/40">
              Coverage:
            </span>
            <span className="font-medium text-[#FFFFFF]/70">
              {subsidyPercent}% subsidy
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal text-[#FFFFFF]/40">
              Vendor:
            </span>
            <span className="font-medium text-[#FFFFFF]/70 text-[14px] ">
              {vendorDisplay}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal text-[#FFFFFF]/40">
              Active period:
            </span>
            <span className="font-medium text-[#FFFFFF]/70">
              {validityPeriodDisplay ?? "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal text-[#FFFFFF]/40">
              Employee usage:
            </span>
            <span className="font-medium text-[#FFFFFF]/70">
              {usagePeriodDisplay ?? "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal text-[#FFFFFF]/40">
              Approval:
            </span>
            <span className="font-medium text-[#FFFFFF]/70">
              {[
                financeApproval && "Finance",
                vendorContract && "Vendor Contract",
                managerApproval && "Manager",
              ]
                .filter(Boolean)
                .join(", ") || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal text-[#FFFFFF]/40">
              Rule:
            </span>
            <span className="font-medium text-[#FFFFFF]/70">
              {ruleSummary || "—"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="inline-flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/5 sm:flex-none sm:min-w-[140px] lg:w-[180px]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            className="inline-flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:min-w-[140px] lg:w-[180px]"
          >
            {isDeleting ? "..." : <>Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}
