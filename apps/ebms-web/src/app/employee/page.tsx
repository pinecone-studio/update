"use client";

import { useEffect, useState, useCallback } from "react";
import { FiCheck, FiStar, FiActivity } from "react-icons/fi";
import { CgArrowRight } from "react-icons/cg";
import { BenefitPortfolio } from "@/app/_components/BenefitPortfolio";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import { Header } from "./components/Header";
import { fetchMe, fetchMyBenefits, requestBenefit, getApiErrorMessage } from "./_lib/api";
import { mapMyBenefitsToCardProps } from "./_lib/mapBenefits";

const CardIcon = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <div
    className={`flex items-center justify-center w-12 h-12 rounded-lg ${className}`}
  >
    {children}
  </div>
);

export default function EmployeeDashboardPage() {
  const [me, setMe] = useState<{ name: string; okrSubmitted: boolean } | null>(null);
  const [benefits, setBenefits] = useState<BenefitCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [meRes, myBenefitsRes] = await Promise.all([
        fetchMe(),
        fetchMyBenefits(),
      ]);
      setMe({ name: meRes.name, okrSubmitted: meRes.okrSubmitted });
      setBenefits(mapMyBenefitsToCardProps(myBenefitsRes));
    } catch (e) {
      setError(getApiErrorMessage(e));
      setBenefits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRequestBenefit = useCallback(async (benefit: BenefitCardProps) => {
    if (!benefit.benefitId) return;
    try {
      await requestBenefit(benefit.benefitId);
      await load();
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  }, [load]);

  const activeCount = benefits.filter((b) => b.status === "ACTIVE").length;
  const eligibleCount = benefits.filter((b) => b.status === "ELIGIBLE").length;

  return (
    <div>
      <Header />
      <div className="min-h-screen w-full bg-[#0f172a] p-8">
        <div className="flex flex-col mb-8">
          <h1 className="text-[32px] font-bold text-white leading-tight">
            Welcome back, {me?.name ?? "..."}!
          </h1>
          <p className="text-base text-[#AAAAAA] mt-1">
            Your complete benefits portfolio and eligibility status
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-400">Error: {error}</p>
          )}
        </div>

        {loading ? (
          <p className="text-[#94A3B8]">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div className="min-w-0 rounded-[10px] bg-[#334155] p-6 flex flex-col min-h-[134px]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-[#99A1AF]">Active Benefits</p>
                    <p className="text-[48px] font-bold text-white leading-none mt-1">
                      {activeCount}
                    </p>
                    <p className="text-sm text-[#99A1AF] mt-1">Currently enrolled</p>
                  </div>
                  <CardIcon className="bg-[#4CAF50]/20">
                    <FiCheck size={24} color="#4CAF50" strokeWidth={2.5} />
                  </CardIcon>
                </div>
              </div>

              <div className="min-w-0 rounded-[10px] bg-[#334155] p-6 flex flex-col min-h-[134px]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-[#99A1AF]">Eligible Benefits</p>
                    <p className="text-[48px] font-bold text-white leading-none mt-1">
                      {eligibleCount}
                    </p>
                    <p className="text-sm text-[#99A1AF] mt-1">Ready to request</p>
                  </div>
                  <CardIcon className="bg-[#2196F3]/20">
                    <FiStar size={24} color="#2196F3" strokeWidth={2} />
                  </CardIcon>
                </div>
              </div>

              <div className="min-w-0 rounded-[10px] bg-[#334155] p-6 flex flex-col min-h-[134px]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-[#99A1AF]">OKR Performance</p>
                    <p className="text-[48px] font-bold text-white leading-none mt-1">
                      {me?.okrSubmitted ? "—" : "—"}
                    </p>
                    <p className="text-sm text-[#99A1AF] mt-1">
                      {me?.okrSubmitted ? "OKR submitted" : "OKR not submitted"}
                    </p>
                  </div>
                  <CardIcon className="bg-[#9C27B0]/20">
                    <FiActivity size={24} color="#9C27B0" strokeWidth={2} />
                  </CardIcon>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 mb-6">
              <h2 className="text-xl text-white font-semibold">Benefit Portfolio</h2>
              <a
                href="/employee/benefits"
                className="px-4 py-2 border border-[#64748b] flex items-center gap-2 rounded-full text-white text-sm hover:bg-[#334155] transition-colors"
              >
                View Eligibility Details
                <CgArrowRight size={16} />
              </a>
            </div>

            <BenefitPortfolio
              benefits={benefits}
              onRequestBenefit={handleRequestBenefit}
            />

            <div className="mt-6 rounded-lg bg-[#1f2a40] p-5 flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2196F3]/30 flex items-center justify-center border border-[#2196F3]/50">
                <svg className="w-5 h-5 text-[#2196F3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white">
                  Automatic Eligibility Tracking
                </h3>
                <p className="text-sm text-[#94a3b8] mt-1">
                  Your eligibility is computed from the database (employment status, OKR, attendance, etc.). Request benefits when status is ELIGIBLE.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
