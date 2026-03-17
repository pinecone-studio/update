/** @format */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";
import Link from "next/link";
import { NotificationSkeleton } from "../components/NotificationSkeleton";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<EmployeeNotification[]>([]);
  const [activeType, setActiveType] = useState<
    "all" | "eligibility" | "request" | "warning"
  >("all");

  const filteredNotifications = (
    activeType === "all"
      ? notifications
      : notifications.filter((n) =>
          activeType === "eligibility"
            ? n.type === "ELIGIBILITY_CHANGE"
            : activeType === "request"
              ? n.type === "REQUEST_STATUS"
              : n.type === "WARNING",
        )
  ).filter((n) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q)
    );
  });

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

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  if (loading) {
    return (
      <div>
        <div className="bg-slate-50 px-4 py-4 flex flex-col items-center gap-6 text-slate-900 w-full min-h-screen dark:bg-[#0f172A] dark:text-white">
          <div className="flex flex-col gap-6 w-full max-w-[1500px] -mt-4">
            <NotificationSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-slate-50 px-4 py-4 flex flex-col items-center gap-6 text-slate-900 w-full min-h-screen dark:bg-[#0f172A] dark:text-white">
        <div className="flex flex-col gap-6 w-full max-w-[1500px] -mt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-[56px] h-[56px] bg-white rounded-2xl flex items-center justify-center dark:bg-[#1A2333]">
                <HiOutlineBell className="text-3xl text-blue-700 dark:text-blue-500" />
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
            {unreadCount > 0 && (
              <button
                onClick={async () => {
                  try {
                    await markAllNotificationsRead();
                    await loadNotifications();
                  } catch {
                    // ignore
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between dark:bg-[#1A2333] dark:border-[#243041]">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Unread
                </p>
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
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Today
                </p>
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
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total
                </p>
                <p className="text-slate-900 text-xl font-semibold dark:text-white">
                  {notifications.length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-green-600 dark:bg-[#122033] dark:text-green-400">
                <HiOutlineCheckCircle className="text-lg" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-6 text-xs text-slate-600 dark:text-slate-300">
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
          {error ? (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          ) : null}

          <div className="mt-5 space-y-3">
            {filteredNotifications.map((item) => {
              const toneClasses =
                item.tone === "SUCCESS"
                  ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
                  : item.tone === "WARNING"
                    ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10"
                    : item.tone === "INFO"
                      ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10"
                      : "text-slate-500 bg-slate-100 dark:text-slate-300 dark:bg-slate-500/10";

              const unreadClasses = !item.isRead
                ? "bg-white/90 border-slate-200 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] dark:bg-[#1F2A3D] dark:border-[#2A3A52]"
                : "bg-white border-slate-100 shadow-sm dark:bg-[#161F2F] dark:border-[#223044]";

              let actionHref: string | null = null;
              try {
                const parsed = item.metadata ? JSON.parse(item.metadata) : null;
                if (parsed?.action === "UPLOAD_SIGNED_CONTRACT") {
                  actionHref = "/employee";
                }
              } catch {
                // ignore malformed metadata
              }

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${unreadClasses}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-xl grid place-items-center ${toneClasses}`}
                      >
                        <HiOutlineInformationCircle className="text-lg" />
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-[#2A3A52] dark:bg-[#121A28] dark:text-slate-300">
                          {item.type === "ELIGIBILITY_CHANGE"
                            ? "Eligibility"
                            : item.type === "REQUEST_STATUS"
                              ? "Request"
                              : "Warning"}
                        </span>
                        <p className="text-slate-900 text-sm font-semibold dark:text-white">
                          {item.title}
                        </p>
                        <p className="text-slate-600 text-xs mt-1 dark:text-slate-300">
                          {item.body}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {formatRelativeTime(item.createdAt)}
                      </p>
                      {actionHref ? (
                        <Link
                          href={actionHref}
                          onClick={async () => {
                            if (!item.isRead) {
                              try {
                                await markNotificationRead(item.id);
                                setNotifications((prev) =>
                                  prev.map((n) =>
                                    n.id === item.id ? { ...n, isRead: true } : n,
                                  ),
                                );
                              } catch {
                                // ignore
                              }
                            }
                          }}
                          className="text-xs text-blue-600 hover:text-blue-500 inline-flex items-center gap-1 whitespace-nowrap dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Open
                          <HiOutlineArrowUpRight className="text-sm" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            if (!item.isRead) {
                              try {
                                await markNotificationRead(item.id);
                                setNotifications((prev) =>
                                  prev.map((n) =>
                                    n.id === item.id ? { ...n, isRead: true } : n,
                                  ),
                                );
                              } catch {
                                // ignore
                              }
                            }
                          }}
                          className="text-xs text-blue-600 hover:text-blue-500 inline-flex items-center gap-1 whitespace-nowrap dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View Details
                          <HiOutlineArrowUpRight className="text-sm" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {!loading && filteredNotifications.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No notifications found.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
