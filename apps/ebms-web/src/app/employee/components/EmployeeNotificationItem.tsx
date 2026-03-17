/** @format */

"use client";

import Link from "next/link";
import {
  HiOutlineArrowUpRight,
  HiOutlineInformationCircle,
} from "react-icons/hi2";

export type EmployeeNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  tone: "SUCCESS" | "INFO" | "WARNING" | "NEUTRAL";
  type: "ELIGIBILITY_CHANGE" | "REQUEST_STATUS" | "WARNING";
  isRead: boolean;
  metadata?: string | null;
};

interface EmployeeNotificationItemProps {
  item: EmployeeNotification;
  relativeTime: string;
  onMarkRead?: () => void;
}

export function EmployeeNotificationItem({
  item,
  relativeTime,
  onMarkRead,
}: EmployeeNotificationItemProps) {
  const toneClasses =
    item.tone === "SUCCESS"
      ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
      : item.tone === "WARNING"
        ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10"
        : item.tone === "INFO"
          ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10"
          : "text-slate-500 bg-slate-100 dark:text-slate-300 dark:bg-slate-500/10";

  const unreadClasses = !item.isRead
    ? "bg-white/90 border-slate-200 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] dark:bg-[#1F2A3D] dark:border-[#2A3A52]"
    : "bg-white border-slate-100 shadow-sm dark:bg-[#161F2F] dark:border-[#223044]";

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
    <div
      className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${unreadClasses}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`grid h-10 w-10 place-items-center rounded-full border ${toneClasses}`}
          >
            <HiOutlineInformationCircle className="text-lg" />
          </div>

          <div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-[#2A3A52] dark:bg-[#121A28] dark:text-slate-300">
              {item.type === "ELIGIBILITY_CHANGE"
                ? "Eligibility"
                : item.type === "REQUEST_STATUS"
                  ? "Request"
                  : "Warning"}
            </span>
            <p className="text-slate-900 text-sm font-semibold dark:text-white">
              {item.title}
            </p>
            <p className="text-slate-600 text-xs mt-1 dark:text-slate-300">
              {item.body}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {relativeTime}
          </p>
          <div className="flex items-center gap-3">
            {actionHref && (
              <Link
                href={actionHref}
                onClick={onMarkRead}
                className="text-xs text-blue-600 hover:text-blue-500 inline-flex items-center gap-1 whitespace-nowrap dark:text-blue-400 dark:hover:text-blue-300"
              >
                Open
                <HiOutlineArrowUpRight className="text-sm" />
              </Link>
            )}
            {onMarkRead && (
              <button
                type="button"
                onClick={onMarkRead}
                className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center dark:text-slate-400 dark:hover:text-slate-200"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
