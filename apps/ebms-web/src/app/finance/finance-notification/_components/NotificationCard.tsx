"use client";

import {
  HiOutlineBanknotes,
  HiOutlineReceiptPercent,
  HiOutlineCheckCircle,
  HiOutlineUserCircle,
  HiOutlineArrowUpRight,
  HiOutlineXCircle,
} from "react-icons/hi2";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  type: string;
  group: "Today" | "Yesterday" | "Earlier";
  unread: boolean;
  employee: string;
  benefit: string;
  amount: string;
  actions: string[];
};

type NotificationCardProps = {
  item: NotificationItem;
  onMarkAsRead?: (id: string) => void;
};

export function NotificationCard({ item, onMarkAsRead }: NotificationCardProps) {
  const toneClasses =
    item.type === "payment_pending"
      ? "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/20"
      : item.type === "reimbursement"
        ? "text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-500/20"
        : "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/20";

  const unreadClasses = item.unread
    ? "border-slate-200 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] dark:border-white/20 dark:shadow-none"
    : "border-slate-100 shadow-sm dark:border-white/10 dark:shadow-none";

  const CardIcon =
    item.type === "payment_pending"
      ? HiOutlineBanknotes
      : item.type === "reimbursement"
        ? HiOutlineReceiptPercent
        : HiOutlineCheckCircle;

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
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-white/20 dark:text-white/60">
                <HiOutlineUserCircle className="text-sm" />
                {item.employee}
              </span>
              <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-white/20 dark:text-white/60">
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
                  : "font-medium text-slate-900 dark:text-white/90"
              }`}
            >
              {item.title}
            </p>
            <p className="text-xs text-slate-600 dark:text-white/60">
              {item.body}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
              {item.amount}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-[11px] text-slate-500 dark:text-white/50">
            {item.time}
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            {item.actions.map((action) => (
              <button
                key={action}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/10"
              >
                {action}
                <HiOutlineArrowUpRight className="text-sm" />
              </button>
            ))}
            {item.actions.includes("Reject Payment") && (
              <button className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-600 transition hover:bg-red-100 dark:border-red-500/40 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30">
                Reject Payment
                <HiOutlineXCircle className="text-sm" />
              </button>
            )}
            {item.unread && onMarkAsRead && (
              <button
                onClick={() => onMarkAsRead(item.id)}
                className="rounded-xl border border-transparent px-3 py-2 text-[12px] text-slate-500 transition hover:text-slate-900 dark:text-white/60 dark:hover:text-white"
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
