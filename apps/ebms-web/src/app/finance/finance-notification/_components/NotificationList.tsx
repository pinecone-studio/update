"use client";

import { NotificationCard } from "./NotificationCard";

type NotificationType =
  | "payment_pending"
  | "reimbursement"
  | "payment_completed"
  | string;

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  type: NotificationType;
  group: "Today" | "Yesterday" | "Earlier";
  unread: boolean;
  employee: string;
  benefit: string;
  amount: string;
  actions: string[];
};

type NotificationListProps = {
  notifications: NotificationItem[];
};

const GROUPS = ["Today", "Yesterday", "Earlier"] as const;

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <section className="space-y-6">
      {GROUPS.map((group) => {
        const items = notifications.filter((n) => n.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-white/70">
              {group}
            </p>
            <div className="space-y-3">
              {items.map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
