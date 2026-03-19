"use client";

import Link from "next/link";
import { useState } from "react";
import type { AdminNotification } from "./admin-header-constants";

type AdminNotificationDropdownProps = {
  open: boolean;
  notifications: AdminNotification[];
  unreadCount: number;
  onClose: () => void;
  onMarkAllRead: () => void;
};

function NotificationDot({ n }: { n: AdminNotification }) {
  const dotClass = n.unread ? "bg-red-500" : "bg-slate-400";
  return (
    <span
      className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotClass}`}
    />
  );
}

export function AdminNotificationDropdown({
  open,
  notifications,
  unreadCount,
  onClose,
  onMarkAllRead,
}: AdminNotificationDropdownProps) {
  const [filter, setFilter] = useState<"unread" | "all">("unread");
  const filtered =
    filter === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications;

  if (!open) return null;

  return (
    <div
      className="absolute right-0 top-full z-50 mt-3 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#0E1622] shadow-[0_28px_70px_-40px_rgba(0,0,0,0.85)]"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold text-white">Notifications</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`text-xs font-medium transition ${
              filter === "unread"
                ? "text-white underline underline-offset-2"
                : "text-white/60 hover:text-white"
            }`}
          >
            Unread
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`text-xs font-medium transition ${
              filter === "all"
                ? "text-white underline underline-offset-2"
                : "text-white/60 hover:text-white"
            }`}
          >
            All
          </button>
        </div>
      </div>
      <div className="max-h-[320px] space-y-2 overflow-y-auto px-3 py-3">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-xs text-white/50">
            No notifications
          </p>
        ) : (
          filtered.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/5 bg-white/5 p-3"
            >
              <div className="flex gap-3">
                <NotificationDot n={item} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="flex-shrink-0 text-[11px] text-white/40">
                      {item.time}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs text-white/60">
                    {item.subtitle ?? item.body}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-3 py-3">
        <Link
          href="/admin/admin-notification"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 transition hover:text-blue-300"
        >
          View all →
        </Link>
        {unreadCount > 0 && onMarkAllRead && (
          <button
            type="button"
            onClick={() => {
              onMarkAllRead();
              onClose();
            }}
            className="text-xs font-medium text-white/60 transition hover:text-white"
          >
            Mark all as read
          </button>
        )}
      </div>
    </div>
  );
}
