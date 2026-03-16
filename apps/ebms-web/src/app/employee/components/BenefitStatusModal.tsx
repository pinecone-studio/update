/** @format */

"use client";

import { useEffect } from "react";
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiExternalLink,
  FiFileText,
  FiInfo,
  FiShield,
  FiX,
} from "react-icons/fi";
import type { BenefitCardProps, EligibilityRule } from "@/app/_components/BenefitCard";

type Status = BenefitCardProps["status"];

const STATUS_BADGE: Record<Status, string> = {
  ACTIVE: "border-[#00d3a7]/40 bg-[#0a6b63]/35 text-[#1bf5ca]",
  ELIGIBLE: "border-[#5f9bff]/40 bg-[#274ca6]/35 text-[#74acff]",
  PENDING: "border-[#f0a638]/45 bg-[#7b4a20]/35 text-[#ffb63d]",
  LOCKED: "border-[#ff6799]/45 bg-[#79284d]/35 text-[#ff7fa7]",
  REJECTED: "border-[#ff7d87]/45 bg-[#7f2b40]/35 text-[#ff8d96]",
};

const MODAL_THEME: Record<
  Status,
  {
    frame: string;
    header: string;
    body: string;
    section: string;
    rulePass: string;
    ruleFail: string;
    closeBtn: string;
  }
> = {
  ACTIVE: {
    frame:
      "border-[#00D49266] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
    header:
      "bg-[linear-gradient(135deg,rgba(0,188,125,0.20)_0%,rgba(0,187,167,0.15)_50%,rgba(0,184,219,0.10)_100%),#0F172B]",
    body:
      "bg-[linear-gradient(135deg,rgba(0,188,125,0.10)_0%,rgba(0,187,167,0.08)_50%,rgba(0,184,219,0.06)_100%),#0F172B]",
    section: "border-white/12 bg-white/5",
    rulePass: "border-[#00D4924D] bg-[#00BC7D1A]",
    ruleFail: "border-[#ff6d8f]/35 bg-[#5d2840]/45",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
  },
  ELIGIBLE: {
    frame:
      "border-[#5078ff]/45 shadow-[0_0_0_1px_rgba(80,120,255,0.16),0_24px_80px_rgba(0,0,0,0.55)]",
    header:
      "bg-[radial-gradient(circle_at_78%_16%,rgba(125,128,255,0.22),transparent_46%),linear-gradient(120deg,#111f46_0%,#172763_100%)]",
    body:
      "bg-[radial-gradient(circle_at_84%_22%,rgba(126,109,255,0.24),transparent_44%),linear-gradient(135deg,#172b64_0%,#2a246a_100%)]",
    section: "border-white/12 bg-white/5",
    rulePass: "border-[#4de7b5]/40 bg-[#0f5e58]/45",
    ruleFail: "border-[#ff6d8f]/35 bg-[#5d2840]/45",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
  },
  PENDING: {
    frame:
      "border-[#d78832]/45 shadow-[0_0_0_1px_rgba(215,136,50,0.16),0_24px_80px_rgba(0,0,0,0.55)]",
    header:
      "bg-[radial-gradient(circle_at_18%_28%,rgba(157,88,38,0.35),transparent_54%),linear-gradient(120deg,#171f42_0%,#1b274f_100%)]",
    body:
      "bg-[radial-gradient(circle_at_28%_22%,rgba(148,81,34,0.30),transparent_48%),linear-gradient(135deg,#2e1f2d_0%,#1f2448_100%)]",
    section: "border-white/12 bg-white/5",
    rulePass: "border-[#4de7b5]/40 bg-[#0f5e58]/45",
    ruleFail: "border-[#ff6d8f]/35 bg-[#5d2840]/45",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
  },
  LOCKED: {
    frame:
      "border-[#FF637E66] shadow-[0_17.43px_34.85px_-8.36px_rgba(0,0,0,0.25)]",
    header:
      "bg-[linear-gradient(135deg,rgba(255,32,86,0.25)_0%,rgba(246,51,154,0.25)_52%,rgba(200,0,222,0.25)_100%),rgba(15,23,43,0.95)]",
    body:
      "bg-[linear-gradient(135deg,rgba(255,32,86,0.20)_0%,rgba(246,51,154,0.20)_52%,rgba(200,0,222,0.20)_100%),rgba(15,23,43,0.95)]",
    section: "border-white/12 bg-white/5",
    rulePass: "border-[#4de7b5]/40 bg-[#0f5e58]/45",
    ruleFail: "border-[#ff6d8f]/35 bg-[#652246]/50",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
  },
  REJECTED: {
    frame:
      "border-[#e16776]/45 shadow-[0_0_0_1px_rgba(225,103,118,0.16),0_24px_80px_rgba(0,0,0,0.58)]",
    header:
      "bg-[radial-gradient(circle_at_18%_32%,rgba(170,57,73,0.30),transparent_54%),linear-gradient(120deg,#2a1f4a_0%,#2f1e3f_100%)]",
    body:
      "bg-[radial-gradient(circle_at_24%_24%,rgba(173,64,87,0.24),transparent_48%),linear-gradient(135deg,#4b2337_0%,#3b1f58_100%)]",
    section: "border-white/12 bg-white/5",
    rulePass: "border-[#4de7b5]/40 bg-[#0f5e58]/45",
    ruleFail: "border-[#ff6d8f]/35 bg-[#652246]/50",
    closeBtn: "border-white/15 bg-white/10 hover:bg-white/15",
  },
};

interface BenefitStatusModalProps {
  benefit: BenefitCardProps | null;
  onClose: () => void;
  onRequestBenefit?: (benefit: BenefitCardProps) => void;
  onViewContract?: (benefit: BenefitCardProps) => void | Promise<void>;
}

function getRules(benefit: BenefitCardProps): EligibilityRule[] {
  if (benefit.eligibilityRules && benefit.eligibilityRules.length > 0) {
    return benefit.eligibilityRules;
  }
  return [
    {
      rule: benefit.eligibilityCriteria,
      passed: benefit.status !== "LOCKED" && benefit.status !== "REJECTED",
      detail:
        benefit.status === "LOCKED"
          ? benefit.lockReason
          : benefit.status === "REJECTED"
            ? benefit.rejectReason
            : undefined,
    },
  ];
}

function SectionCard({
  title,
  icon,
  theme,
  className,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  theme: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border px-[20.57px] pb-[12px] pt-[20.57px] ${theme} ${className ?? ""}`}>
      <div className="mb-2 flex items-center gap-2.5 text-white/55">
        <span className="shrink-0">{icon}</span>
        <h3 className="text-[14px] font-semibold uppercase tracking-[0.09em]">{title}</h3>
      </div>
      {children}
    </div>
  );
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
  const vendor = (benefit.vendorDetails ?? "").trim() || "Pinecone";
  const subsidy = benefit.subsidyPercentage ? `${benefit.subsidyPercentage} subsidy` : "-";

  const canRequest =
    (benefit.status === "ELIGIBLE" || benefit.status === "REJECTED") &&
    !!onRequestBenefit;

  const onRequestClick = () => {
    onRequestBenefit?.(benefit);
    onClose();
  };

  const handleViewContract = () => {
    if (onViewContract) {
      void onViewContract(benefit);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="benefit-status-modal-title"
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div
          className={`relative h-[min(614px,92vh)] w-full max-w-[468px] overflow-hidden rounded-[16.73px] border ${theme.frame}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`px-4 pb-4 pt-6 sm:px-5 sm:pb-4 sm:pt-6 ${theme.header}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-white/15 bg-white/5 text-white/75">
                  <div className="h-6 w-6">{benefit.icon}</div>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      id="benefit-status-modal-title"
                      className="text-[30px] font-bold leading-[36px] tracking-[0.4px] text-white"
                    >
                      {benefit.name}
                    </h2>
                    <span
                      className={`inline-flex h-8 items-center rounded-full border px-3 text-[12px] font-semibold tracking-[0.08em] ${STATUS_BADGE[benefit.status]}`}
                    >
                      {benefit.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[14px] font-normal leading-5 tracking-[-0.15px] text-white/50">
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

          <div className={`px-4 pb-4 pt-3 sm:px-5 sm:pb-5 ${theme.body}`}>
            <div className="max-h-[430px] space-y-3 overflow-y-auto pr-1">
              <>
                  <SectionCard
                    theme={theme.section}
                    icon={<FiFileText size={22} />}
                    title={benefit.status === "ACTIVE" ? "ELIGIBILITY CRITERIA" : "DESCRIPTION"}
                    className="min-h-[88px]"
                  >
                    <p className="text-[14px] leading-5 tracking-[-0.15px] text-white/95">
                      {benefit.status === "ACTIVE"
                        ? benefit.eligibilityCriteria || "All active employees"
                        : benefit.description || benefit.eligibilityCriteria}
                    </p>
                  </SectionCard>

                  <div className="grid gap-4 md:grid-cols-2">
                    <SectionCard theme={theme.section} icon={<FiShield size={18} />} title="SUBSIDY" className="min-h-[93px]">
                      <p className="text-[22px] font-semibold text-white">{subsidy}</p>
                    </SectionCard>
                    <SectionCard theme={theme.section} icon={<FiFileText size={18} />} title="VENDOR" className="min-h-[93px]">
                      <p className="text-[22px] font-medium text-white">{vendor}</p>
                    </SectionCard>
                  </div>

                  <SectionCard theme={theme.section} icon={<FiFileText size={18} />} title="VENDOR CONTRACT" className="min-h-[93px]">
                    {benefit.contractLink ? (
                      <a
                        href={benefit.contractLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleViewContract}
                        className="inline-flex items-center gap-2 text-[14px] font-normal leading-5 tracking-[-0.15px] text-[#4EA1FF] hover:text-[#7ABEFF]"
                      >
                        View vendor contract <FiExternalLink size={20} />
                      </a>
                    ) : (
                      <p className="text-[14px] font-normal leading-5 tracking-[-0.15px] text-white/55">No contract linked.</p>
                    )}
                  </SectionCard>

                  {(benefit.benefitStartDate || benefit.benefitEndDate) && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <SectionCard theme={theme.section} icon={<FiCalendar size={18} />} title="BENEFIT STARTED" className="min-h-[93px]">
                        <p className="text-[22px] font-semibold leading-8 tracking-[0.2px] text-white">
                          {benefit.benefitStartDate || "-"}
                        </p>
                      </SectionCard>
                      <SectionCard theme={theme.section} icon={<FiClock size={18} />} title="BENEFIT ENDS" className="min-h-[93px]">
                        <p className="text-[22px] font-semibold leading-8 tracking-[0.2px] text-white">
                          {benefit.benefitEndDate || "-"}
                        </p>
                      </SectionCard>
                    </div>
                  )}

                  <div>
                    <div className="mb-3 flex items-center gap-3 text-white/70">
                      <FiShield size={18} />
                      <h3 className="text-[14px] font-semibold uppercase tracking-[0.09em]">
                        Eligibility Rules
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {rules.map((rule, index) => (
                        <div
                          key={`${rule.rule}-${index}`}
                          className={`min-h-[121px] rounded-2xl border px-[20px] pb-[16px] pt-[20px] ${rule.passed ? theme.rulePass : theme.ruleFail}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-[16px] bg-black/20 text-white/90">
                              {rule.passed ? <FiCheck size={22} /> : <FiX size={22} />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[22px] font-semibold leading-8 tracking-[0.2px] text-white">{rule.rule}</p>
                              {rule.detail ? (
                                <p className="mt-1 text-[14px] font-normal leading-5 tracking-[-0.15px] text-white/65">{rule.detail}</p>
                              ) : null}
                              <span className="mt-2 inline-flex h-[24px] min-w-[59px] items-center justify-center rounded-[10px] bg-[#00BC7D]/20 px-3 text-[14px] font-semibold leading-5 tracking-[-0.05px] text-[#00E0A6]">
                                {rule.passed ? "PASS" : "FAIL"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              </>
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
                className="h-[56px] w-full rounded-2xl border border-white/20 bg-white/10 text-center text-[20px] font-semibold text-white transition hover:bg-white/15"
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
