"use client";

import { useEffect, useState, useCallback } from "react";
import { Header } from "../components/Header";
import { BenefitPortfolio } from "@/app/_components/BenefitPortfolio";
import type { BenefitCardProps } from "@/app/_components/BenefitCard";
import { fetchMyBenefits, requestBenefit, getApiErrorMessage } from "../_lib/api";
import { mapMyBenefitsToCardProps } from "../_lib/mapBenefits";

export default function EmployeeBenefitsPage() {
  const [benefits, setBenefits] = useState<BenefitCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyBenefits();
      setBenefits(mapMyBenefitsToCardProps(data));
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

  return (
    <div>
      <Header />
      <div className="bg-[#0f172A] px-4 py-4 flex flex-col items-center gap-6 text-white w-full min-h-screen">
        <div className="w-full md:w-[921px] h-16 flex flex-col gap-[4px]">
          <div className="w-full h-9 flex items-center"></div>
          <div className="w-full h-6">
            <p className="text-[#64748B] text-sm">
              Check your eligibility status and track progress
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-[921px]">
          <div className="flex flex-wrap gap-2 md:gap-4">
            <div className="bg-[#1E293B] text-white px-4 py-2 rounded-full text-sm">
              Active Benefits ({activeCount})
            </div>
            <div className="text-[#94A3B8] px-4 py-2 text-sm">
              Eligibility Status
            </div>
            <div className="text-[#94A3B8] px-4 py-2 text-sm">
              Progress Timeline
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400">Error: {error}</p>
          )}

          {loading ? (
            <p className="text-[#94A3B8]">Loading benefits...</p>
          ) : (
            <>
              <div className="w-full md:w-[921px]">
                <BenefitPortfolio
                  benefits={benefits}
                  onRequestBenefit={handleRequestBenefit}
                />
              </div>
              <a
                href="/employee"
                className="w-full md:w-[921px] bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-xl font-medium text-center"
              >
                Back to Dashboard
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
