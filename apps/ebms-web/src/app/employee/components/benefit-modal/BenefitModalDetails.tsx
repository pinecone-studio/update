/** @format */

"use client";

import {
  FiAlertTriangle,
  FiChevronDown,
  FiCheck,
  FiClock,
  FiExternalLink,
  FiFileText,
  FiX,
  FiLock,
} from "react-icons/fi";
import type {
  BenefitCardProps,
  EligibilityRule,
} from "@/app/_components/BenefitCard";
import { translateLockReason } from "@/app/_lib/translateLockReason";

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
    <div
      className={`rounded-2xl border px-[16px] pb-[10px] pt-[14px] backdrop-blur-[1.5px] ${theme} ${className ?? ""}`}
    >
      <div className="mb-1.5 flex items-center gap-2.5 text-white/55">
        <span className="shrink-0">{icon}</span>
        <h3 className="text-[14px] font-semibold uppercase tracking-[0.09em]">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function DetailCell({
  label,
  value,
  withDivider = false,
}: {
  label: string;
  value: string;
  withDivider?: boolean;
}) {
  return (
    <div
      className={`min-w-0 py-2 ${withDivider ? "md:border-l md:border-white/5 md:pl-6" : ""}`}
    >
      <p className="text-[12px] font-medium text-white/45 sm:text-[13px]">
        {label}
      </p>
      <p className="mt-1.5 text-[16px] font-semibold leading-6 tracking-[0.12px] text-white sm:text-[18px]">
        {value}
      </p>
    </div>
  );
}

interface BenefitModalDetailsProps {
  benefit: BenefitCardProps;
  theme: {
    section: string;
    summary: string;
    rulePass: string;
    ruleFail: string;
  };
  rules: EligibilityRule[];
  onViewContract?: (benefit: BenefitCardProps) => void | Promise<void>;
  onViewUploadedContract?: (requestId: string) => void | Promise<void>;
}

export function BenefitModalDetails({
  benefit,
  theme,
  rules,
  onViewContract,
  onViewUploadedContract,
}: BenefitModalDetailsProps) {
  const vendor = (benefit.vendorDetails ?? "").trim() || "Pinecone";
  const subsidy = benefit.subsidyPercentage || "-";
  const shouldScrollRules = rules.length > 2;
  const summaryCopy = {
    ACTIVE: {
      title: "Active",
      message: "Benefit is currently active",
      icon: <FiCheck size={24} />,
      iconWrap: "bg-[#2D8B6C]",
    },
    ELIGIBLE: {
      title: "Eligible",
      message: "All requirements satisfied",
      icon: <FiCheck size={24} />,
      iconWrap: "bg-[#2D8B6C]",
    },
    LOCKED: {
      title: "Locked",
      message: (benefit.lockReason ? translateLockReason(benefit.lockReason) : null) || "Eligibility requirements not met",
      icon: <FiLock size={24} />,
      iconWrap: "bg-[#7A4364]",
    },
    PENDING: {
      title: "Pending",
      message: benefit.pendingApprovalBy
        ? `${benefit.pendingApprovalBy} approval pending`
        : "Request is under review",
      icon: <FiClock size={24} />,
      iconWrap: "bg-[#8C6437]",
    },
    REJECTED: {
      title: "Rejected",
      message: benefit.rejectReason || "Your previous request was rejected",
      icon: <FiX size={24} />,
      iconWrap: "bg-[#8A4256]",
    },
  }[benefit.status];

  const handleViewContract = () => {
    if (onViewContract) {
      void onViewContract(benefit);
    }
  };

  const hasUploadedContract =
    benefit.status === "ACTIVE" &&
    !!benefit.uploadedContractRequestId &&
    benefit.requiresContract;

  return (
    <>
      <div
        className={`rounded-[18px] border px-4 py-4 sm:px-5 ${theme.summary}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-[12px] ${summaryCopy.iconWrap} text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]`}
          >
            {summaryCopy.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold tracking-[0.15px] text-white sm:text-[18px]">
              {summaryCopy.title}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-white/60 sm:text-[14px]">
              {summaryCopy.message}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-0 border-b border-white/5 pb-4 md:grid-cols-2">
        <DetailCell label="Subsidy" value={subsidy} />
        <DetailCell label="Vendor" value={vendor} withDivider />
        <DetailCell
          label="Start"
          value={benefit.benefitStartDate || "-"}
        />
        <DetailCell
          label="End"
          value={benefit.benefitEndDate || "-"}
          withDivider
        />
      </div>

      <div className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-left text-[15px] font-medium text-white/65 sm:text-[16px]">
          Eligibility check
          <FiChevronDown size={18} className="text-white/45" />
        </div>

        <div
          className={`mt-4 w-full space-y-2 ${
            shouldScrollRules
              ? "max-h-[236px] overflow-y-auto pr-1"
              : ""
          }`}
        >
          {rules.map((rule, index) => (
            <div key={`${rule.rule}-${index}`} className="flex items-start gap-3 py-1.5">
              <div className="grid h-[34px] w-[34px] shrink-0 place-items-center text-white/90">
                {rule.passed ? (
                  <FiCheck size={16} className="text-[#61DA91]" />
                ) : /override|manual/i.test(`${rule.rule} ${rule.detail ?? ""}`) ? (
                  <FiAlertTriangle size={17} className="text-[#F4BC4E]" />
                ) : (
                  <FiX size={16} className="text-[#FF8EA1]" />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={`text-[16px] font-semibold leading-6 tracking-[0.1px] sm:text-[17px] ${
                    /override|manual/i.test(`${rule.rule} ${rule.detail ?? ""}`)
                      ? "text-[#F7C55C]"
                      : "text-white"
                  }`}
                >
                  {rule.rule}
                </p>
                {rule.detail ? (
                  <p className="mt-1 text-[14px] font-normal leading-5 tracking-[-0.15px] text-white/50">
                    {rule.detail}
                  </p>
                ) : null}
              </div>
              <span
                className={`mt-1 inline-flex h-[34px] min-w-[92px] shrink-0 items-center justify-center rounded-[10px] px-3 text-[14px] font-semibold tracking-[0.02em] ${
                  rule.passed
                    ? "border border-[#2D6E6B] bg-[#214E58]/72 text-[#9BF1C7]"
                    : "border border-[#7B4363] bg-[#6A3450]/70 text-[#FFAFBF]"
                }`}
              >
                {rule.passed ? "PASS" : "FAIL"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/45">
            Vendor Contract
          </p>
          <div className="mt-2">
            {hasUploadedContract ? (
              <button
                type="button"
                onClick={() => {
                  if (onViewUploadedContract && benefit.uploadedContractRequestId) {
                    void onViewUploadedContract(benefit.uploadedContractRequestId);
                  }
                }}
                className="inline-flex items-center gap-2 text-[14px] font-normal leading-5 tracking-[-0.15px] text-white hover:text-white/80"
              >
                View uploaded contract <FiExternalLink size={20} />
              </button>
            ) : benefit.contractLink ? (
              <a
                href={benefit.contractLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleViewContract}
                className="inline-flex items-center gap-2 text-[14px] font-normal leading-5 tracking-[-0.15px] text-white hover:text-white/80"
              >
                View vendor contract <FiExternalLink size={20} />
              </a>
            ) : (
              <p className="text-[14px] font-normal leading-5 tracking-[-0.15px] text-white/55">
                No contract linked.
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/45">
            Description
          </p>
          <p className="mt-2 text-[14px] leading-6 tracking-[-0.15px] text-white/82">
            {benefit.description || benefit.eligibilityCriteria}
          </p>
        </div>
      </div>

      {!hasUploadedContract ? (
        benefit.status === "ACTIVE" &&
        benefit.uploadedContractRequestId &&
        benefit.requiresContract && (
          <SectionCard
            theme={theme.section}
            icon={<FiFileText size={18} />}
            title="UPLOADED CONTRACT"
            className="min-h-[78px] mt-1"
          >
            <button
              type="button"
              onClick={() => {
                if (onViewUploadedContract && benefit.uploadedContractRequestId) {
                  void onViewUploadedContract(benefit.uploadedContractRequestId);
                }
              }}
              className="inline-flex items-center gap-2 text-[14px] font-normal leading-5 tracking-[-0.15px] text-white hover:text-white/80"
            >
              View uploaded contract <FiExternalLink size={20} />
            </button>
          </SectionCard>
        )
      ) : null}
    </>
  );
}
