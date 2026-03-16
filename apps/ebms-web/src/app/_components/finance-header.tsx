"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HiBars3,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBell,
  HiOutlineChartPie,
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

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/finance",
    icon: <HiOutlineChartPie className="h-4 w-4" />,
  },
  {
    label: "Budget Overview",
    href: "/finance/budget-overview",
    icon: <HiOutlineCurrencyDollar className="h-4 w-4" />,
  },
  {
    label: "Vendor Payments",
    href: "/finance/vendor-payments",
    icon: <HiOutlineDocumentText className="h-4 w-4" />,
  },
  {
    label: "Audit Trail",
    href: "/finance/audit-trail",
    icon: <HiOutlineClock className="h-4 w-4" />,
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
    const profile = { id: nextUser.id, name: nextUser.name, role: nextUser.role };
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
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white px-4 dark:border-[#24395C] dark:bg-[#1E293B]">
      <div className="mx-auto flex h-full w-full max-w-[1500px] items-center justify-between gap-4">
        <Link
          href="/finance"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3 transition-opacity hover:opacity-90"
        >
          <img src="/logo.png" alt="EBMS Logo" className="h-10 w-auto sm:h-14" />
          <div className="leading-tight min-w-0">
            <p className="text-5 font-semibold text-slate-900 dark:text-white truncate">
              UPDATE
            </p>
            <p className="text-xs text-slate-600 dark:text-[#A7B6D3] truncate">
              Finance Panel
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                isActive(item.href)
                  ? "bg-blue-600 text-white dark:bg-[#2F66E8]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:bg-[#24364F] dark:hover:text-white"
              }`}
            >
              {item.icon}
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
          <ThemeToggle />
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
          <div className="relative hidden md:block" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:bg-[#24364F] dark:hover:text-white"
              aria-label="Notifications"
            >
              <HiOutlineBell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            {notificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-[#24395C] dark:bg-[#1E293B]">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Notifications
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-[#A7B6D3]">
                  No new finance notifications.
                </p>
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
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white dark:bg-[#2F66E8]"
              aria-label="Profile"
            >
              {initials}
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#24395C] dark:bg-[#1E293B]">
                <div className="border-b border-slate-200 p-4 dark:border-[#24395C]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white dark:bg-[#2F66E8]">
                      {initials}
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
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
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
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Notifications
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-[#A7B6D3]">
                  No new finance notifications.
                </p>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
