/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { gql } from "graphql-request";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { NotificationSkeleton } from "../components/NotificationSkeleton";
import {
  EmployeeNotificationItem,
  type EmployeeNotification,
} from "../components/EmployeeNotificationItem";
import { getEmployeeClient, getApiErrorMessage } from "../_lib/api";

const MY_NOTIFICATIONS_QUERY = gql`
  query MyNotifications {
    myNotifications(limit: 100) {
      id
      title
      body
      createdAt
      tone
      type
      isRead
      metadata
    }
  }
`;

function formatRelativeTime(iso: string): string {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return iso;
  const diffMs = Date.now() - ts;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} day ago`;
}

export default function NotificationPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<EmployeeNotification[]>([]);
  const [activeType, setActiveType] = useState<
    "all" | "eligibility" | "request" | "warning"
  >("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getEmployeeClient().request<{
          myNotifications: EmployeeNotification[];
        }>(MY_NOTIFICATIONS_QUERY);
        if (!cancelled) setNotifications(res.myNotifications ?? []);
      } catch (e) {
        if (!cancelled) {
          setNotifications([]);
          setError(getApiErrorMessage(e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const filteredNotifications = useMemo(() => {
    const typeFiltered =
      activeType === "all"
        ? notifications
        : notifications.filter((n) =>
            activeType === "eligibility"
              ? n.type === "ELIGIBILITY_CHANGE"
              : activeType === "request"
                ? n.type === "REQUEST_STATUS"
                : n.type === "WARNING",
          );

    const q = searchTerm.trim().toLowerCase();
    if (!q) return typeFiltered;
    return typeFiltered.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
    );
  }, [activeType, notifications, searchTerm]);

  if (loading) {
    return (
      <div className="bg-slate-50 px-4 py-4 flex flex-col items-center gap-6 text-slate-900 w-full min-h-screen dark:bg-[#0f172A] dark:text-white">
        <div className="flex flex-col gap-6 w-full max-w-[1500px] -mt-4">
          <NotificationSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 px-4 py-4 flex flex-col items-center gap-6 text-slate-900 w-full min-h-screen dark:bg-[#0f172A] dark:text-white">
      <div className="flex flex-col gap-6 w-full max-w-[1500px] -mt-4">
        <div className="flex items-center gap-4">
          <div className="w-[56px] h-[56px] bg-white rounded-2xl flex items-center justify-center">
            <HiOutlineBell className="text-3xl text-blue-700" />
          </div>
          <div className="flex flex-col">
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              Notifications
            </p>
            <p className="text-slate-600 text-sm dark:text-slate-300">
              Stay updated on your benefits and eligibility
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between dark:bg-[#1A2333] dark:border-[#243041]">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Unread</p>
              <p className="text-slate-900 text-xl font-semibold dark:text-white">
                {unreadCount}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-blue-600 dark:bg-[#122033] dark:text-blue-500">
              <HiOutlineBell className="text-lg" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between dark:bg-[#1A2333] dark:border-[#243041]">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Today</p>
              <p className="text-slate-900 text-xl font-semibold dark:text-white">
                {todayCount}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-orange-500 dark:bg-[#122033] dark:text-orange-400">
              <HiOutlineClock className="text-lg" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between dark:bg-[#1A2333] dark:border-[#243041]">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
              <p className="text-slate-900 text-xl font-semibold dark:text-white">
                {notifications.length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-green-600 dark:bg-[#122033] dark:text-green-400">
              <HiOutlineCheckCircle className="text-lg" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveType("all")}
            className={`px-3 py-1.5 rounded-full border transition ${
              activeType === "all"
                ? "bg-slate-800 text-white border-slate-800 dark:bg-[#1A2333] dark:border-[#243041]"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-[#111A2A] dark:border-[#243041] dark:text-slate-200 dark:hover:bg-[#1A2333]"
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setActiveType("eligibility")}
            className={`px-3 py-1.5 rounded-full border transition ${
              activeType === "eligibility"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-300"
            }`}
          >
            Eligibility
          </button>
          <button
            onClick={() => setActiveType("request")}
            className={`px-3 py-1.5 rounded-full border transition ${
              activeType === "request"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300"
            }`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveType("warning")}
            className={`px-3 py-1.5 rounded-full border transition ${
              activeType === "warning"
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300"
            }`}
          >
            Warnings
          </button>
        </div>

        <div className="mt-4 bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 dark:bg-[#1A2333] dark:border-[#243041]">
          <HiOutlineMagnifyingGlass className="text-slate-500 dark:text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
            placeholder="Search notifications..."
          />
        </div>

        {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}

        <div className="mt-5 space-y-3">
          {filteredNotifications.map((item) => (
            <EmployeeNotificationItem
              key={item.id}
              item={item}
              relativeTime={formatRelativeTime(item.createdAt)}
            />
          ))}

          {filteredNotifications.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Notifications олдсонгүй.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
