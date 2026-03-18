/** @format */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import { useOnUserSwitch } from "@/app/_lib/useOnUserSwitch";
import {
  fetchMyBenefitRequests,
  fetchMyAuditLog,
  fetchBenefits,
} from "../_lib/api";
import type { MyBenefitRequest, AuditEntry } from "../_lib/api";

type EmployeeProfile = {
  id: string;
  name: string;
  role: string;
  employmentStatus: string;
};

export function MyProfileHeader({
  me,
  error,
  initials,
}: {
  me: EmployeeProfile | null;
  error: string | null;
  initials: string;
}) {
  return (
    <>
    <div>
      <Link
        href="/employee"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white mb-4"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
       Back
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My History</h1>
      <p className="text-slate-600 text-sm mt-1 dark:text-slate-400">
        History
      </p>
      {error ? <p className="mt-2 text-sm text-red-400">Error: {error}</p> : null}

      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="h-16 w-16 rounded-full bg-blue-600 text-white text-xl font-semibold flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {me?.name ?? "—"}
          </h2>
          <p className="text-slate-600 text-sm dark:text-slate-400">{me?.role ?? "—"}</p>
        </div>
      </div>
      </div>
    </>
  );
}

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

function getRequestStatusLabel(status: MyBenefitRequest["status"]): string {
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

function getEligibilityStatusLabel(status: string): string {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "Идэвхтэй";
    case "ELIGIBLE":
      return "Эрхтэй";
    case "LOCKED":
      return "Түгжигдсэн";
    case "PENDING":
      return "Хүлээгдэж буй";
    case "REJECTED":
      return "Татгалзсан";
    default:
      return status ?? "—";
  }
}

function getRequestStatusStyles(status: MyBenefitRequest["status"]) {
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

function getEligibilityStatusStyles(status: string) {
  const s = status?.toUpperCase();
  if (s === "ACTIVE" || s === "ELIGIBLE")
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
  if (s === "LOCKED" || s === "REJECTED")
    return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
  if (s === "PENDING")
    return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400";
  return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
}

type BenefitHistoryEvent =
  | { type: "request"; id: string; date: string; request: MyBenefitRequest }
  | { type: "audit"; id: string; date: string; audit: AuditEntry };

export function BenefitHistorySection() {
  const [requests, setRequests] = useState<MyBenefitRequest[]>([]);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [benefitNames, setBenefitNames] = useState<Record<string, string>>({});
  const [benefitCategories, setBenefitCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useOnUserSwitch(() => setRefreshKey((k) => k + 1));

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchMyBenefitRequests(),
      fetchMyAuditLog(),
      fetchBenefits(),
    ])
      .then(([reqs, audit, benefits]) => {
        if (cancelled) return;
        setRequests(reqs);
        setAuditEntries(audit);
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

  const eventsByBenefit = new Map<string, BenefitHistoryEvent[]>();
  requests.forEach((r) => {
    const list = eventsByBenefit.get(r.benefitId) ?? [];
    list.push({
      type: "request",
      id: r.id,
      date: r.createdAt,
      request: r,
    });
    eventsByBenefit.set(r.benefitId, list);
  });
  auditEntries.forEach((a) => {
    const list = eventsByBenefit.get(a.benefitId) ?? [];
    list.push({
      type: "audit",
      id: a.id,
      date: a.computedAt,
      audit: a,
    });
    eventsByBenefit.set(a.benefitId, list);
  });

  eventsByBenefit.forEach((list) => {
    list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  });

  const benefitIds = Array.from(eventsByBenefit.keys()).sort((a, b) => {
    const aEvents = eventsByBenefit.get(a) ?? [];
    const bEvents = eventsByBenefit.get(b) ?? [];
    const aLatest = aEvents[0]?.date ?? "";
    const bLatest = bEvents[0]?.date ?? "";
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
            No benefit history at the moment
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
              const events = eventsByBenefit.get(benefitId) ?? [];
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
              {events.map((ev) => {
                if (ev.type === "request") {
                  const isNegative =
                    ev.request.status === "REJECTED" ||
                    ev.request.status === "CANCELLED";
                  return (
                    <li
                      key={ev.id}
                      className="flex items-center gap-4 px-4 py-3"
                    >
                      <div
                        className={`h-9 w-9 flex-shrink-0 rounded-lg flex items-center justify-center ${getRequestStatusStyles(ev.request.status)}`}
                      >
                        {isNegative ? (
                          <HiOutlineXCircle className="h-5 w-5" />
                        ) : (
                          <HiOutlineCheckCircle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {getRequestStatusLabel(ev.request.status)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Хүсэгдсэн: {formatBenefitDateTime(ev.request.createdAt)}
                          {ev.request.contractAcceptedAt && (
                            <> · Хаагдсан: {formatBenefitDateTime(ev.request.contractAcceptedAt)}</>
                          )}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getRequestStatusStyles(ev.request.status)}`}
                      >
                        {getRequestStatusLabel(ev.request.status)}
                      </span>
                    </li>
                  );
                }
                const oldLabel = ev.audit.oldStatus
                  ? getEligibilityStatusLabel(ev.audit.oldStatus)
                  : null;
                const newLabel = getEligibilityStatusLabel(ev.audit.newStatus);
                const transitionText = oldLabel
                  ? `${oldLabel} → ${newLabel}`
                  : newLabel;
                const isNegative =
                  ev.audit.newStatus?.toUpperCase() === "LOCKED" ||
                  ev.audit.newStatus?.toUpperCase() === "REJECTED";
                return (
                  <li
                    key={ev.id}
                    className="flex items-center gap-4 px-4 py-3"
                  >
                    <div
                      className={`h-9 w-9 flex-shrink-0 rounded-lg flex items-center justify-center ${getEligibilityStatusStyles(ev.audit.newStatus)}`}
                    >
                      {isNegative ? (
                        <HiOutlineXCircle className="h-5 w-5" />
                      ) : (
                        <HiOutlineCheckCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-900 dark:text-white">
                        {transitionText}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatBenefitDateTime(ev.date)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getEligibilityStatusStyles(ev.audit.newStatus)}`}
                    >
                      {newLabel}
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
