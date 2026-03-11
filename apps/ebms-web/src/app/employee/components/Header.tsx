"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { fetchMe } from "../_lib/api";

import {
  HiSquares2X2,
  HiOutlineBookmark,
  HiOutlineBell,
  HiBars3,
  HiXMark,
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCheckCircle,
  HiOutlineChartBar,
  HiOutlineInformationCircle,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

const NOTIFICATIONS = [
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

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [me, setMe] = useState<{ name: string; id: string } | null>(null);
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
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { key: "dashboard", label: "Dashboard", href: "/employee", icon: HiSquares2X2 },
    { key: "eligibility", label: "Benefit Eligibility", href: "/employee/benefits", icon: HiOutlineBookmark },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/employee" && pathname?.startsWith(href));

  return (
    <header className="w-full bg-[#1E293B] h-[64px] px-4 relative sticky top-0 z-50">
      <div className="h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 md:gap-6 ">
          <div className="flex items-center gap-2 text-white">
            <img src="/logo.png" alt="EBMS Logo" className="h-8 w-auto" />
            <span className="text-lg font-semibold tracking-wide">EBMS</span>
          </div>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-slate-300 text-xs ml-6">
            {navItems.map(({ key, label, href, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 transition ${
                  isActive(href)
                    ? "text-white bg-blue-600 "
                    : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="text-base" />
                {label}
              </Link>
            ))}
          </nav>
        
        <div className="flex items-center gap-2">
          <button
            className="md:hidden h-8 w-8 rounded-full bg-slate-800 text-slate-200 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-700 transition"
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
                className="relative h-8 w-8 rounded-full bg-slate-800 text-slate-200 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-700 transition"
                aria-label="Notifications"
              >
                <HiOutlineBell className="text-sm" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[420px] flex flex-col bg-[#1A2333] border border-[#243041] rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="flex items-center justify-between p-4 border-b border-[#243041]">
                    <div className="flex items-center gap-2">
                      <HiOutlineBell className="text-base text-slate-300" />
                      <span className="text-white font-semibold">Notifications</span>
                      <span className="px-2 py-0.5 rounded-full bg-red-500/80 text-white text-xs font-medium">
                        2 new
                      </span>
                    </div>
                    <button
                      onClick={() => setNotificationOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      <HiXMark className="text-lg" />
                    </button>
                  </div>
                  <Link
                    href="/employee/notification"
                    className="px-4 py-2 text-sm text-blue-400 hover:text-blue-300"
                    onClick={() => setNotificationOpen(false)}
                  >
                    Mark all as read
                  </Link>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {NOTIFICATIONS.map((n) => {
                      const iconClass =
                        n.tone === "success"
                          ? "text-green-400 bg-green-500/20"
                          : n.tone === "info"
                            ? "text-blue-400 bg-blue-500/20"
                            : "text-slate-400 bg-slate-500/20";
                      return (
                        <div
                          key={n.id}
                          className="flex gap-3 p-3 rounded-lg bg-[#1f2a40] border border-[#243041] hover:border-slate-600 transition"
                        >
                          <div className={`flex-shrink-0 h-8 w-8 rounded-lg grid place-items-center ${iconClass}`}>
                            {n.tone === "success" ? (
                              <HiOutlineCheckCircle className="text-lg" />
                            ) : n.tone === "info" ? (
                              <HiOutlineChartBar className="text-lg" />
                            ) : (
                              <HiOutlineInformationCircle className="text-lg" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold">{n.title}</p>
                            <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{n.body}</p>
                            <Link
                              href="/employee/notification"
                              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2"
                              onClick={() => setNotificationOpen(false)}
                            >
                              View Details
                              <HiOutlineArrowTopRightOnSquare className="text-xs" />
                            </Link>
                            <p className="text-slate-500 text-[10px] mt-1">{n.time}</p>
                          </div>
                          {n.unread && (
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 border-t border-[#243041]">
                    <Link
                      href="/employee/notification"
                      onClick={() => setNotificationOpen(false)}
                      className="block w-full py-2.5 text-center text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
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
                className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center ml-1 ring-1 ring-transparent hover:ring-blue-300 hover:bg-blue-500 transition"
                aria-label="Profile"
              >
                {me?.name?.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase() ?? "JD"}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-[280px] bg-[#1A2333] border border-[#243041] rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-[#243041]">
                    <p className="text-white font-semibold">{me?.name ?? "—"}</p>
                    <p className="text-slate-400 text-sm mt-0.5">—</p>
                    <p className="text-slate-500 text-xs mt-1">{me?.id ?? "—"}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/employee/myprofile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition"
                    >
                      <HiOutlineUserCircle className="text-lg" />
                      My Profile
                    </Link>
                    <Link
                      href="/employee/"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white transition"
                    >
                      <HiOutlineCog6Tooth className="text-lg" />
                      Settings
                    </Link>
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                    >
                      <HiOutlineArrowRightOnRectangle className="text-lg" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden absolute left-0 top-[64px] w-full bg-slate-900 border-t border-slate-800 ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col gap-1 p-3 text-slate-300 text-sm">
          {navItems.map(({ key, label, href, icon: Icon }) => (
            <Link
              key={key}
              href={href}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ring-1 transition ${
                isActive(href)
                  ? "text-white bg-blue-600 ring-blue-300"
                  : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <Icon className="text-base" />
              {label}
            </Link>
          ))}
          <div className="h-px bg-slate-800 my-2" />
          <div className="flex items-center gap-2">
            <Link
              href="/employee/notification"
              onClick={() => setMenuOpen(false)}
              className="h-8 w-8 rounded-full bg-slate-800 text-slate-200 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-700 transition"
            >
              <HiOutlineBell className="text-sm" />
            </Link>
            <Link
              href="/employee/notification"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center">
                {me?.name?.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase() ?? "JD"}
              </div>
              <span className="text-slate-300 text-xs">Account</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
