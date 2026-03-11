/** @format */

import { FiExternalLink } from "react-icons/fi";
import type { ReactNode } from "react";

export type BenefitStatus = "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING";

export interface EligibilityRule {
  rule: string;
  passed: boolean;
  detail?: string;
}

const STATUS_STYLES: Record<BenefitStatus, string> = {
	ACTIVE: "bg-[#16a34a] text-white",
	ELIGIBLE: "bg-[#2563eb] text-white",
	LOCKED: "bg-[#dc2626] text-white",
	PENDING: "bg-[#f59e0b] text-white",
};

const BUTTON_TEXT_BY_STATUS: Record<BenefitStatus, string> = {
  ELIGIBLE: "Request benefit",
  ACTIVE: "Manage Benefit",
  PENDING: "View status",
  LOCKED: "View details",
};

export interface BenefitCardProps {
  /** Backend benefit id (for requestBenefit mutation) */
  benefitId?: string;
  category: string;
  name: string;
  description: string;
  subsidyPercentage?: string;
  vendorDetails?: string;
  eligibilityCriteria: string;
  contractLink?: string;
  status: BenefitStatus;
  /** Human-readable explanation when status is LOCKED (e.g., "OKR not submitted for Q1 2025") */
  lockReason?: string;
  /** Rules evaluated for eligibility breakdown (shown in detail view) */
  eligibilityRules?: EligibilityRule[];
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  buttonText?: string;
  onClick?: () => void;
  /** Called when user clicks "Request benefit" on ELIGIBLE benefits */
  onRequestBenefit?: () => void;
}

export const BenefitCard = ({
  benefitId: _benefitId,
  category,
  name,
  description,
  subsidyPercentage,
  vendorDetails,
  eligibilityCriteria,
  contractLink,
  status,
  lockReason,
  eligibilityRules: _eligibilityRules,
  icon,
  iconBgColor = "bg-[#4CAF50]/20",
  iconColor = "text-[#4CAF50]",
  buttonText,
  onClick,
  onRequestBenefit,
}: BenefitCardProps) => {
  const displayButtonText = buttonText ?? BUTTON_TEXT_BY_STATUS[status];

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === "ELIGIBLE" && onRequestBenefit) {
      onRequestBenefit();
    } else if (onClick) {
      onClick();
    }
  };
  return (
    <div
      className={`flex flex-col gap-3 w-full ${onClick ? "cursor-pointer hover:opacity-95 transition-opacity" : ""}`}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className="text-white text-xs font-medium uppercase tracking-wider w-fit">
        {category}
      </span>

      <div className="w-full min-w-0 max-w-full min-h-[356px] rounded-xl bg-[#1A2536] border border-[#2d3a4d] overflow-hidden shadow-inner">
        <div className="p-5 pt-4">
          <div className="flex items-start gap-4 mb-5">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor} ${iconColor}`}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{name}</h3>
                  <p className="text-sm text-[#94A3B8] mt-0.5">{description}</p>
                </div>
                <span
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-5 pb-5 border-b border-[#2d3a4d]">
            {subsidyPercentage != null && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-sm text-[#94A3B8]">Subsidy</span>
                <span className="text-sm text-white">{subsidyPercentage}</span>
              </div>
            )}
            {vendorDetails != null && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-sm text-[#94A3B8]">Vendor</span>
                <span className="text-sm text-white">{vendorDetails}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
              <span className="text-sm text-[#94A3B8]">Eligibility</span>
              <span className="text-sm text-white text-right sm:text-right">
                {eligibilityCriteria}
              </span>
            </div>
            {contractLink != null && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-sm text-[#94A3B8]">Contract</span>
                <a
                  href={contractLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-white hover:text-[#60A5FA] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  View active contract
                  <FiExternalLink size={12} className="flex-shrink-0" />
                </a>
              </div>
            )}
          </div>

          {status === "LOCKED" && lockReason != null && (
            <div className="rounded-lg bg-[#64748b]/20 border border-[#64748b]/40 px-3 py-2 mb-4">
              <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-0.5">
                Blocked by rule
              </p>
              <p className="text-sm text-[#E2E8F0]">{lockReason}</p>
            </div>
          )}

					{status === "ELIGIBLE" && (
						<button
							type="button"
							className="w-full py-3 px-4 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium text-sm transition-colors"
							onClick={handleButtonClick}
						>
							{displayButtonText}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
