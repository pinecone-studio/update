"use client";

import {
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineCog6Tooth,
  HiOutlineUserCircle,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";

import type { AdminNotificationItem } from "./NotificationList";

type NotificationCardProps = {
  item: AdminNotificationItem;
  onMarkAsRead: (id: string) => void;
};

export function NotificationCard({ item, onMarkAsRead }: NotificationCardProps) {
  const toneClasses =
    item.type === "request"
      ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10"
      : item.type === "document"
        ? "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10"
        : item.type === "eligibility"
          ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
          : item.type === "warning"
            ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10"
            : "text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-500/10";

  const unreadClasses = item.unread
    ? "border-slate-200 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] dark:border-white/20 dark:bg-white/5"
    : "border-slate-100 shadow-sm dark:border-white/10 dark:bg-white/5";

  const CardIcon =
    item.type === "request"
      ? HiOutlineCheckCircle
      : item.type === "document"
        ? HiOutlineDocumentText
        : item.type === "eligibility"
          ? HiOutlineInformationCircle
          : item.type === "warning"
            ? HiOutlineExclamationTriangle
            : HiOutlineCog6Tooth;

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
                <HiOutlineUserCircle className="text-sm" />
                {item.employeeName}
              </span>
              <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-white/20 dark:text-slate-300">
                {item.benefit}
              </span>
              {item.unread && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </div>
            <p
              className={`text-sm ${
                item.unread
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
            {item.time}
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            {item.actions.map((action) => (
              <button
                key={action}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
              >
                {action}
                <HiOutlineArrowUpRight className="text-sm" />
              </button>
            ))}
            {item.unread && (
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
