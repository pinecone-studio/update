/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlineArrowUpRight,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { NotificationSkeleton } from "../components/NotificationSkeleton";

export default function NotificationPage() {
  const [loading, setLoading] = useState(true);
  const notifications = [
    {
      id: "n1",
      title: "You’re Now Eligible for Education Allowance!",
      body: "Congratulations! You’ve reached 1 year tenure with an OKR score of 82%. You can now request Education Allowance.",
      time: "2 hours ago",
      tone: "success",
      unread: true,
      type: "eligibility",
      group: "Today",
      benefit: "Education Allowance",
      actionLabel: "Request Benefit",
    },
    {
      id: "n2",
      title: "OKR Score Updated",
      body: "Your Q1 2026 OKR score has been updated to 82%. This may affect your benefit eligibility.",
      time: "5 hours ago",
      tone: "info",
      unread: true,
      type: "eligibility",
      group: "Today",
      benefit: "Performance",
      actionLabel: "View Details",
    },
    {
      id: "n3",
      title: "Transit Pass Request Approved",
      body: "Your Transit Pass benefit request has been approved. You’ll receive further details via email.",
      time: "1 day ago",
      tone: "info",
      unread: false,
      type: "request_approved",
      group: "Yesterday",
      benefit: "Transit Pass",
      actionLabel: "View Details",
    },
    {
      id: "n4",
      title: "Health Insurance Renewal Due Soon",
      body: "Your Health Insurance benefit expires in 30 days. Please review and renew if needed.",
      time: "2 days ago",
      tone: "warning",
      unread: false,
      type: "warning",
      group: "Yesterday",
      benefit: "Health Insurance",
      actionLabel: "View Details",
    },
    {
      id: "n5",
      title: "Upcoming Eligibility: Gym Membership",
      body: "You’ll become eligible for Gym Membership in approximately 15 days when your OKR score reaches 75%.",
      time: "3 days ago",
      tone: "success",
      unread: false,
      type: "eligibility",
      group: "Earlier",
      benefit: "Gym Benefit",
      actionLabel: "View Details",
    },
    {
      id: "n6",
      title: "Gym Benefit Request Approved",
      body: "Your PineFit gym benefit request has been approved.",
      time: "4 days ago",
      tone: "info",
      unread: false,
      type: "request_approved",
      group: "Earlier",
      benefit: "Gym Benefit",
      actionLabel: "View Details",
    },
    {
      id: "n7",
      title: "Benefit Request Rejected",
      body: "Your Meal Allowance request was rejected. Reason: Attendance threshold exceeded.",
      time: "1 week ago",
      tone: "danger",
      unread: false,
      type: "request_rejected",
      group: "Earlier",
      benefit: "Meal Allowance",
      actionLabel: "View Details",
    },
    {
      id: "n8",
      title: "Attendance Warning",
      body: "You have 2 late arrivals this month. Reaching 3 may lock some benefits.",
      time: "1 week ago",
      tone: "warning",
      unread: false,
      type: "warning",
      group: "Earlier",
      benefit: "Attendance",
      actionLabel: "View Details",
    },
  ];
  const [activeType, setActiveType] = useState<
    "all" | "eligibility" | "request" | "warning"
  >("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filteredByType =
    activeType === "all"
      ? notifications
      : notifications.filter((n) => {
          if (activeType === "eligibility") return n.type === "eligibility";
          if (activeType === "request")
            return n.type === "request_approved" || n.type === "request_rejected";
          return n.type === "warning";
        });
  const filteredByUnread = unreadOnly
    ? filteredByType.filter((n) => n.unread)
    : filteredByType;
  const filteredNotifications = filteredByUnread.filter((n) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      n.title.toLowerCase().includes(term) ||
      n.body.toLowerCase().includes(term) ||
      n.benefit.toLowerCase().includes(term)
    );
  });

  const unreadCount = notifications.filter((n) => n.unread).length;
  const todayCount = notifications.filter((n) => n.group === "Today").length;
  const totalCount = notifications.length;
  const groups = ["Today", "Yesterday", "Earlier"] as const;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

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
                  {totalCount}
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
            <button
              onClick={() => setUnreadOnly((prev) => !prev)}
              className={`px-3 py-1.5 rounded-full border transition ${
                unreadOnly
                  ? "bg-slate-800 text-white border-slate-800 dark:bg-[#1A2333] dark:border-[#243041]"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-[#111A2A] dark:border-[#243041] dark:text-slate-200 dark:hover:bg-[#1A2333]"
              }`}
            >
              Unread only
            </button>
          </div>

          <div className="mt-4 bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 dark:bg-[#1A2333] dark:border-[#243041]">
            <HiOutlineMagnifyingGlass className="text-slate-500 dark:text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
              placeholder="Search notifications..."
            />
            <button className="px-3 py-1.5 text-xs rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-[#111A2A] dark:border-[#243041] dark:text-slate-200 dark:hover:bg-[#1A2333]">
              Mark All as Read
            </button>
          </div>

          <div className="mt-5 space-y-6">
            {groups.map((group) => {
              const items = filteredNotifications.filter((n) => n.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {group}
                  </p>
                  {items.map((item) => {
                    const toneClasses =
                      item.type === "eligibility"
                        ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
                        : item.type === "request_approved"
                          ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10"
                          : item.type === "request_rejected"
                            ? "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10"
                            : "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10";

                    const unreadClasses = item.unread
                      ? "bg-white/90 border-slate-200 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] dark:bg-[#1F2A3D] dark:border-[#2A3A52]"
                      : "bg-white border-slate-100 shadow-sm dark:bg-[#161F2F] dark:border-[#223044]";

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${unreadClasses}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`h-9 w-9 rounded-full grid place-items-center ${toneClasses}`}
                            >
                              {item.type === "eligibility" ? (
                                <HiOutlineInformationCircle className="text-lg" />
                              ) : item.type === "request_approved" ? (
                                <HiOutlineCheckCircle className="text-lg" />
                              ) : item.type === "request_rejected" ? (
                                <HiOutlineXCircle className="text-lg" />
                              ) : (
                                <HiOutlineExclamationTriangle className="text-lg" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-[#2A3A52] dark:bg-[#121A28] dark:text-slate-300">
                                  {item.benefit}
                                </span>
                                {item.unread && (
                                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                                )}
                              </div>
                              <p
                                className={`text-sm ${
                                  item.unread
                                    ? "font-semibold text-slate-900 dark:text-white"
                                    : "font-medium text-slate-800 dark:text-slate-100"
                                }`}
                              >
                                {item.title}
                              </p>
                              <p className="text-slate-600 text-xs mt-1 dark:text-slate-300">
                                {item.body}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {item.time}
                            </p>
                            <button className="text-xs text-blue-600 hover:text-blue-500 inline-flex items-center gap-1 whitespace-nowrap dark:text-blue-400 dark:hover:text-blue-300">
                              {item.actionLabel}
                              <HiOutlineArrowUpRight className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
