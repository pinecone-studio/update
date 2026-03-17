"use client";

import { useEffect, useMemo, useState } from "react";
import {
  HiOutlineBanknotes,
  HiOutlineMagnifyingGlass,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineArrowUpRight,
  HiOutlineReceiptPercent,
  HiOutlineXCircle,
  HiOutlineUserCircle,
} from "react-icons/hi2";

export default function FinanceNotificationPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "all" | "payments" | "reimbursements" | "completed"
  >("all");
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const notifications = [
    {
      id: "f1",
      title: "Payment Approval Required",
      body: "Bat-Erdene's Gym Membership benefit requires payment approval.",
      time: "5 minutes ago",
      type: "payment_pending" as const,
      group: "Today" as const,
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
      type: "reimbursement" as const,
      group: "Today" as const,
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
      type: "payment_completed" as const,
      group: "Today" as const,
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
      type: "reimbursement" as const,
      group: "Yesterday" as const,
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
      type: "payment_completed" as const,
      group: "Yesterday" as const,
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
      type: "payment_pending" as const,
      group: "Earlier" as const,
      unread: false,
      employee: "Ariunaa",
      benefit: "Transit Pass",
      amount: "$40",
      actions: ["Approve Payment", "Reject Payment"],
    },
  ];

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );
  const todayCount = useMemo(
    () => notifications.filter((n) => n.group === "Today").length,
    [notifications],
  );
  const totalCount = notifications.length;
  const pendingPayments = useMemo(
    () => notifications.filter((n) => n.type === "payment_pending").length,
    [notifications],
  );
  const reimbursementCount = useMemo(
    () => notifications.filter((n) => n.type === "reimbursement").length,
    [notifications],
  );

  const filteredByTab = notifications.filter((n) => {
    if (activeTab === "payments") return n.type === "payment_pending";
    if (activeTab === "reimbursements") return n.type === "reimbursement";
    if (activeTab === "completed") return n.type === "payment_completed";
    return true;
  });
  const filteredByUnread = unreadOnly
    ? filteredByTab.filter((n) => n.unread)
    : filteredByTab;
  const filteredNotifications = filteredByUnread.filter((n) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      n.title.toLowerCase().includes(term) ||
      n.body.toLowerCase().includes(term) ||
      n.employee.toLowerCase().includes(term) ||
      n.benefit.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-[#0f172A] dark:text-white" />
    );
  }

  const groups = ["Today", "Yesterday", "Earlier"] as const;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-[#0f172A] dark:text-white">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Finance Notifications
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Review benefit payments and reimbursement requests
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#243041] dark:bg-[#1A2333]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pending Payments
              </p>
              <span className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              {pendingPayments}
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#243041] dark:bg-[#1A2333]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reimbursement Requests
              </p>
              <span className="h-2 w-2 rounded-full bg-purple-500" />
            </div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              {reimbursementCount}
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#243041] dark:bg-[#1A2333]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Today's Notifications
              </p>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              {todayCount}
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#243041] dark:bg-[#1A2333]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Notifications
              </p>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              {totalCount}
            </p>
          </article>
        </section>

        <section className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          {[
            { key: "all", label: "All" },
            { key: "payments", label: "Payments" },
            { key: "reimbursements", label: "Reimbursements" },
            { key: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`rounded-full border px-3 py-1.5 transition ${
                activeTab === tab.key
                  ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-[#243041] dark:bg-[#111A2A] dark:text-slate-200 dark:hover:bg-[#1A2333]"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setUnreadOnly((prev) => !prev)}
            className={`rounded-full border px-3 py-1.5 transition ${
              unreadOnly
                ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-[#243041] dark:bg-[#111A2A] dark:text-slate-200 dark:hover:bg-[#1A2333]"
            }`}
          >
            Unread Only
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-[#243041] dark:bg-[#1A2333]">
          <div className="flex flex-wrap items-center gap-3">
            <HiOutlineMagnifyingGlass className="text-slate-500 dark:text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-[180px] flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
              placeholder="Search notifications..."
            />
            <button className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 dark:border-[#243041] dark:bg-[#111A2A] dark:text-slate-200 dark:hover:bg-[#1A2333]">
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {group}
                </p>
                <div className="space-y-3">
                  {items.map((item) => {
                    const toneClasses =
                      item.type === "payment_pending"
                        ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10"
                        : item.type === "reimbursement"
                          ? "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10"
                          : "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10";

                    const unreadClasses = item.unread
                      ? "bg-white/90 border-slate-200 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] dark:bg-[#1F2A3D] dark:border-[#2A3A52]"
                      : "bg-white border-slate-100 shadow-sm dark:bg-[#161F2F] dark:border-[#223044]";

                    const CardIcon =
                      item.type === "payment_pending"
                        ? HiOutlineBanknotes
                        : item.type === "reimbursement"
                          ? HiOutlineReceiptPercent
                          : HiOutlineCheckCircle;

                    return (
                      <article
                        key={item.id}
                        className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${unreadClasses}`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`h-9 w-9 rounded-full grid place-items-center ${toneClasses}`}
                            >
                              <CardIcon className="text-lg" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-[#2A3A52] dark:bg-[#121A28] dark:text-slate-300">
                                  <HiOutlineUserCircle className="text-sm" />
                                  {item.employee}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-[#2A3A52] dark:bg-[#121A28] dark:text-slate-300">
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
                              <p className="text-xs text-slate-600 dark:text-slate-300">
                                {item.body}
                              </p>
                              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                                {item.amount}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {item.time}
                            </p>
                            <div className="flex flex-wrap justify-end gap-2">
                              {item.actions.map((action) => (
                                <button
                                  key={action}
                                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 dark:border-[#243041] dark:bg-[#111A2A] dark:text-slate-200 dark:hover:bg-[#1A2333]"
                                >
                                  {action}
                                  <HiOutlineArrowUpRight className="text-sm" />
                                </button>
                              ))}
                              {item.actions.includes("Reject Payment") && (
                                <button className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                                  Reject Payment
                                  <HiOutlineXCircle className="text-sm" />
                                </button>
                              )}
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
    </div>
  );
}
