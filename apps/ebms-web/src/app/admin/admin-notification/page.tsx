"use client";

import { useEffect, useMemo, useState } from "react";
import { NotificationHeader } from "./_components/NotificationHeader";
import { NotificationStatsCards } from "./_components/NotificationStatsCards";
import {
  NotificationFilters,
  type AdminTabKey,
} from "./_components/NotificationFilters";
import { NotificationSearchBar } from "./_components/NotificationSearchBar";
import {
  NotificationList,
  type AdminNotificationItem,
} from "./_components/NotificationList";
import {
  fetchAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} from "../_lib/api";
import { formatRelativeTime } from "../_lib/utils";

type NotificationType =
  | "request"
  | "document"
  | "eligibility"
  | "warning"
  | "system"
  | string;

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

function getGroupFromCreatedAt(iso: string): "Today" | "Yesterday" | "Earlier" {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const notifDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor(
    (today.getTime() - notifDate.getTime()) / 86400000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Earlier";
}

function getActionsForType(type: string): string[] {
  if (type === "request") return ["Review Request"];
  if (type === "document") return ["Review Document"];
  if (type === "eligibility") return ["View Employee"];
  if (type === "warning") return ["View Details"];
  return ["View Details"];
}

const DEFAULT_NOTIFICATIONS: AdminNotificationItem[] = [
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTabKey>("all");
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>(
    DEFAULT_NOTIFICATIONS,
  );

  const pendingRequests = useMemo(
    () =>
      notifications.filter((n) => n.type === "request" && n.isPending).length,
    [notifications],
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

  const filteredByTab = useMemo(
    () =>
      notifications.filter((n) => {
        if (activeTab === "requests") return n.type === "request";
        if (activeTab === "documents") return n.type === "document";
        if (activeTab === "eligibility") return n.type === "eligibility";
        if (activeTab === "warnings") return n.type === "warning";
        if (activeTab === "system") return n.type === "system";
        return true;
      }),
    [notifications, activeTab],
  );

  const filteredByUnread = unreadOnly
    ? filteredByTab.filter((n) => n.unread)
    : filteredByTab;

  const filteredNotifications = useMemo(
    () =>
      filteredByUnread.filter((n) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return (
          n.title.toLowerCase().includes(term) ||
          n.body.toLowerCase().includes(term) ||
          n.employeeName.toLowerCase().includes(term) ||
          n.benefit.toLowerCase().includes(term)
        );
      }),
    [filteredByUnread, search],
  );

  const markAllAsRead = async () => {
    try {
      await markAllAdminNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markAdminNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
      );
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
      );
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AdminNotificationItem[];
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

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchAdminNotifications(100)
      .then((items) => {
        if (cancelled) return;
        const mapped: AdminNotificationItem[] = items.map((n) => {
          const meta = (n.metadata ?? {}) as Record<string, unknown>;
          const type = (n.type ?? "system") as AdminNotificationItem["type"];
          return {
            id: n.id,
            title: n.title,
            body: n.body,
            time: formatRelativeTime(n.createdAt),
            type,
            group: getGroupFromCreatedAt(n.createdAt),
            unread: n.unread,
            employeeName: (meta.employeeName as string) ?? "—",
            benefit: (meta.benefitName as string) ?? (meta.benefitId as string) ?? "—",
            actions: getActionsForType(n.type ?? ""),
            isPending: n.type === "request",
          };
        });
        setNotifications(mapped.length > 0 ? mapped : DEFAULT_NOTIFICATIONS);
      })
      .catch(() => {
        if (!cancelled) setNotifications(DEFAULT_NOTIFICATIONS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 text-slate-900 dark:text-white" />
    );
  }

  const groups = ["Today", "Yesterday", "Earlier"] as const;

  return (
    <div className="min-h-screen px-3 py-4 text-slate-900 sm:px-4 sm:py-6 dark:text-white">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 sm:gap-6">
        <NotificationHeader />
        <NotificationStatsCards
          pendingRequests={pendingRequests}
          unreadCount={unreadCount}
          todayCount={todayCount}
          totalCount={totalCount}
        />
        <NotificationFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadOnly={unreadOnly}
          onUnreadToggle={() => setUnreadOnly((prev) => !prev)}
        />
        <NotificationSearchBar
          search={search}
          onSearchChange={setSearch}
          onMarkAllAsRead={markAllAsRead}
        />
        <NotificationList
          notifications={filteredNotifications}
          onMarkAsRead={markAsRead}
        />
      </div>
    </div>
  );
}
