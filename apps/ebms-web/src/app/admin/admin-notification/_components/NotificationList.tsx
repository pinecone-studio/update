"use client";

import { NotificationCard } from "./NotificationCard";

export type AdminNotificationType =
  | "request"
  | "document"
  | "eligibility"
  | "warning"
  | "system";

export type AdminNotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  type: AdminNotificationType;
  group: "Today" | "Yesterday" | "Earlier";
  unread: boolean;
  employeeName: string;
  benefit: string;
  actions: string[];
  isPending?: boolean;
};

type NotificationListProps = {
  notifications: AdminNotificationItem[];
  onMarkAsRead: (id: string) => void;
};

const GROUPS = ["Today", "Yesterday", "Earlier"] as const;

export function NotificationList({
  notifications,
  onMarkAsRead,
}: NotificationListProps) {
  return (
    <section className="space-y-6">
      {GROUPS.map((group) => {
        const items = notifications.filter((n) => n.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-white/50">
              {group}
            </p>
            <div className="space-y-3">
              {items.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
