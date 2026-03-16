"use client";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineInformationCircle,
  HiOutlineArrowUpRight,
  HiOutlineBell,
} from "react-icons/hi2";
import { useEffect, useMemo, useState } from "react";

type NotificationTone = "success" | "info" | "warning" | "neutral";

type AdminNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: NotificationTone;
  unread: boolean;
};

const STORAGE_KEY = "ebms_admin_notifications";

const DEFAULT_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "1",
    title: "New Vendor Contract Uploaded",
    body: "Vendor contract for Q2 2026 has been uploaded and is ready for review.",
    time: "1 hour ago",
    tone: "info",
    unread: true,
  },
  {
    id: "2",
    title: "Eligibility Review Required",
    body: "5 employees reached 1 year tenure and require benefit eligibility review.",
    time: "3 hours ago",
    tone: "success",
    unread: true,
  },
  {
    id: "3",
    title: "Audit Log Export Ready",
    body: "Your audit log export is ready to download from the audit log page.",
    time: "1 day ago",
    tone: "neutral",
    unread: false,
  },
  {
    id: "4",
    title: "Contract Renewal Reminder",
    body: "Vanguard Retirement Services contract expires in 60 days.",
    time: "2 days ago",
    tone: "warning",
    unread: false,
  },
  {
    id: "5",
    title: "Benefit Budget Threshold",
    body: "Q2 benefits budget has reached 80% utilization.",
    time: "3 days ago",
    tone: "info",
    unread: false,
  },
];

export default function AdminNotificationPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(
    DEFAULT_NOTIFICATIONS,
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    const term = search.trim().toLowerCase();
    return notifications.filter((n) => {
      if (activeFilter === "unread" && !n.unread) return false;
      if (!term) return true;
      return (
        n.title.toLowerCase().includes(term) ||
        n.body.toLowerCase().includes(term)
      );
    });
  }, [notifications, activeFilter, search]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AdminNotification[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        }
      } catch {
        // Ignore malformed storage.
      }
    }
  }, []);

  useEffect(() => {
    // Auto-mark all as read when entering the page.
    markAllAsRead();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-5 font-semibold text-white">Notifications</h1>
          <p className="mt-3 text-5 text-[#A7B6D3]">
            Admin alerts for contracts, eligibility, and audits
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsBellOpen((prev) => !prev)}
            className="relative grid h-12 w-12 place-items-center rounded-2xl border border-[#2C4264] bg-[#0F172A] text-[#C7D3E9] shadow-[0_12px_30px_-24px_rgba(15,23,42,0.65)] transition hover:border-[#3A5178] hover:bg-[#1B2840] hover:text-white"
            aria-label="Open notifications"
          >
            <HiOutlineBell className="text-2xl" />
            {unreadCount > 0 ? (
              <span className="absolute right-2.5 top-2.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#EF4444] px-1.5 text-[11px] font-semibold text-white shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </button>

          <div
            className={`absolute right-0 z-20 mt-3 w-[320px] rounded-3xl border border-[#2C4264] bg-[#0F172A] p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.85)] transition ${
              isBellOpen
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5 font-semibold text-white">Notifications</p>
                <p className="mt-1 text-5 text-[#8FA3C5]">
                  {unreadCount} unread
                </p>
              </div>
              <button
                onClick={markAllAsRead}
                className="rounded-xl border border-[#2C4264] bg-[#122033] px-3 py-1 text-[12px] text-[#C7D3E9] transition hover:border-[#3A5178] hover:text-white"
              >
                Mark all read
              </button>
            </div>

            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {notifications.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="w-full rounded-2xl border border-transparent bg-[#121C2F] p-3 text-left transition hover:border-[#2C4264] hover:bg-[#18253B]"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${
                        item.unread ? "bg-[#EF4444]" : "bg-[#3B4F72]"
                      }`}
                    />
                    <div className="space-y-1">
                      <p className="text-5 font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-[#9DB1D6]">{item.body}</p>
                      <p className="text-[11px] text-[#6F85AD]">{item.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 border-t border-[#1C2B45] pt-3">
              <button className="w-full rounded-xl border border-[#2C4264] bg-[#121C2F] px-4 py-2 text-5 text-[#9DB1D6] transition hover:border-[#3A5178] hover:text-white">
                View all notifications
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-5">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-[#A7B6D3]">Unread</p>
            <span className="mt-1 h-4 w-4 rounded-full bg-[#3E82F7]" />
          </div>
          <p className="text-5 font-semibold text-white">{unreadCount}</p>
        </article>

        <article className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-5">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-[#A7B6D3]">Today</p>
            <span className="mt-1 h-4 w-4 rounded-full bg-[#FFB21C]" />
          </div>
          <p className="text-5 font-semibold text-white">{unreadCount}</p>
        </article>

        <article className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-5">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-[#A7B6D3]">Total</p>
            <span className="mt-1 h-4 w-4 rounded-full bg-[#19D463]" />
          </div>
          <p className="text-5 font-semibold text-white">
            {notifications.length}
          </p>
        </article>
      </section>

      <section className="flex flex-wrap items-center gap-2 text-5 text-[#A7B6D3]">
        <button
          onClick={() => setActiveFilter("all")}
          className={`rounded-full border border-[#2C4264] px-4 py-2 ${
            activeFilter === "all"
              ? "bg-[#1E293B] text-white"
              : "bg-[#0F172A] transition hover:bg-[#1E293B] hover:text-white"
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setActiveFilter("unread")}
          className={`rounded-full border border-[#2C4264] px-4 py-2 ${
            activeFilter === "unread"
              ? "bg-[#1E293B] text-white"
              : "bg-[#0F172A] transition hover:bg-[#1E293B] hover:text-white"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </section>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-4">
        <div className="flex items-center gap-3">
          <HiOutlineMagnifyingGlass className="text-[#8FA3C5]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-5 text-white placeholder:text-[#8595B6] outline-none"
            placeholder="Search notifications..."
          />
          <button
            onClick={markAllAsRead}
            className="rounded-xl border border-[#4B5D83] bg-[#334160] px-4 py-2 text-5 text-[#D4DEEF] transition hover:bg-[#3A4A6C]"
          >
            Mark All as Read
          </button>
        </div>
      </section>

      <section className="space-y-4">
        {filteredNotifications.map((item) => {
          const toneClasses =
            item.tone === "success"
              ? "text-[#34D399]"
              : item.tone === "warning"
                ? "text-[#FBBF24]"
                : item.tone === "info"
                  ? "text-[#4F86FF]"
                  : "text-[#A7B6D3]";

          return (
            <article
              key={item.id}
              className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-full bg-[#122033] ${toneClasses}`}
                  >
                    <HiOutlineInformationCircle className="text-lg" />
                  </div>
                  <div>
                    <p className="text-5 font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-2 text-5 text-[#A7B6D3]">{item.body}</p>
                    <p className="mt-3 text-5 text-[#8192B3]">{item.time}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="inline-flex items-center gap-2 text-5 text-[#4F86FF] transition hover:text-[#7AA2FF]">
                    View Details
                    <HiOutlineArrowUpRight className="text-base" />
                  </button>
                  {item.unread ? (
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="text-5 text-[#A7B6D3] transition hover:text-white"
                    >
                      Mark as Read
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
