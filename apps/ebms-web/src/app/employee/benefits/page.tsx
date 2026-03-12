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
      <div className="bg-slate-50 px-4 py-4 flex flex-col items-center gap-6 text-slate-900 w-full min-h-screen dark:bg-[#0f172A] dark:text-white">
        <div className="w-full md:w-[921px] h-16 flex flex-col gap-[4px]">
          <div className="w-full h-9 flex items-center"></div>
          <div className="w-full h-6">
            <p className="text-slate-600 text-sm dark:text-[#64748B]">
              Check your eligibility status and track progress
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-[921px]">
          <div className="flex flex-wrap gap-2 md:gap-4">
            <div className="bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-full text-sm dark:bg-[#1E293B] dark:border-transparent dark:text-white">
              Active Benefits ({activeCount})
            </div>
            <div className="text-slate-600 px-4 py-2 text-sm dark:text-[#94A3B8]">
              Eligibility Status
            </div>
            <div className="text-slate-600 px-4 py-2 text-sm dark:text-[#94A3B8]">
              Progress Timeline
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400">Error: {error}</p>
          )}

          {loading ? (
            <p className="text-slate-600 dark:text-[#94A3B8]">Loading benefits...</p>
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
                className="w-full md:w-[921px] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-center dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
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
