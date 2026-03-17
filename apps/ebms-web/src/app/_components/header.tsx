"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HiBars3,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineArrowTopRightOnSquare,
  HiXMark,
} from "react-icons/hi2";
import { HrAuditIcon } from "@/app/icons/hrAudit";
import { HrBenefitsRuleIcon } from "@/app/icons/hrBenefitsRule";
import { HrDashboardIcon } from "@/app/icons/hrDashboard";
import { HrVendorIcon } from "@/app/icons/hrVendor";
import { ThemeToggle } from "@/app/_components/ThemeToggle";
import type { ReactNode } from "react";
import {
  fetchSwitchUserOptions,
  getInitialUserProfile,
  getActiveUserProfile,
  setActiveUserProfile,
  type ActiveUserProfile,
  type SwitchUserOption,
} from "@/app/_lib/activeUser";
import { ProfileIcon } from "../icons/profile";
import { HrEmployeeIcon } from "../icons/hrEmployee";
import { GeistSans } from "geist/font/sans";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <HrDashboardIcon /> },
  { label: "Employees", href: "/admin/employee-eligibility", icon: <HrEmployeeIcon /> },
  {
    label: "Contracts",
    href: "/admin/vendor-contracts",
    icon: <HrVendorIcon />,
  },
  {
    label: "Benefits & Rules",
    href: "/admin/add-benefit",
    icon: <HrBenefitsRuleIcon />,
  },
  { label: "Audit Log", href: "/admin/audit-log", icon: <HrAuditIcon /> },
];

const STORAGE_KEY = "ebms_admin_notifications";

const DEFAULT_NOTIFICATIONS = [
  {
    id: "1",
    title: "New Vendor Contract Uploaded",
    body: "Vendor contract for Q2 2026 has been uploaded and is ready for review.",
    time: "1 hour ago",
    tone: "info" as const,
    unread: true,
  },
  {
    id: "2",
    title: "Eligibility Review Required",
    body: "5 employees reached 1 year tenure and require benefit eligibility review.",
    time: "3 hours ago",
    tone: "success" as const,
    unread: true,
  },
  {
    id: "3",
    title: "Audit Log Export Ready",
    body: "Your audit log export is ready to download.",
    time: "1 day ago",
    tone: "neutral" as const,
    unread: false,
  },
];

type AdminNotification = (typeof DEFAULT_NOTIFICATIONS)[number];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileNotificationRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>(
    DEFAULT_NOTIFICATIONS,
  );
  const [selectedUser, setSelectedUser] = useState<ActiveUserProfile>(
    getInitialUserProfile(),
  );
  const initialProfile = getInitialUserProfile();
  const [userOptions, setUserOptions] = useState<SwitchUserOption[]>([
    {
      id: initialProfile.id,
      name: initialProfile.name || initialProfile.id,
      role: (initialProfile.role || "employee").toLowerCase(),
    },
  ]);

  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  const isActive = (href: string) =>
    normalizedPath === href ||
    (href !== "/admin" && normalizedPath.startsWith(href));
  const unreadCount = normalizedPath.startsWith("/admin/admin-notification")
    ? 0
    : notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inNotification =
        notificationRef.current?.contains(target) ||
        mobileNotificationRef.current?.contains(target);
      if (!inNotification) setNotificationOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) {
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

  useEffect(() => {
    const current = getActiveUserProfile();
    setSelectedUser(current);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mapped = await fetchSwitchUserOptions();
        if (!cancelled && mapped.length > 0) {
          setUserOptions(mapped);
          if (!mapped.some((u) => u.id === selectedUser.id)) {
            const first = mapped[0];
            const next = { id: first.id, name: first.name, role: first.role };
            setSelectedUser(next);
            setActiveUserProfile(next);
          }
        }
      } catch {
        // Keep fallback list when employees query fails.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedUser.id]);

  const handleUserChange = (value: string) => {
    const nextUser = userOptions.find((u) => u.id === value);
    if (!nextUser) return;
    const profile = { id: nextUser.id, name: nextUser.name, role: nextUser.role };
    setSelectedUser(profile);
    setActiveUserProfile(profile);
  };

  return (
    <header className={`sticky top-0 z-50 h-[72px] w-full border-b border-white/10 bg-[#0A121B]/95 px-4 backdrop-blur-md ${GeistSans.className}`}>
      <div className="mx-auto flex h-[72px] w-full max-w-[1500px] items-center justify-between gap-4">
        <Link
          href="/admin"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
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

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isActive(item.href)
                  ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-[#2F66E8] dark:hover:bg-[#3E82F7]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:bg-[#24364F] dark:hover:text-white"
              }`}
            >
              <span className="scale-90">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:bg-[#24364F] dark:hover:text-white"
            aria-label="Toggle navigation"
          >
            <HiBars3 className="h-5 w-5" />
          </button>
          <label className="hidden md:flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-600 dark:border-[#334155] dark:text-[#A7B6D3]">
            <span>User</span>
            <select
              value={selectedUser.id}
              onChange={(e) => handleUserChange(e.target.value)}
              className="bg-transparent text-xs text-slate-700 outline-none dark:text-[#D1DBEF]"
              aria-label="Select active test user"
            >
              {userOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="text-slate-900">
                  {opt.name} ({opt.id})
                </option>
              ))}
            </select>
          </label>
          <div className="h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:text-white dark:hover:bg-[#0a121b]">
          <ThemeToggle />
          </div>
          <div className="relative hidden md:block" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="relative inline-flex h-10 w-10 items-center justify-center border border-slate-200 rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:bg-[#24364F] dark:hover:text-white"
              aria-label="Notifications"
            >
              <HiOutlineBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
            {notificationOpen && (
              <div className="absolute right-0 top-full mt-2 flex max-h-[420px] w-[380px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50 dark:border-[#24395C] dark:bg-[#1A2333]">
                <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-[#24395C]">
                  <div className="flex items-center gap-2">
                    <HiOutlineBell className="text-base text-slate-600 dark:text-[#D1DBEF]" />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-red-500/80 px-2 py-0.5 text-xs font-medium text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setNotificationOpen(false)}
                    className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#9FB0D4] dark:hover:bg-[#24364F] dark:hover:text-white"
                  >
                    <HiXMark className="text-lg" />
                  </button>
                </div>
                <Link
                  href="/admin/admin-notification"
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
                        className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-slate-300 dark:border-[#24395C] dark:bg-[#1f2a40] dark:hover:border-slate-600"
                      >
                        <div
                          className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg ${iconClass}`}
                        >
                          {n.tone === "success" ? (
                            <HiOutlineCheckCircle className="text-lg" />
                          ) : n.tone === "info" ? (
                            <HiOutlineChartBar className="text-lg" />
                          ) : (
                            <HiOutlineInformationCircle className="text-lg" />
                          )}
                        </div>Benefit
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {n.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                            {n.body}
                          </p>
                          <Link
                            href="/admin/admin-notification"
                            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => setNotificationOpen(false)}
                          >
                            View Details
                            <HiOutlineArrowTopRightOnSquare className="text-xs" />
                          </Link>
                          <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                            {n.time}
                          </p>
                        </div>
                        {n.unread && (
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-slate-200 p-3 dark:border-[#24395C]">
                  <Link
                    href="/admin/admin-notification"
                    onClick={() => setNotificationOpen(false)}
                    className="block w-full rounded-lg bg-slate-800 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-[#2F66E8] dark:hover:bg-[#2A5ED4]"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative hidden md:block" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setNotificationOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full  text-sm font-semibold text-white  border border-slate-200"
              aria-label="Profile"
            >
              <ProfileIcon/>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#24395C] dark:bg-[#1E293B]">
                <div className="border-b border-slate-200 p-4 dark:border-[#24395C]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full  text-sm font-semibold text-white border border-slate-200">
                      <ProfileIcon/>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {selectedUser.name || selectedUser.id}
                      </p>
                      <p className="mt-1 text-4 text-slate-500 dark:text-[#A7B6D3]">
                        {selectedUser.id}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
            <Link
            href="/employee"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-[#D1DBEF] dark:hover:bg-[#24364F]"
             >
            <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
            Employee
             </Link>
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-[#D1DBEF] dark:hover:bg-[#24364F]"
                  >
                    <HiOutlineUserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                  <div className="my-2 h-px bg-slate-200 dark:bg-[#24395C]" />
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                  >
                    <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full bg-[linear-gradient(90deg,rgba(118,55,255,0.0)_0%,rgba(118,55,255,0.65)_50%,rgba(118,55,255,0.0)_100%)]" />
      <div
        className={`md:hidden absolute left-0 top-16 w-full bg-white border-t border-slate-200 dark:bg-[#1E293B] dark:border-[#24395C] ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col gap-1 p-3 text-slate-600 dark:text-[#D1DBEF] text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 transition ${
                isActive(item.href)
                  ? "bg-blue-600 text-white dark:bg-[#2F66E8]"
                  : "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#24364F] dark:hover:text-white"
              }`}
            >
              <span className="scale-90">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="h-px bg-slate-200 dark:bg-[#24395C] my-2" />
          <Link
            href="/employee"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#24364F] dark:hover:text-white"
          >
            <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
            Employee руу шилжих
          </Link>
          <div className="h-px bg-slate-200 dark:bg-[#24395C] my-2" />
          <label className="inline-flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 dark:border-[#334155] dark:text-[#A7B6D3]">
            <span>User</span>
            <select
              value={selectedUser.id}
              onChange={(e) => handleUserChange(e.target.value)}
              className="ml-3 bg-transparent text-xs text-slate-700 outline-none dark:text-[#D1DBEF]"
              aria-label="Select active test user"
            >
              {userOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="text-slate-900">
                  {opt.name} ({opt.id})
                </option>
              ))}
            </select>
          </label>
          <div className="h-px bg-slate-200 dark:bg-[#24395C] my-2" />
          <div className="flex flex-col gap-2" ref={mobileNotificationRef}>
            <div className="flex items-center gap-2">
              <button
                type="button"
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
              <Link
                href="/admin/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center">
                  AD
                </div>
                <span className="text-slate-600 text-xs dark:text-slate-300">
                  Account
                </span>
              </Link>
            </div>
            {notificationOpen && (
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-[#24395C] dark:bg-[#0F172A] max-h-[300px] overflow-y-auto">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Notifications
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-[#A7B6D3]">
                  {notifications.length === 0
                    ? "No notifications."
                    : `${unreadCount} unread`}
                </p>
                <Link
                  href="/admin/admin-notification"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 block text-xs text-blue-600 dark:text-blue-400"
                >
                  View all →
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
