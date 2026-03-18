"use client";

import { useEffect, useState, useCallback } from "react";
import { NotificationHeader } from "./_components/NotificationHeader";
import { NotificationStatsCards } from "./_components/NotificationStatsCards";
import {
  NotificationFilters,
  type EmployeeTabKey,
} from "./_components/NotificationFilters";
import { NotificationSearchBar } from "./_components/NotificationSearchBar";
import { NotificationList } from "./_components/NotificationList";
import { useOnUserSwitch } from "@/app/_lib/useOnUserSwitch";
import {
  fetchMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  formatRelativeTime,
  getApiErrorMessage,
  type EmployeeNotification,
} from "../_lib/api";

export default function NotificationPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<EmployeeTabKey>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<EmployeeNotification[]>([]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const todayCount = notifications.filter((n) => {
    const d = new Date(n.createdAt);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }).length;
  const totalCount = notifications.length;

  const filteredByTab = notifications.filter((n) => {
    if (activeTab === "eligibility") return n.type === "ELIGIBILITY_CHANGE";
    if (activeTab === "request") return n.type === "REQUEST_STATUS";
    if (activeTab === "warning") return n.type === "WARNING";
    return true;
  });

  const filteredByUnread = unreadOnly
    ? filteredByTab.filter((n) => !n.isRead)
    : filteredByTab;

  const filteredNotifications = filteredByUnread.filter((n) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      n.title.toLowerCase().includes(term) || n.body.toLowerCase().includes(term)
    );
  });

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchMyNotifications(100);
      setNotifications(list);
    } catch (e) {
      setNotifications([]);
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        await markNotificationRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      } catch {
        // ignore
      }
    },
    [],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch {
      // ignore
    }
  }, [loadNotifications]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useOnUserSwitch(loadNotifications);

  if (loading) {
    return <div className="min-h-screen px-4 py-6 text-slate-900 dark:text-white" />;
  }

  return (
    <div className="min-h-screen px-4 py-6 text-slate-900 dark:text-white">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
        <NotificationHeader />
        <NotificationStatsCards
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
          onMarkAllAsRead={handleMarkAllAsRead}
        />
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        {filteredNotifications.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No notifications found.
          </p>
        ) : (
          <NotificationList
            notifications={filteredNotifications}
            formatTime={formatRelativeTime}
            onMarkAsRead={handleMarkAsRead}
          />
        )}
      </div>
    </div>
  );
}
