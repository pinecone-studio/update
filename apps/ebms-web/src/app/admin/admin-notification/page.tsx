"use client";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineArrowUpRight,
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineDocumentText,
  HiOutlineCog6Tooth,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { useEffect, useMemo, useState } from "react";

type NotificationType =
  | "request"
  | "document"
  | "eligibility"
  | "warning"
  | "system";

type AdminNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  type: NotificationType;
  group: "Today" | "Yesterday" | "Earlier";
  unread: boolean;
  employeeName: string;
  benefit: string;
  actions: string[];
  isPending?: boolean;
};

const STORAGE_KEY = "ebms_admin_notifications";

const DEFAULT_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "n1",
    title: "New Benefit Request",
    body: "Bat-Erdene submitted a request for Gym Membership.",
    time: "10 minutes ago",
    type: "request",
    group: "Today",
    unread: true,
    employeeName: "Bat-Erdene",
    benefit: "Gym Membership",
    actions: ["Review Request"],
    isPending: true,
  },
  {
    id: "n2",
    title: "Employee Contract Uploaded",
    body: "Nomin uploaded a contract for Education Allowance.",
    time: "45 minutes ago",
    type: "document",
    group: "Today",
    unread: true,
    employeeName: "Nomin",
    benefit: "Education Allowance",
    actions: ["Review Document"],
  },
  {
    id: "n3",
    title: "Employee Became Eligible",
    body: "Nomin is now eligible for Education Allowance.",
    time: "2 hours ago",
    type: "eligibility",
    group: "Today",
    unread: true,
    employeeName: "Nomin",
    benefit: "Education Allowance",
    actions: ["View Employee"],
  },
  {
    id: "n4",
    title: "Attendance Warning",
    body: "Bat-Erdene has 3 late arrivals this month.",
    time: "6 hours ago",
    type: "warning",
    group: "Today",
    unread: false,
    employeeName: "Bat-Erdene",
    benefit: "Attendance",
    actions: ["View Details"],
  },
  {
    id: "n5",
    title: "Benefit Configuration Updated",
    body: "Education Allowance eligibility rules were modified.",
    time: "Yesterday",
    type: "system",
    group: "Yesterday",
    unread: false,
    employeeName: "System",
    benefit: "Education Allowance",
    actions: ["View Configuration"],
  },
  {
    id: "n6",
    title: "New Benefit Request",
    body: "Ariunaa submitted a request for Transit Pass.",
    time: "Yesterday",
    type: "request",
    group: "Yesterday",
    unread: false,
    employeeName: "Ariunaa",
    benefit: "Transit Pass",
    actions: ["Review Request"],
    isPending: true,
  },
  {
    id: "n7",
    title: "Employee Contract Uploaded",
    body: "Batsaikhan uploaded a contract for Home Office Stipend.",
    time: "2 days ago",
    type: "document",
    group: "Earlier",
    unread: false,
    employeeName: "Batsaikhan",
    benefit: "Home Office Stipend",
    actions: ["Review Document"],
  },
  {
    id: "n8",
    title: "Employee Became Eligible",
    body: "Temuulen is now eligible for Gym Membership.",
    time: "3 days ago",
    type: "eligibility",
    group: "Earlier",
    unread: false,
    employeeName: "Temuulen",
    benefit: "Gym Membership",
    actions: ["View Employee"],
  },
];

export default function AdminNotificationPage() {
  const [activeTab, setActiveTab] = useState<
    | "all"
    | "requests"
    | "documents"
    | "eligibility"
    | "warnings"
    | "system"
    | "unread"
  >("all");
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState<AdminNotification[]>(
    DEFAULT_NOTIFICATIONS,
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );
  const todayCount = useMemo(
    () => notifications.filter((n) => n.group === "Today").length,
    [notifications],
  );
  const totalCount = notifications.length;
  const pendingCount = useMemo(
    () =>
      notifications.filter((n) => n.type === "request" && n.isPending).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    const term = search.trim().toLowerCase();
    return notifications.filter((n) => {
      if (activeTab === "unread" && !n.unread) return false;
      if (activeTab === "requests" && n.type !== "request") return false;
      if (activeTab === "documents" && n.type !== "document") return false;
      if (activeTab === "eligibility" && n.type !== "eligibility") return false;
      if (activeTab === "warnings" && n.type !== "warning") return false;
      if (activeTab === "system" && n.type !== "system") return false;
      if (!term) return true;
      return (
        n.title.toLowerCase().includes(term) ||
        n.body.toLowerCase().includes(term) ||
        n.employeeName.toLowerCase().includes(term) ||
        n.benefit.toLowerCase().includes(term)
      );
    });
  }, [notifications, activeTab, search]);

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const groups = ["Today", "Yesterday", "Earlier"] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5 font-semibold text-white">Admin Notifications</h1>
        <p className="mt-3 text-5 text-[#A7B6D3]">
          Monitor employee benefit activity and system events
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-5">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-[#A7B6D3]">Pending Requests</p>
            <span className="mt-1 h-4 w-4 rounded-full bg-[#3E82F7]" />
          </div>
          <p className="text-5 font-semibold text-white">{pendingCount}</p>
        </article>

        <article className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-5">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-[#A7B6D3]">Unread</p>
            <span className="mt-1 h-4 w-4 rounded-full bg-[#EF4444]" />
          </div>
          <p className="text-5 font-semibold text-white">{unreadCount}</p>
        </article>

        <article className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-5">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-[#A7B6D3]">Today</p>
            <span className="mt-1 h-4 w-4 rounded-full bg-[#FFB21C]" />
          </div>
          <p className="text-5 font-semibold text-white">{todayCount}</p>
        </article>

        <article className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-5">
          <div className="mb-4 flex items-start justify-between">
            <p className="text-5 text-[#A7B6D3]">Total</p>
            <span className="mt-1 h-4 w-4 rounded-full bg-[#19D463]" />
          </div>
          <p className="text-5 font-semibold text-white">{totalCount}</p>
        </article>
      </section>

      <section className="flex flex-wrap items-center gap-2 text-5 text-[#A7B6D3]">
        {[
          { key: "all", label: "All" },
          { key: "requests", label: "Requests" },
          { key: "documents", label: "Documents" },
          { key: "eligibility", label: "Eligibility" },
          { key: "warnings", label: "Warnings" },
          { key: "system", label: "System" },
          { key: "unread", label: "Unread" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`rounded-full border border-[#2C4264] px-4 py-2 transition ${
              activeTab === tab.key
                ? "bg-[#1E293B] text-white"
                : "bg-[#0F172A] hover:bg-[#1E293B] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <HiOutlineMagnifyingGlass className="text-[#8FA3C5]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[180px] flex-1 bg-transparent text-5 text-white placeholder:text-[#8595B6] outline-none"
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

      <section className="space-y-6">
        {groups.map((group) => {
          const items = filteredNotifications.filter((n) => n.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="space-y-3">
              <p className="text-5 font-semibold text-[#8FA3C5]">{group}</p>
              <div className="space-y-4">
                {items.map((item) => {
                  const typeStyles =
                    item.type === "request"
                      ? "text-[#60A5FA] bg-[#1E2E49]"
                      : item.type === "document"
                        ? "text-[#C084FC] bg-[#2C1E41]"
                        : item.type === "eligibility"
                          ? "text-[#34D399] bg-[#1C3B33]"
                          : item.type === "warning"
                            ? "text-[#FBBF24] bg-[#3A2A13]"
                            : "text-[#94A3B8] bg-[#1A2536]";

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
                      key={item.id}
                      className={`rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
                        item.unread
                          ? "border-[#35507C] bg-[#1D2A42] shadow-[0_20px_40px_-28px_rgba(12,18,29,0.8)]"
                          : "border-[#2C4264] bg-[#1E293B]"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`grid h-10 w-10 place-items-center rounded-2xl ${typeStyles}`}
                          >
                            <CardIcon className="text-lg" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full border border-[#2C4264] bg-[#122033] px-3 py-1 text-[11px] text-[#A7B6D3]">
                                <HiOutlineUserCircle className="text-sm" />
                                {item.employeeName}
                              </span>
                              <span className="rounded-full border border-[#2C4264] bg-[#122033] px-3 py-1 text-[11px] text-[#A7B6D3]">
                                {item.benefit}
                              </span>
                              {item.unread ? (
                                <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
                              ) : null}
                            </div>
                            <div>
                              <p
                                className={`text-5 ${
                                  item.unread
                                    ? "font-semibold text-white"
                                    : "font-medium text-[#E2E8F0]"
                                }`}
                              >
                                {item.title}
                              </p>
                              <p className="mt-1 text-5 text-[#A7B6D3]">
                                {item.body}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <p className="text-[12px] text-[#7B8DAF]">
                            {item.time}
                          </p>
                          <div className="flex flex-wrap justify-end gap-2">
                            {item.actions.map((action) => (
                              <button
                                key={action}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#4B5D83] bg-[#334160] px-4 py-2 text-[12px] font-medium text-[#D4DEEF] transition hover:bg-[#3A4A6C]"
                              >
                                {action}
                                <HiOutlineArrowUpRight className="text-sm" />
                              </button>
                            ))}
                            {item.unread ? (
                              <button
                                onClick={() => markAsRead(item.id)}
                                className="rounded-xl border border-transparent px-3 py-2 text-[12px] text-[#A7B6D3] transition hover:text-white"
                              >
                                Mark as Read
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
