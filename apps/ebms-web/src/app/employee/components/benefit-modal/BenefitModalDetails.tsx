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
      className={`rounded-2xl border px-[20.57px] pb-[12px] pt-[20.57px] ${theme} ${className ?? ""}`}
    >
      <div className="mb-2 flex items-center gap-2.5 text-white/55">
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
}

export function BenefitModalDetails({
  benefit,
  theme,
  rules,
  onViewContract,
}: BenefitModalDetailsProps) {
  const vendor = (benefit.vendorDetails ?? "").trim() || "Pinecone";
  const subsidy = benefit.subsidyPercentage
    ? `${benefit.subsidyPercentage} subsidy`
    : "-";

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
        <SectionCard
          theme={theme.section}
          icon={<FiShield size={18} />}
          title="SUBSIDY"
          className="min-h-[93px]"
        >
          <p className="text-[22px] font-semibold text-white">{subsidy}</p>
        </SectionCard>
        <SectionCard
          theme={theme.section}
          icon={<FiFileText size={18} />}
          title="VENDOR"
          className="min-h-[93px]"
        >
          <p className="text-[22px] font-medium text-white">{vendor}</p>
        </SectionCard>
      </div>

      <SectionCard
        theme={theme.section}
        icon={<FiFileText size={18} />}
        title="VENDOR CONTRACT"
        className="min-h-[93px]"
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
        (benefit.benefitStartDate || benefit.benefitEndDate) && (
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard
              theme={theme.section}
              icon={<FiCalendar size={18} />}
              title="BENEFIT STARTED"
              className="min-h-[93px]"
            >
              <p className="text-[22px] font-semibold leading-8 tracking-[0.2px] text-white">
                {benefit.benefitStartDate || "-"}
              </p>
            </SectionCard>
            <SectionCard
              theme={theme.section}
              icon={<FiClock size={18} />}
              title="BENEFIT ENDS"
              className="min-h-[93px]"
            >
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
              className={`min-h-[121px] rounded-2xl border px-[20px] pb-[16px] pt-[20px] ${
                rule.passed ? theme.rulePass : theme.ruleFail
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-[16px] bg-black/20 text-white/90">
                  {rule.passed ? <FiCheck size={22} /> : <FiX size={22} />}
                </div>
                <div className="min-w-0">
                  <p className="text-[22px] font-semibold leading-8 tracking-[0.2px] text-white">
                    {rule.rule}
                  </p>
                  {rule.detail ? (
                    <p className="mt-1 text-[14px] font-normal leading-5 tracking-[-0.15px] text-white/65">
                      {rule.detail}
                    </p>
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
  );
}
