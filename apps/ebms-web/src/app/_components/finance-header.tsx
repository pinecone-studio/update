"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HiBars3,
  HiOutlineArrowPath,
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBell,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/app/_components/ThemeToggle";
import {
  fetchSwitchUserOptions,
  getInitialUserProfile,
  getActiveUserProfile,
  setActiveUserProfile,
  type ActiveUserProfile,
  type SwitchUserOption,
} from "@/app/_lib/activeUser";
import { ProfileIcon } from "../icons/profile";
import { GeistSans } from "geist/font/sans";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

type FinanceNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/finance",
    icon: <HiOutlineArrowPath className="h-5 w-5" />,
  },
  {
    label: "Budget Overview",
    href: "/finance/budget-overview",
    icon: <HiOutlineCurrencyDollar className="h-5 w-5" />,
  },
  {
    label: "Vendor Payments",
    href: "/finance/vendor-payments",
    icon: <HiOutlineDocumentText className="h-5 w-5" />,
  },
  {
    label: "Audit Trail",
    href: "/finance/audit-trail",
    icon: <HiOutlineClock className="h-5 w-5" />,
  },
];

const FINANCE_NOTIFICATIONS: FinanceNotification[] = [
  {
    id: "f1",
    title: "Payment Approval Required",
    body: "Bat-Erdene's Gym Membership benefit requires payment approval.",
    time: "5 minutes ago",
    unread: true,
  },
  {
    id: "f2",
    title: "New Reimbursement Request",
    body: "Nomin submitted an expense reimbursement for Education Allowance.",
    time: "30 minutes ago",
    unread: true,
  },
  {
    id: "f3",
    title: "Payment Processed",
    body: "Payment for Bat-Erdene's Gym Membership has been completed.",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: "f4",
    title: "Reimbursement Approved",
    body: "Ariunaa's Transit Pass reimbursement was approved.",
    time: "Yesterday",
    unread: false,
  },
];

export function FinanceHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileNotificationRef = useRef<HTMLDivElement>(null);
  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  const isActive = (href: string) =>
    normalizedPath === href ||
    (href !== "/finance" && normalizedPath.startsWith(href));

  const unreadCount = FINANCE_NOTIFICATIONS.filter((n) => n.unread).length;

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
        // keep fallback list when query fails
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedUser.id]);

  const handleUserChange = (value: string) => {
    const nextUser = userOptions.find((u) => u.id === value);
    if (!nextUser) return;
    const profile = {
      id: nextUser.id,
      name: nextUser.name,
      role: nextUser.role,
    };
    setSelectedUser(profile);
    setActiveUserProfile(profile);
  };

  const initials = (selectedUser.name || selectedUser.id || "FM")
    .split(" ")
    .map((s) => s[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

  return (
    <header
      className={`sticky top-0 z-50 h-[72px] w-full border-b border-white/10 bg-[#0A121B]/95 px-4 backdrop-blur-md ${GeistSans.className}`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1500px] items-center justify-between gap-4">
        <Link
          href="/finance"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3 transition-opacity hover:opacity-90"
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
        <nav className="hidden items-center md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center h-[46px] rounded-lg gap-2 px-5 py-4 font-medium transition ${
                isActive(item.href)
                  ? "bg-[#151b1d] text-white hover:bg-[#151b1d] dark:bg-[#ffffff]/10 dark:hover:bg-[#ffffff]/10"
                  : "text-slate-400 hover:bg-[#ffffff]/10 hover:text-white dark:text-[#D1DBEF] dark:hover:bg-[#ffffff]/10 dark:hover:text-white"
              }`}
            >
              <span className="scale-90">{item.icon}</span>
              <span className="text-[20px] font-medium text-[#E5E5E5]">{item.label}</span>
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
              aria-label="Select active finance user"
            >
              {userOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="text-slate-900">
                  {opt.name} ({opt.id})
                </option>
              ))}
            </select>
          </label>
          <div className="h-10 w-10 flex  items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:text-white dark:hover:bg-[#0a121b]">
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
              <div className="absolute right-0 top-full mt-2 flex max-h-[420px] w-[380px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50 dark:border-[#24395C] dark:bg-[#1A2333] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Notifications
                  </p>
                  <span className="text-[11px] text-slate-500 dark:text-[#A7B6D3]">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                  {FINANCE_NOTIFICATIONS.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-slate-300 hover:bg-slate-100 dark:border-[#24395C] dark:bg-[#0F172A] dark:hover:border-[#3A4A6C] dark:hover:bg-[#162033]"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2.5 w-2.5 rounded-full ${
                            item.unread ? "bg-red-500" : "bg-slate-300"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-600 dark:text-[#A7B6D3]">
                            {item.body}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <Link
                  href="/finance/finance-notification"
                  onClick={() => setNotificationOpen(false)}
                  className="mt-3 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-[#24395C] dark:bg-[#111A2A] dark:text-slate-200 dark:hover:bg-[#1A2333]"
                >
                  View all notifications
                </Link>
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
              <ProfileIcon />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#24395C] dark:bg-[#1E293B]">
                <div className="border-b border-slate-200 p-4 dark:border-[#24395C]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full  text-sm font-semibold text-white  border border-slate-200">
                      <ProfileIcon />
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
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-[#D1DBEF] dark:hover:bg-[#24364F]"
                  >
                    <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                    Employee
                  </Link>
                  <Link
                    href="/finance/profile"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-[#D1DBEF] dark:hover:bg-[#24364F]"
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
              {item.icon}
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
              aria-label="Select active finance user"
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
                {unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                ) : null}
              </button>
              <Link
                href="/finance/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center">
                  {initials}
                </div>
                <span className="text-slate-600 text-xs dark:text-slate-300">
                  Account
                </span>
              </Link>
            </div>
            {notificationOpen && (
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-[#24395C] dark:bg-[#0F172A]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Notifications
                  </p>
                  <span className="text-[11px] text-slate-500 dark:text-[#A7B6D3]">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {FINANCE_NOTIFICATIONS.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-[#24395C] dark:bg-[#111A2A]"
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-1 h-2 w-2 rounded-full ${
                            item.unread ? "bg-red-500" : "bg-slate-300"
                          }`}
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-600 dark:text-[#A7B6D3]">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/finance/finance-notification"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 block rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 dark:border-[#24395C] dark:bg-[#111A2A] dark:text-slate-200"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
