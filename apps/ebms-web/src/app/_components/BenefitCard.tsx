/** @format */

"use client";

import { FiInfo } from "react-icons/fi";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export type BenefitStatus =
  | "ACTIVE"
  | "ELIGIBLE"
  | "LOCKED"
  | "PENDING"
  | "REJECTED";

export interface EligibilityRule {
  rule: string;
  passed: boolean;
  detail?: string;
}

const STATUS_STYLES: Record<BenefitStatus, string> = {
  ACTIVE: "border-[#10d9b3]/30 bg-[#083a45]/65 text-[#0de0c0]",
  ELIGIBLE: "border-[#5b86ff]/30 bg-[#243b86]/55 text-[#72a6ff]",
  LOCKED: "border-[#f2548e]/30 bg-[#5a2358]/55 text-[#ff6aa4]",
  PENDING: "border-[#f1922c]/30 bg-[#6a4028]/55 text-[#ff9a1f]",
  REJECTED: "border-[#e16776]/30 bg-[#632b3c]/55 text-[#ff93a0]",
};

const STATUS_CARD_STYLES: Record<
  BenefitStatus,
  {
    card: string;
    button: string;
    iconWrap: string;
    iconColor: string;
    sweep: string;
  }
> = {
  ACTIVE: {
    card: "border-[#0FD0B7]/45 bg-[radial-gradient(circle_at_82%_14%,rgba(103,168,255,0.34),transparent_34%),radial-gradient(circle_at_24%_22%,rgba(44,199,187,0.22),transparent_42%),linear-gradient(135deg,rgba(15,97,113,0.95)_0%,rgba(20,62,95,0.96)_52%,rgba(26,44,96,0.98)_100%)] shadow-[0_10px_30px_rgba(28,106,175,0.32),0_0_0_1px_rgba(40,214,199,0.18)]",
    button: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    iconWrap: "border border-white/10 bg-white/5",
    iconColor: "text-white/70",
    sweep: "rgba(52,211,153,0.16)",
  },
  ELIGIBLE: {
    card: "border-[#4A64FF]/40 bg-[radial-gradient(circle_at_84%_16%,rgba(120,144,255,0.22),transparent_30%),linear-gradient(135deg,rgba(44,44,107,0.96),rgba(55,33,91,0.96))]",
    button: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    iconWrap: "border border-white/10 bg-white/5",
    iconColor: "text-white/70",
    sweep: "rgba(96,165,250,0.16)",
  },
  PENDING: {
    card: "border-[#C26E22]/40 bg-[radial-gradient(circle_at_84%_16%,rgba(255,199,125,0.18),transparent_30%),linear-gradient(135deg,rgba(92,54,37,0.96),rgba(73,47,54,0.96))]",
    button: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    iconWrap: "border border-white/10 bg-white/5",
    iconColor: "text-white/70",
    sweep: "rgba(251,146,60,0.16)",
  },
  LOCKED: {
    card: "border-[#A23F82]/40 bg-[radial-gradient(circle_at_84%_16%,rgba(225,117,232,0.18),transparent_30%),linear-gradient(135deg,rgba(76,33,89,0.96),rgba(66,27,68,0.96))]",
    button: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    iconWrap: "border border-white/10 bg-white/5",
    iconColor: "text-white/70",
    sweep: "rgba(251,113,133,0.16)",
  },
  REJECTED: {
    card: "border-[#C54D58]/40 bg-[radial-gradient(circle_at_84%_16%,rgba(230,126,146,0.18),transparent_30%),linear-gradient(135deg,rgba(93,39,55,0.96),rgba(73,28,39,0.96))]",
    button: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    iconWrap: "border border-white/10 bg-white/5",
    iconColor: "text-white/70",
    sweep: "rgba(251,113,133,0.16)",
  },
};

const BUTTON_TEXT_BY_STATUS: Record<BenefitStatus, string> = {
  ELIGIBLE: "Request benefit",
  ACTIVE: "Manage benefit",
  PENDING: "View request",
  LOCKED: "View requirements",
  REJECTED: "Request benefit",
};

const STATUS_MESSAGE: Record<BenefitStatus, string> = {
  ACTIVE: "Benefit currently active",
  ELIGIBLE: "You are eligible for this benefit",
  PENDING: "Your request is under review",
  LOCKED: "Eligibility requirements not satisfied",
  REJECTED: "Your previous request was rejected",
};

const STATUS_LABELS: Record<BenefitStatus, string> = {
  ACTIVE: "ACTIVE",
  ELIGIBLE: "ELIGIBLE",
  PENDING: "PENDING",
  LOCKED: "LOCKED",
  REJECTED: "REJECTED",
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
  /** Benefit end date (from active contract expiry) */
  benefitEndDate?: string | null;
  /** Benefit start date (from active contract effective date, for ACTIVE benefits) */
  benefitStartDate?: string | null;
  /** If true, employee must accept vendor contract before requesting */
  requiresContract?: boolean;
  status: BenefitStatus;
  /** Human-readable explanation when status is LOCKED (e.g., "OKR not submitted for Q1 2025") */
  lockReason?: string;
  /** Rejection reason when status is REJECTED (admin's feedback) */
  rejectReason?: string;
  /** True when status is currently controlled by an HR/Admin override */
  overrideApplied?: boolean;
  /** Optional reason attached to the active override */
  overrideReason?: string;
  /** Rules evaluated for eligibility breakdown (shown in detail view) */
  eligibilityRules?: EligibilityRule[];
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  buttonText?: string;
  onClick?: () => void;
  /** Called when user clicks "Request benefit" on ELIGIBLE benefits */
  onRequestBenefit?: () => void;
  /** Custom footer actions (replaces default button when provided) */
  footerActions?: ReactNode;
  /** Compact layout for list/sidebar (single column) */
  compact?: boolean;
  variant?: "default" | "admin";
  hideStatusBadge?: boolean;
}

function StatusBadge({ status }: { status: BenefitStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.04em] ${STATUS_STYLES[status]}`}
    >
      {status === "ELIGIBLE" ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      ) : null}
      {STATUS_LABELS[status]}
    </span>
  );
}

export const BenefitCard = ({
  benefitId: _benefitId,
  category,
  name,
  description,
  subsidyPercentage,
  vendorDetails,
  eligibilityCriteria: _eligibilityCriteria,
  contractLink: _contractLink,
  benefitEndDate: _benefitEndDate,
  status,
  lockReason,
  rejectReason,
  overrideApplied = false,
  overrideReason,
  eligibilityRules,
  icon,
  iconBgColor: _iconBgColor = "bg-[#4CAF50]/20",
  iconColor: _iconColor = "text-[#4CAF50]",
  buttonText,
  onClick,
  onRequestBenefit,
  footerActions,
  compact,
  variant = "default",
  hideStatusBadge = false,
}: BenefitCardProps) => {
  const displayButtonText = buttonText ?? BUTTON_TEXT_BY_STATUS[status];
  const theme = STATUS_CARD_STYLES[status];
  const isAdminVariant = variant === "admin";
  const categoryLabel = category
    ? `${category.charAt(0).toUpperCase()}${category.slice(1)} benefit`
    : description;
  const normalizedLockReason = (lockReason ?? "").trim();
  const normalizedRejectReason = (rejectReason ?? "").trim();
  const vendorDisplayName = (vendorDetails ?? "").trim() || "Pinecone";
  const supportText =
    status === "LOCKED"
      ? normalizedLockReason || STATUS_MESSAGE[status]
      : status === "REJECTED"
        ? normalizedRejectReason || STATUS_MESSAGE[status]
        : STATUS_MESSAGE[status];
  const normalizedOverrideReason = (overrideReason ?? "").trim();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShouldAnimate(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ((status === "ELIGIBLE" || status === "REJECTED") && onRequestBenefit) {
      onRequestBenefit();
    } else if (onClick) {
      onClick();
    }
  };

  const isButtonClickable =
    status === "ELIGIBLE" ||
    status === "REJECTED" ||
    ((status === "ACTIVE" || status === "LOCKED" || status === "PENDING") &&
      onClick);
  const cardClass = isAdminVariant
    ? "border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_12px_32px_rgba(15,23,42,0.08)] dark:border-[#324A70] dark:bg-[linear-gradient(180deg,#162338_0%,#122033_100%)] dark:shadow-[0_14px_36px_rgba(2,11,31,0.34)]"
    : theme.card;
  const iconWrapClass = isAdminVariant
    ? `${_iconBgColor} ${_iconColor} border border-black/5 dark:border-white/10`
    : `${theme.iconWrap} ${theme.iconColor}`;
  const titleClass = isAdminVariant
    ? "text-slate-900 dark:text-white"
    : "text-white";
  const metaClass = isAdminVariant
    ? "text-slate-500 dark:text-[#9FB0CF]"
    : "text-white/50";
  const dividerClass = isAdminVariant
    ? "bg-gradient-to-r from-slate-200 via-slate-100 to-transparent dark:from-[#2C4264] dark:via-[#223655] dark:to-transparent"
    : "bg-gradient-to-r from-white/18 via-white/12 to-white/6";
  const labelClass = isAdminVariant
    ? "text-sm text-slate-500 dark:text-[#9FB0CF]"
    : "text-sm text-white/55";
  const valueClass = isAdminVariant
    ? "text-sm font-semibold text-slate-800 dark:text-white/90"
    : "text-sm font-semibold text-white/90";
  const bodyClass = isAdminVariant
    ? "text-[15px] leading-6 text-slate-600 dark:text-[#D1DBEF]"
    : "text-base text-white/85";
  return (
    <div
      className={`flex flex-col w-full ${compact ? "" : "h-full"} ${onClick ? "cursor-pointer hover:opacity-95 transition-opacity" : ""}`}
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
      <div
        className={`group relative w-full min-w-0 max-w-full overflow-hidden rounded-2xl border p-5 backdrop-blur-sm shadow-lg transition-all duration-300 ${
          cardClass
        } ${compact ? "flex-none" : "flex-1 min-h-0"}`}
      >
        {shouldAnimate && !isAdminVariant ? (
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background: `radial-gradient(circle at center, rgba(255,255,255,0.20) 0%, ${theme.sweep} 34%, transparent 68%)`,
              animation: "benefit-card-sweep 11s ease-in-out infinite",
            }}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-full flex-col">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${iconWrapClass}`}
              >
                <div className="h-6 w-6">{icon}</div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`text-base font-semibold ${titleClass}`}>
                    {name}
                  </h3>
                  {status === "ACTIVE" &&
                  (eligibilityRules ?? []).length > 0 ? (
                    <span
                      className="relative group/info"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiInfo
                        size={12}
                        className="cursor-help text-white/40 hover:text-white/70"
                        aria-label="Requirements to maintain benefit"
                      />
                      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-44 -translate-x-1/2 rounded-lg bg-[#121624] px-2 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover/info:opacity-100">
                        <p className="mb-1 font-semibold">
                          To maintain this benefit
                        </p>
                        <ul className="list-inside list-disc space-y-0.5">
                          {(eligibilityRules ?? []).slice(0, 3).map((r, i) => (
                            <li key={i} className="line-clamp-2">
                              {r.rule}
                            </li>
                          ))}
                        </ul>
                      </span>
                    </span>
                  ) : null}
                </div>
                <p className={`mt-1 text-sm ${metaClass}`}>{categoryLabel}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {hideStatusBadge ? null : <StatusBadge status={status} />}
              {overrideApplied ? (
                <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.04em] text-amber-200">
                  MANUAL OVERRIDE
                </span>
              ) : null}
            </div>
          </div>

          {isAdminVariant && !compact ? (
            <div className="mb-2">
              <div className="mt-3 space-y-0.5">
                {subsidyPercentage ? (
                  <div className="flex items-center justify-between border-b border-slate-200 py-2.5 dark:border-white/10">
                    <span className={labelClass}>Coverage</span>
                    <span className={valueClass}>
                      {subsidyPercentage} subsidy
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between border-b border-slate-200 py-2.5 dark:border-white/10">
                  <span className={labelClass}>Vendor</span>
                  <span className={valueClass}>{vendorDisplayName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 py-2.5 dark:border-white/10">
                  <span className={labelClass}>Rules</span>
                  <span className={valueClass}>{_eligibilityCriteria}</span>
                </div>
                <p className={`pt-4 ${bodyClass}`}>{description}</p>
              </div>
            </div>
          ) : null}

          {!isAdminVariant && !compact && status === "ACTIVE" ? (
            <div className="mb-2">
              <div className={`h-px ${dividerClass}`} />
              <div className="mt-3 space-y-0.5">
                {subsidyPercentage ? (
                  <div className="flex items-center justify-between border-b border-white/10 py-2.5">
                    <span className={labelClass}>Coverage</span>
                    <span className={valueClass}>
                      {subsidyPercentage} subsidy
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between border-b border-white/10 py-2.5">
                  <span className={labelClass}>Vendor</span>
                  <span className={valueClass}>{vendorDisplayName}</span>
                </div>
                <p className={`pt-4 ${bodyClass}`}>{STATUS_MESSAGE.ACTIVE}</p>
                {overrideApplied ? (
                  <p className="pt-2 text-xs text-amber-200/90">
                    Override:{" "}
                    {normalizedOverrideReason ||
                      "Status manually updated by HR/Admin."}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {!isAdminVariant && !compact && status !== "ACTIVE" ? (
            <div className="mb-2">
              <div className={`h-px ${dividerClass}`} />
              <div className="mt-3 space-y-0.5">
                {subsidyPercentage ? (
                  <div className="flex items-center justify-between border-b border-white/10 py-2.5">
                    <span className={labelClass}>Coverage</span>
                    <span className={valueClass}>
                      {subsidyPercentage} subsidy
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between border-b border-white/10 py-2.5">
                  <span className={labelClass}>Vendor</span>
                  <span className={valueClass}>{vendorDisplayName}</span>
                </div>
                <p className={`pt-5 ${bodyClass}`}>{supportText}</p>
                {overrideApplied ? (
                  <p className="pt-2 text-xs text-amber-200/90">
                    Override:{" "}
                    {normalizedOverrideReason ||
                      "Status manually updated by HR/Admin."}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {!isAdminVariant ? (
            <div className="mb-4 mt-auto h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
          ) : null}

          {footerActions ? (
            <div className="w-full">{footerActions}</div>
          ) : (
            <button
              type="button"
              disabled={!isButtonClickable}
              className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                isButtonClickable
                  ? `${theme.button} group-hover:bg-white/[0.08]`
                  : "cursor-not-allowed border border-white/10 bg-white/5 text-white/35"
              }`}
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
