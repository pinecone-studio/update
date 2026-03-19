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
      <div className="mb-1.5 flex items-center gap-2.5 text-slate-500 dark:text-white/55">
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
      className={`min-w-0 py-2 ${withDivider ? "md:border-l md:border-slate-200 md:pl-6 dark:md:border-white/5" : ""}`}
    >
      <p className="text-[12px] font-medium text-slate-500 sm:text-[13px] dark:text-white/45">
        {label}
      </p>
      <p className="mt-1.5 text-[16px] font-semibold leading-6 tracking-[0.12px] text-slate-900 sm:text-[18px] dark:text-white">
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
      iconWrap: "bg-emerald-600 text-white",
    },
    ELIGIBLE: {
      title: "Eligible",
      message: "All requirements satisfied",
      icon: <FiCheck size={24} />,
      iconWrap: "bg-emerald-600 text-white",
    },
    LOCKED: {
      title: "Locked",
      message: benefit.lockReason || "Eligibility requirements not met",
      icon: <FiLock size={24} />,
      iconWrap: "bg-rose-700 text-white",
    },
    PENDING: {
      title: "Pending",
      message: benefit.pendingApprovalBy
        ? `${benefit.pendingApprovalBy} approval pending`
        : "Request is under review",
      icon: <FiClock size={24} />,
      iconWrap: "bg-amber-600 text-white",
    },
    REJECTED: {
      title: "Rejected",
      message: benefit.rejectReason || "Your previous request was rejected",
      icon: <FiX size={24} />,
      iconWrap: "bg-rose-600 text-white",
    },
  }[benefit.status];

  const handleViewContract = () => {
    if (onViewContract) {
      void onViewContract(benefit);
    }
  };

  return (
    <>
      <div
        className={`rounded-[18px] border px-4 py-4 sm:px-5 ${theme.summary}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-[12px] ${summaryCopy.iconWrap} shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]`}
          >
            {summaryCopy.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold tracking-[0.15px] text-slate-900 sm:text-[18px] dark:text-white">
              {summaryCopy.title}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-slate-600 sm:text-[14px] dark:text-white/60">
              {summaryCopy.message}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-0 border-b border-slate-200 pb-4 dark:border-white/5 md:grid-cols-2">
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

      <div className="border-b border-slate-200 pb-4 dark:border-white/5">
        <div className="flex items-center gap-2 text-left text-[15px] font-medium text-slate-600 sm:text-[16px] dark:text-white/65">
          Eligibility check
          <FiChevronDown size={18} className="text-slate-400 dark:text-white/45" />
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
              <div className="grid h-[34px] w-[34px] shrink-0 place-items-center text-slate-700 dark:text-white/90">
                {rule.passed ? (
                  <FiCheck size={16} className="text-emerald-500 dark:text-[#61DA91]" />
                ) : /override|manual/i.test(`${rule.rule} ${rule.detail ?? ""}`) ? (
                  <FiAlertTriangle size={17} className="text-amber-500 dark:text-[#F4BC4E]" />
                ) : (
                  <FiX size={16} className="text-rose-400 dark:text-[#FF8EA1]" />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={`text-[16px] font-semibold leading-6 tracking-[0.1px] sm:text-[17px] ${
                    /override|manual/i.test(`${rule.rule} ${rule.detail ?? ""}`)
                      ? "text-amber-600 dark:text-[#F7C55C]"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {rule.rule}
                </p>
                {rule.detail ? (
                  <p className="mt-1 text-[14px] font-normal leading-5 tracking-[-0.15px] text-slate-500 dark:text-white/50">
                    {rule.detail}
                  </p>
                ) : null}
              </div>
              <span
                className={`mt-1 inline-flex h-[34px] min-w-[92px] shrink-0 items-center justify-center rounded-[10px] px-3 text-[14px] font-semibold tracking-[0.02em] ${
                  rule.passed
                    ? "border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-[#2D6E6B] dark:bg-[#214E58]/72 dark:text-[#9BF1C7]"
                    : "border border-rose-300 bg-rose-50 text-rose-700 dark:border-[#7B4363] dark:bg-[#6A3450]/70 dark:text-[#FFAFBF]"
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
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-white/45">
            Vendor Contract
          </p>
          <div className="mt-2">
            {benefit.contractLink ? (
              <a
                href={benefit.contractLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleViewContract}
                className="inline-flex items-center gap-2 text-[14px] font-normal leading-5 tracking-[-0.15px] text-blue-600 hover:text-blue-700 dark:text-[#8FBBFF] dark:hover:text-[#B9D1FF]"
              >
                View vendor contract <FiExternalLink size={20} />
              </a>
            ) : (
              <p className="text-[14px] font-normal leading-5 tracking-[-0.15px] text-slate-500 dark:text-white/55">
                No contract linked.
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-white/45">
            Description
          </p>
          <p className="mt-2 text-[14px] leading-6 tracking-[-0.15px] text-slate-700 dark:text-white/82">
            {benefit.description || benefit.eligibilityCriteria}
          </p>
        </div>
      </div>

      {benefit.status === "ACTIVE" &&
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
              className="inline-flex items-center gap-2 text-[14px] font-normal leading-5 tracking-[-0.15px] text-blue-600 hover:text-blue-700 dark:text-[#4EA1FF] dark:hover:text-[#7ABEFF]"
            >
              View uploaded contract <FiExternalLink size={20} />
            </button>
          </SectionCard>
        )}
    </>
  );
}
