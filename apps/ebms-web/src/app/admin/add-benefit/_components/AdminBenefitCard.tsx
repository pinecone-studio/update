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

  return (
    <div
      id={`benefit-card-${id}`}
      className={`flex h-[310px] flex-col rounded-xl border-t border-white/40 transition ${
        isHighlighted ? "ring-2 ring-[#2A8BFF]" : ""
      } bg-[#1A2037] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]`}
      style={{ padding: "16px 16px 16px 16px" }}
    >
      <div className="flex flex-1 min-h-0 flex-col gap-2 p-4 ">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 ${iconBgClass} ${iconColorClass}`}
          >
            <div className="flex h-5 w-5 items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-white">{name}</h3>
            <p className="mt-0.5 text-xs text-slate-400">{categoryLabel}</p>
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
          <div>
            <span className="text-slate-400">Rule:</span>
            <div className="mt-1 h-px w-full bg-slate-600/60" />
            {ruleSummary ? (
              <p className="mt-1 text-slate-300">{ruleSummary}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="inline-flex h-11 flex-1 w-[180px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-white transition hover:bg-white/10"
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
            className="inline-flex h-11 w-[180px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-white/10"
          >
            {isDeleting ? "..." : <>Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}
