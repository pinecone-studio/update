"use client";

import { useEffect, useMemo, useState } from "react";
import { NotificationHeader } from "./_components/NotificationHeader";
import { NotificationStatsCards } from "./_components/NotificationStatsCards";
import { NotificationFilters } from "./_components/NotificationFilters";
import { NotificationSearchBar } from "./_components/NotificationSearchBar";
import {
  NotificationList,
  type NotificationItem,
} from "./_components/NotificationList";
import {
  fetchFinanceNotifications,
  markFinanceNotificationRead,
  markAllFinanceNotificationsRead,
} from "../_lib/api";
import { formatRelativeTime } from "../_lib/utils";

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

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "f1",
    title: "Payment Approval Required",
    body: "Bat-Erdene's Gym Membership benefit requires payment approval.",
    time: "5 minutes ago",
    type: "payment_pending",
    group: "Today",
    unread: true,
    employee: "Bat-Erdene",
    benefit: "Gym Membership",
    amount: "$100",
    actions: ["Approve Payment", "Reject Payment"],
  },
  {
    id: "f2",
    title: "New Reimbursement Request",
    body: "Nomin submitted an expense reimbursement for Education Allowance.",
    time: "30 minutes ago",
    type: "reimbursement",
    group: "Today",
    unread: true,
    employee: "Nomin",
    benefit: "Education Allowance",
    amount: "$500",
    actions: ["Review Request"],
  },
  {
    id: "f3",
    title: "Payment Processed",
    body: "Payment for Bat-Erdene's Gym Membership has been completed.",
    time: "2 hours ago",
    type: "payment_completed",
    group: "Today",
    unread: false,
    employee: "Bat-Erdene",
    benefit: "Gym Membership",
    amount: "$100",
    actions: ["View Details"],
  },
  {
    id: "f4",
    title: "New Reimbursement Request",
    body: "Temuulen submitted a reimbursement for Home Office Stipend.",
    time: "Yesterday",
    type: "reimbursement",
    group: "Yesterday",
    unread: false,
    employee: "Temuulen",
    benefit: "Home Office Stipend",
    amount: "$250",
    actions: ["Review Request"],
  },
  {
    id: "f5",
    title: "Payment Processed",
    body: "Payment for Nomin's Education Allowance has been completed.",
    time: "Yesterday",
    type: "payment_completed",
    group: "Yesterday",
    unread: false,
    employee: "Nomin",
    benefit: "Education Allowance",
    amount: "$500",
    actions: ["View Details"],
  },
  {
    id: "f6",
    title: "Payment Approval Required",
    body: "Ariunaa's Transit Pass benefit requires payment approval.",
    time: "3 days ago",
    type: "payment_pending",
    group: "Earlier",
    unread: false,
    employee: "Ariunaa",
    benefit: "Transit Pass",
    amount: "$40",
    actions: ["Approve Payment", "Reject Payment"],
  },
];

type TabKey = "all" | "payments" | "reimbursements" | "completed";

export default function FinanceNotificationPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    DEFAULT_NOTIFICATIONS,
  );

  useEffect(() => {
    let cancelled = false;
    fetchFinanceNotifications(100)
      .then((items) => {
        if (cancelled) return;
        const mapped: NotificationItem[] = items.map((n) => {
          const meta = (n.metadata ?? {}) as Record<string, unknown>;
          return {
            id: n.id,
            title: n.title,
            body: n.body,
            time: formatRelativeTime(n.createdAt),
            type: (n.type ?? "payment_pending") as NotificationItem["type"],
            group: getGroupFromCreatedAt(n.createdAt),
            unread: n.unread,
            employee: (meta.employeeName as string) ?? "—",
            benefit: (meta.benefitName as string) ?? "—",
            amount: "—",
            actions:
              n.type === "payment_pending"
                ? ["Approve Payment", "Reject Payment"]
                : ["View Details"],
          };
        });
        setNotifications(mapped.length > 0 ? mapped : DEFAULT_NOTIFICATIONS);
      })
      .catch(() => setNotifications(DEFAULT_NOTIFICATIONS))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const pendingPayments = useMemo(
    () => notifications.filter((n) => n.type === "payment_pending").length,
    [notifications]
  );
  const reimbursementCount = useMemo(
    () => notifications.filter((n) => n.type === "reimbursement").length,
    [notifications]
  );
  const todayCount = useMemo(
    () => notifications.filter((n) => n.group === "Today").length,
    [notifications]
  );
  const totalCount = notifications.length;

  const filteredByTab = useMemo(
    () =>
      notifications.filter((n) => {
        if (activeTab === "payments") return n.type === "payment_pending";
        if (activeTab === "reimbursements") return n.type === "reimbursement";
        if (activeTab === "completed") return n.type === "payment_completed";
        return true;
      }),
    [notifications, activeTab]
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
          n.employee.toLowerCase().includes(term) ||
          n.benefit.toLowerCase().includes(term)
        );
      }),
    [filteredByUnread, search]
  );

  const markAllAsRead = async () => {
    try {
      await markAllFinanceNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markFinanceNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
      );
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  px-4 py-6 text-slate-900 " />
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 text-slate-900 dark:text-white">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
        <NotificationHeader />
        <NotificationStatsCards
          pendingPayments={pendingPayments}
          reimbursementCount={reimbursementCount}
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
