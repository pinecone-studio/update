"use client";

import Link from "next/link";
import {
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";
import type { EmployeeNotification } from "../../_lib/api";

type NotificationCardProps = {
  item: EmployeeNotification;
  relativeTime: string;
  onMarkAsRead: (id: string) => void;
};

export function NotificationCard({
  item,
  relativeTime,
  onMarkAsRead,
}: NotificationCardProps) {
  const toneClasses =
    item.tone === "SUCCESS"
      ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
      : item.tone === "WARNING"
        ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10"
        : item.tone === "INFO"
          ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10"
          : "text-slate-500 bg-slate-100 dark:text-slate-300 dark:bg-slate-500/10";

  const unreadClasses = !item.isRead
    ? "border-slate-200 bg-white shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] dark:border-white/20 dark:bg-white/5"
    : "border-slate-100 bg-white shadow-sm dark:border-white/10 dark:bg-white/5";

  const CardIcon =
    item.type === "ELIGIBILITY_CHANGE"
      ? HiOutlineInformationCircle
      : item.type === "REQUEST_STATUS"
        ? HiOutlineCheckCircle
        : HiOutlineExclamationTriangle;

  const typeLabel =
    item.type === "ELIGIBILITY_CHANGE"
      ? "Eligibility"
      : item.type === "REQUEST_STATUS"
        ? "Request"
        : "Warning";

  let actionHref: string | null = null;
  try {
    const parsed = item.metadata ? JSON.parse(item.metadata) : null;
    if (parsed?.action === "UPLOAD_SIGNED_CONTRACT") {
      actionHref = "/employee";
    }
  } catch {
    // ignore malformed metadata
  }

  return (
    <article
      className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${unreadClasses}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`grid h-9 w-9 place-items-center rounded-full ${toneClasses}`}
          >
            <CardIcon className="text-lg" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-white/20 dark:text-slate-300">
                {typeLabel}
              </span>
              {!item.isRead && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </div>
            <p
              className={`text-sm ${
                !item.isRead
                  ? "font-semibold text-slate-900 dark:text-white"
                  : "font-medium text-slate-800 dark:text-slate-100"
              }`}
            >
              {item.title}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {item.body}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {relativeTime}
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            {actionHref && (
              <Link
                href={actionHref}
                onClick={() => onMarkAsRead(item.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Open
                <HiOutlineArrowUpRight className="text-sm" />
              </Link>
            )}
            {!item.isRead && (
              <button
                onClick={() => onMarkAsRead(item.id)}
                className="rounded-xl border border-transparent px-3 py-2 text-[12px] text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
