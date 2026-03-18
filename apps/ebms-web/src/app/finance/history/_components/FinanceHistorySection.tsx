/** @format */

"use client";

import { useEffect, useState } from "react";
import { useOnUserSwitch } from "@/app/_lib/useOnUserSwitch";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import { getFinanceClient, fetchBenefitRequests, fetchBenefits } from "../../_lib/api";
import type { BenefitRequest } from "../../_lib/api";

function formatBenefitDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRequestStatusLabel(status: BenefitRequest["status"]): string {
  switch (status) {
    case "APPROVED":
      return "Баталгаажсан";
    case "ADMIN_APPROVED":
      return "Санхүүгийн баталгаажлага хүлээгдэж буй";
    case "PENDING":
      return "Хүлээгдэж буй";
    case "REJECTED":
      return "Татгалзсан";
    case "CANCELLED":
      return "Цуцлагдсан";
    default:
      return status;
  }
}

function getRequestStatusStyles(status: BenefitRequest["status"]) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
    case "ADMIN_APPROVED":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400";
    case "PENDING":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400";
    case "REJECTED":
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
    case "CANCELLED":
      return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
  }
}

export function FinanceHistorySection() {
  const [requests, setRequests] = useState<BenefitRequest[]>([]);
  const [benefitNames, setBenefitNames] = useState<Record<string, string>>({});
  const [benefitCategories, setBenefitCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useOnUserSwitch(() => setRefreshKey((k) => k + 1));

  useEffect(() => {
    let cancelled = false;
    const client = getFinanceClient();
    Promise.all([
      fetchBenefitRequests(client),
      fetchBenefits(client),
    ])
      .then(([reqs, benefits]) => {
        if (cancelled) return;
        const approvedOrRejected = reqs.filter(
          (r) => r.status === "APPROVED" || r.status === "REJECTED",
        );
        setRequests(approvedOrRejected);
        const names: Record<string, string> = {};
        const categories: Record<string, string> = {};
        benefits.forEach((b) => {
          names[b.id] = b.name;
          categories[b.id] = b.category ?? "Other";
        });
        reqs.forEach((r) => {
          if (r.benefitName) names[r.benefitId] = r.benefitName;
        });
        setBenefitNames(names);
        setBenefitCategories(categories);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const getBenefitName = (benefitId: string) =>
    benefitNames[benefitId] ?? benefitId;

  const getBenefitCategory = (benefitId: string) =>
    benefitCategories[benefitId] ?? "Other";

  const eventsByBenefit = new Map<string, BenefitRequest[]>();
  requests.forEach((r) => {
    const list = eventsByBenefit.get(r.benefitId) ?? [];
    list.push(r);
    eventsByBenefit.set(r.benefitId, list);
  });

  eventsByBenefit.forEach((list) => {
    list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  const benefitIds = Array.from(eventsByBenefit.keys()).sort((a, b) => {
    const aList = eventsByBenefit.get(a) ?? [];
    const bList = eventsByBenefit.get(b) ?? [];
    const aLatest = aList[0]?.createdAt ?? "";
    const bLatest = bList[0]?.createdAt ?? "";
    return new Date(bLatest).getTime() - new Date(aLatest).getTime();
  });

  const benefitsByCategory = benefitIds.reduce<Record<string, string[]>>(
    (acc, benefitId) => {
      const cat = getBenefitCategory(benefitId);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(benefitId);
      return acc;
    },
    {},
  );

  const categoryOrder = Array.from(new Set(benefitIds.map(getBenefitCategory)));

  if (loading) {
    return (
      <div className="mt-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (benefitIds.length === 0) {
    return (
      <div className="mt-6">
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 py-16 dark:border-slate-600">
          <HiOutlineCheckCircle className="h-14 w-14 text-slate-300 dark:text-slate-500" />
          <p className="text-slate-500 dark:text-slate-400">
            Баталгаажсан эсвэл татгалзсан хүсэлт байхгүй байна
          </p>
        </div>
      </div>
    );
  }

  const isTwoCategories = categoryOrder.length === 2;

  return (
    <div
      className={`mt-6 flex flex-col gap-6 w-full max-w-[1500px] mx-auto`}
    >
      <div
        className={
          isTwoCategories
            ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
            : "flex flex-col gap-6"
        }
      >
      {categoryOrder.map((category) => (
        <section key={category}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {category}
          </h3>
          <div className="flex flex-col gap-4">
            {benefitsByCategory[category]?.map((benefitId) => {
              const benefitRequests = eventsByBenefit.get(benefitId) ?? [];
              const benefitName = getBenefitName(benefitId);
              return (
                <div
                  key={benefitId}
                  className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden"
                >
            <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <p className="font-semibold text-slate-900 dark:text-white">
                {benefitName}
              </p>
            </div>
            <ul className="divide-y divide-slate-200 dark:divide-white/10">
              {benefitRequests.map((r) => {
                const isNegative =
                  r.status === "REJECTED" || r.status === "CANCELLED";
                return (
                  <li
                    key={r.id}
                    className="flex items-center gap-4 px-4 py-3"
                  >
                    <div
                      className={`h-9 w-9 flex-shrink-0 rounded-lg flex items-center justify-center ${getRequestStatusStyles(r.status)}`}
                    >
                      {isNegative ? (
                        <HiOutlineXCircle className="h-5 w-5" />
                      ) : (
                        <HiOutlineCheckCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {r.employeeName ?? r.employeeId} ·{" "}
                        {getRequestStatusLabel(r.status)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Хүсэгдсэн: {formatBenefitDateTime(r.createdAt)}
                        {r.contractAcceptedAt && (
                          <> · Хаагдсан: {formatBenefitDateTime(r.contractAcceptedAt)}</>
                        )}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getRequestStatusStyles(r.status)}`}
                    >
                      {getRequestStatusLabel(r.status)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
          </div>
        </section>
      ))}
      </div>
    </div>
  );
}
