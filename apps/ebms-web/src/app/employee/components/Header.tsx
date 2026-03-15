"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { fetchMe } from "../_lib/api";
import { ThemeToggle } from "@/app/_components/ThemeToggle";

import {
  HiOutlineBell,
  HiBars3,
  HiXMark,
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCheckCircle,
  HiOutlineChartBar,
  HiOutlineInformationCircle,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

const STORAGE_KEY = "ebms_employee_notifications";

const DEFAULT_NOTIFICATIONS = [
  {
    id: "1",
    title: "You're Now Eligible for Education Allowance!",
    body: "Congratulations! You've reached 1 year tenure with an OKR score of 82%. You can now request Education Allowance.",
    time: "2 hours ago",
    tone: "success" as const,
    unread: true,
  },
  {
    id: "2",
    title: "OKR Score Updated",
    body: "Your Q1 2026 OKR score has been updated to 82%. This may affect your benefit eligibility.",
    time: "5 hours ago",
    tone: "info" as const,
    unread: true,
  },
  {
    id: "3",
    title: "Transit Pass Request Approved",
    body: "Your Transit Pass benefit request has been approved. You'll receive further details via email.",
    time: "1 day ago",
    tone: "success" as const,
    unread: false,
  },
];

type EmployeeNotification = (typeof DEFAULT_NOTIFICATIONS)[number];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [me, setMe] = useState<{ name: string; id: string } | null>(null);
  const [notifications, setNotifications] = useState<EmployeeNotification[]>(
    DEFAULT_NOTIFICATIONS,
  );
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((data) => {
        if (!cancelled) setMe({ name: data.name, id: data.id });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as EmployeeNotification[];
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

  const unreadCount = pathname?.startsWith("/employee/notification")
    ? 0
    : notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-50 h-[64px] w-full border-b border-white/10 bg-[#0F1419]/95 px-4">
      <div className="mx-auto h-full w-full max-w-[1500px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 md:gap-6 ">
          <Link
            href="/employee"
            className="flex items-center gap-2 text-slate-900 dark:text-white hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="EBMS Logo" className="h-10 w-auto" />
              <div className="leading-[24px] ">
                <p className="flex justify-start items-start text-[20px] font-semibold tracking-[0px] text-white dark:text-white">
                  UPDATE
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-[#334155] dark:text-[#A7B6D3] dark:hover:bg-[#24364F] dark:hover:text-white"
          >
            <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
            Admin
          </Link>
          <ThemeToggle />
          <button
            className="md:hidden h-8 w-8 rounded-full bg-slate-100 text-slate-600 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <HiBars3 className="text-sm" />
          </button>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setProfileOpen(false);
                }}
                className="relative h-8 w-8 rounded-full bg-slate-100 text-slate-600 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Notifications"
              >
                <HiOutlineBell className="text-sm" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[420px] flex flex-col bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 dark:bg-[#1A2333] dark:border-[#243041]">
                  <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#243041]">
                    <div className="flex items-center gap-2">
                      <HiOutlineBell className="text-base text-slate-600 dark:text-slate-300" />
                      <span className="text-slate-900 font-semibold dark:text-white">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/80 text-white text-xs font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setNotificationOpen(false)}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                    >
                      <HiXMark className="text-lg" />
                    </button>
                  </div>
                  <Link
                    href="/employee/notification"
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) => ({ ...n, unread: false })),
                      );
                      setNotificationOpen(false);
                    }}
                  >
                    Mark all as read
                  </Link>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {notifications.map((n) => {
                      const iconClass =
                        n.tone === "success"
                          ? "text-green-400 bg-green-500/20"
                          : n.tone === "info"
                            ? "text-blue-400 bg-blue-500/20"
                            : "text-slate-400 bg-slate-500/20";
                      return (
                        <div
                          key={n.id}
                          className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition dark:bg-[#1f2a40] dark:border-[#243041] dark:hover:border-slate-600"
                        >
                          <div
                            className={`flex-shrink-0 h-8 w-8 rounded-lg grid place-items-center ${iconClass}`}
                          >
                            {n.tone === "success" ? (
                              <HiOutlineCheckCircle className="text-lg" />
                            ) : n.tone === "info" ? (
                              <HiOutlineChartBar className="text-lg" />
                            ) : (
                              <HiOutlineInformationCircle className="text-lg" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 text-sm font-semibold dark:text-white">
                              {n.title}
                            </p>
                            <p className="text-slate-600 text-xs mt-0.5 line-clamp-2 dark:text-slate-400">
                              {n.body}
                            </p>
                            <Link
                              href="/employee/notification"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2 dark:text-blue-400 dark:hover:text-blue-300"
                              onClick={() => setNotificationOpen(false)}
                            >
                              View Details
                              <HiOutlineArrowTopRightOnSquare className="text-xs" />
                            </Link>
                            <p className="text-slate-400 text-[10px] mt-1 dark:text-slate-500">
                              {n.time}
                            </p>
                          </div>
                          {n.unread && (
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 border-t border-slate-200 dark:border-[#243041]">
                    <Link
                      href="/employee/notification"
                      onClick={() => setNotificationOpen(false)}
                      className="block w-full py-2.5 text-center text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationOpen(false);
                }}
                className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center ml-1 ring-1 ring-transparent hover:ring-blue-300 hover:bg-blue-500 transition dark:ring-blue-500"
                aria-label="Profile"
              >
                {me?.name
                  ?.split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() ?? "JD"}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 dark:bg-[#1A2333] dark:border-[#243041]">
                  <div className="p-4 border-b border-slate-200 dark:border-[#243041]">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-blue-600 text-white text-xs font-semibold grid place-items-center">
                        {me?.name
                          ?.split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() ?? "JD"}
                      </div>
                      <div>
                        <p className="text-slate-900 font-semibold dark:text-white">
                          {me?.name ?? "—"}
                        </p>
                        <p className="text-slate-500 text-xs mt-1 dark:text-slate-500">
                          {me?.id ?? "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/employee/myprofile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <HiOutlineUserCircle className="text-lg" />
                      Profile
                    </Link>
                    <div className="my-2 h-px bg-slate-200 dark:bg-[#243041]" />
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                    >
                      <HiOutlineArrowRightOnRectangle className="text-lg" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden absolute left-0 top-[64px] w-full bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800 ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col gap-1 p-3 text-slate-600 dark:text-slate-300 text-sm">
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 ring-1 ring-transparent hover:ring-blue-300 hover:text-slate-900 hover:bg-slate-100 transition dark:text-slate-300 dark:hover:ring-blue-300 dark:hover:text-white dark:hover:bg-slate-800"
          >
            <HiOutlineArrowTopRightOnSquare className="text-base" />
            Admin руу шилжих
          </Link>
          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
          <div className="flex items-center gap-2">
            <Link
              href="/employee/notification"
              onClick={() => setMenuOpen(false)}
              className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <HiOutlineBell className="text-sm" />
            </Link>
            <Link
              href="/employee/notification"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center">
                {me?.name
                  ?.split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() ?? "JD"}
              </div>
              <span className="text-slate-600 text-xs dark:text-slate-300">
                Account
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
