"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiBars3, HiOutlineBell } from "react-icons/hi2";
import { ThemeToggle } from "@/app/_components/ThemeToggle";
import { ProfileIcon } from "../icons/profile";
import { GeistSans } from "geist/font/sans";
import { navItems } from "./header/admin-header-constants";
import { AdminNotificationDropdown } from "./header/AdminNotificationDropdown";
import { AdminProfileDropdown } from "./header/AdminProfileDropdown";
import { AdminMobileMenu } from "./header/AdminMobileMenu";
import { useAdminHeader } from "./header/useAdminHeader";

export function Header() {
  const pathname = usePathname();
  const {
    menuOpen,
    setMenuOpen,
    notificationOpen,
    setNotificationOpen,
    profileOpen,
    setProfileOpen,
    notifications,
    selectedUser,
    userOptions,
    unreadCount,
    normalizedPath,
    notificationRef,
    profileRef,
    mobileNotificationRef,
    handleUserChange,
    setNotificationsRead,
  } = useAdminHeader(pathname ?? "");

  const isActive = (href: string) =>
    normalizedPath === href ||
    (href !== "/admin" && normalizedPath.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 h-[72px] w-full border-b border-white/10 bg-[#0A121B]/95 px-4 backdrop-blur-md ${GeistSans.className}`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1500px] items-center justify-between gap-4">
        <Link
          href="/admin"
          className="flex min-w-0 shrink-0 items-center gap-2 transition-opacity hover:opacity-90 sm:gap-3"
        >
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="EBMS Logo" className="h-10 w-auto" />
            <div className="leading-[24px]">
              <p className="flex items-start justify-start text-[20px] font-semibold tracking-[0px] text-white dark:text-white">
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
              className={`inline-flex h-[46px] items-center gap-2 rounded-lg px-5 py-4 font-medium transition ${
                isActive(item.href)
                  ? "bg-[#151b1d] text-white hover:bg-[#151b1d] dark:bg-[#ffffff]/10 dark:hover:bg-[#ffffff]/10"
                  : "text-slate-400 hover:bg-[#ffffff]/10 hover:text-white dark:text-[#D1DBEF] dark:hover:bg-[#ffffff]/10 dark:hover:text-white"
              }`}
            >
              <span className="scale-[1.2x]">{item.icon}</span>
              <span className="line-height-[120%] text-[18px] font-light text-[rgba(229,229,229,1)]">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden dark:text-[#D1DBEF] dark:hover:bg-[#24364F] dark:hover:text-white"
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:bg-[#0a121b] dark:hover:text-white">
            <ThemeToggle />
          </div>
          <div className="relative hidden md:block" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-[#D1DBEF] dark:hover:bg-[#24364F] dark:hover:text-white"
              aria-label="Notifications"
            >
              <HiOutlineBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
            <AdminNotificationDropdown
              open={notificationOpen}
              notifications={notifications}
              unreadCount={unreadCount}
              onClose={() => setNotificationOpen(false)}
              onMarkAllRead={setNotificationsRead}
            />
          </div>
          <div className="relative hidden md:block" ref={profileRef}>
            <AdminProfileDropdown
              open={profileOpen}
              selectedUser={selectedUser}
              onClose={() => setProfileOpen(false)}
              onToggle={() => {
                setProfileOpen((prev) => !prev);
                setNotificationOpen(false);
              }}
            />
          </div>
        </div>
      </div>

      <div ref={mobileNotificationRef}>
        <AdminMobileMenu
          open={menuOpen}
          pathname={normalizedPath}
          selectedUser={selectedUser}
          userOptions={userOptions}
          notifications={notifications}
          unreadCount={unreadCount}
          notificationOpen={notificationOpen}
          onClose={() => setMenuOpen(false)}
          onSelectUser={handleUserChange}
          onNotificationToggle={() => setNotificationOpen((prev) => !prev)}
        />
      </div>
    </header>
  );
}
