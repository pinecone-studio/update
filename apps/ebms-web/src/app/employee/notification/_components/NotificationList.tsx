"use client";

import { NotificationCard } from "./NotificationCard";
import type { EmployeeNotification } from "../../_lib/api";

type NotificationListProps = {
  notifications: EmployeeNotification[];
  formatTime: (iso: string) => string;
  onMarkAsRead: (id: string) => void;
};

const GROUPS = ["Today", "Yesterday", "Earlier"] as const;

function getGroup(createdAt: string): (typeof GROUPS)[number] {
  const d = new Date(createdAt);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const notifDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor(
    (today.getTime() - notifDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Earlier";
}

export function NotificationList({
  notifications,
  formatTime,
  onMarkAsRead,
}: NotificationListProps) {
  const grouped = notifications.reduce<
    Record<(typeof GROUPS)[number], EmployeeNotification[]>
  >(
    (acc, n) => {
      const g = getGroup(n.createdAt);
      if (!acc[g]) acc[g] = [];
      acc[g].push(n);
      return acc;
    },
    { Today: [], Yesterday: [], Earlier: [] },
  );

  // Sort each group by createdAt descending (newest first)
  GROUPS.forEach((g) => {
    grouped[g].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  return (
    <section className="space-y-6">
      {GROUPS.map((group) => {
        const items = grouped[group];
        if (items.length === 0) return null;
        return (
          <div key={group} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-white/70">
              {group}
            </p>
            <div className="space-y-3">
              {items.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  relativeTime={formatTime(item.createdAt)}
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
