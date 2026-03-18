/** @format */

"use client";

import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiExternalLink,
  FiFileText,
  FiShield,
  FiX,
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

interface BenefitModalDetailsProps {
  benefit: BenefitCardProps;
  theme: {
    section: string;
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
  const subsidy = benefit.subsidyPercentage
    ? `${benefit.subsidyPercentage} subsidy`
    : "-";
  const shouldScrollRules = rules.length > 2;

  const handleViewContract = () => {
    if (onViewContract) {
      void onViewContract(benefit);
    }
  };

  return (
    <>
      <SectionCard
        theme={theme.section}
        icon={<FiFileText size={22} />}
        title="DESCRIPTION"
        className="min-h-[74px]"
      >
        <p className="text-[14px] leading-5 tracking-[-0.15px] text-white/95">
          {benefit.description || benefit.eligibilityCriteria}
        </p>
      </SectionCard>

      <div className="grid gap-3 md:grid-cols-2">
        <SectionCard
          theme={theme.section}
          icon={<FiShield size={18} />}
          title="SUBSIDY"
          className="min-h-[78px]"
        >
          <p className="text-[16px] font-semibold text-white">{subsidy}</p>
        </SectionCard>
        <SectionCard
          theme={theme.section}
          icon={<FiFileText size={18} />}
          title="VENDOR"
          className="min-h-[78px]"
        >
          <p className="text-[16px] font-medium text-white">{vendor}</p>
        </SectionCard>
      </div>

      <SectionCard
        theme={theme.section}
        icon={<FiFileText size={18} />}
        title="ELIGIBILITY CRITERIA"
        className="min-h-[78px]"
      >
        <p className="text-[14px] leading-5 tracking-[-0.15px] text-white/95">
          {benefit.eligibilityCriteria || "All active employees"}
        </p>
      </SectionCard>

      <SectionCard
        theme={theme.section}
        icon={<FiFileText size={18} />}
        title="VENDOR CONTRACT"
        className="min-h-[78px]"
      >
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
          <p className="text-[14px] font-normal leading-5 tracking-[-0.15px] text-white/55">
            No contract linked.
          </p>
        )}
      </SectionCard>

      {benefit.status === "ACTIVE" &&
        benefit.uploadedContractRequestId &&
        benefit.requiresContract && (
          <SectionCard
            theme={theme.section}
            icon={<FiFileText size={18} />}
            title="UPLOADED CONTRACT"
            className="min-h-[78px]"
          >
            <button
              type="button"
              onClick={() => {
                if (onViewUploadedContract && benefit.uploadedContractRequestId) {
                  void onViewUploadedContract(benefit.uploadedContractRequestId);
                }
              }}
              className="inline-flex items-center gap-2 text-[14px] font-normal leading-5 tracking-[-0.15px] text-[#4EA1FF] hover:text-[#7ABEFF]"
            >
              View uploaded contract <FiExternalLink size={20} />
            </button>
          </SectionCard>
        )}

      {benefit.status === "ACTIVE" &&
        (benefit.benefitStartDate || benefit.benefitEndDate) && (
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard
              theme={theme.section}
              icon={<FiCalendar size={18} />}
              title="BENEFIT STARTED"
              className="min-h-[78px]"
            >
              <p className="text-[15px] font-semibold leading-7 tracking-[0.2px] text-white">
                {benefit.benefitStartDate || "-"}
              </p>
            </SectionCard>
            <SectionCard
              theme={theme.section}
              icon={<FiClock size={18} />}
              title="BENEFIT ENDS"
              className="min-h-[78px]"
            >
              <p className="text-[15px] font-semibold leading-7 tracking-[0.2px] text-white">
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

        <div
          className={`w-full space-y-2 ${
            shouldScrollRules
              ? "max-h-[236px] overflow-y-auto pr-1"
              : ""
          }`}
        >
          {rules.map((rule, index) => (
            <div
              key={`${rule.rule}-${index}`}
              className={`min-h-[70px] rounded-2xl border px-[14px] pb-[6px] pt-[12px] ${
                rule.passed ? theme.rulePass : theme.ruleFail
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] bg-black/20 text-white/90">
                  {rule.passed ? <FiCheck size={16} /> : <FiX size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold leading-6 tracking-[0.1px] text-white">
                    {rule.rule}
                  </p>
                  {rule.detail ? (
                    <p className="mt-0 text-[14px] font-normal leading-5 tracking-[-0.15px] text-white/65">
                      {rule.detail}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`inline-flex h-[30px] min-w-[59px] shrink-0 items-center justify-center self-center rounded-[10px] px-3 text-[12px] font-semibold leading-5 tracking-[-0.05px] ${
                    rule.passed
                      ? "bg-[#00BC7D]/20 text-[#00E0A6]"
                      : "bg-[#ff637e]/18 text-[#ff8ea1]"
                  }`}
                >
                  {rule.passed ? "PASS" : "FAIL"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
