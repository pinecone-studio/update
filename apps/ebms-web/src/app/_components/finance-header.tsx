"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiBars3, HiOutlineBell } from "react-icons/hi2";
import { ThemeToggle } from "@/app/_components/ThemeToggle";
import { FinanceProfileDropdown } from "@/app/finance/components/FinanceProfileDropdown";
import { FinanceMobileHeaderMenu } from "@/app/finance/components/FinanceMobileHeaderMenu";
import { FinanceTaglineBanner } from "./finance-header/FinanceTaglineBanner";
import { FinanceNotificationDropdown } from "./finance-header/FinanceNotificationDropdown";
import { useFinanceHeader } from "./finance-header/useFinanceHeader";

export function FinanceHeader() {
  const pathname = usePathname();
  const {
    menuOpen,
    setMenuOpen,
    notificationOpen,
    setNotificationOpen,
    profileOpen,
    setProfileOpen,
    currentTaglineIndex,
    handleRandomTagline,
    selectedUser,
    userOptions,
    unreadCount,
    normalizedPath,
    initials,
    notificationRef,
    profileRef,
    handleUserChange,
  } = useFinanceHeader(pathname ?? "");

  return (
    <header className="sticky top-0 z-50 h-[72px] w-full border-b border-white/10 bg-[#0A121B]/95 px-3 backdrop-blur-md sm:px-4">
      <div className="mx-auto flex h-[72px] w-full max-w-[1512px] items-center justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-6 md:gap-6">
          <Link
            href="/finance"
            className="flex min-w-0 items-center gap-2 text-slate-900 transition-opacity hover:opacity-90 dark:text-white"
          >
            <div className="flex min-w-0 items-center gap-2">
              <img src="/logo.png" alt="EBMS Logo" className="h-9 w-auto sm:h-10" />
              <div className="leading-[24px]">
                <p className="flex items-start justify-start text-[20px] font-semibold tracking-[0px] text-white dark:text-white">
                  UPDATE
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-center px-2 md:flex">
          <FinanceTaglineBanner
            currentIndex={currentTaglineIndex}
            onRandom={handleRandomTagline}
          />
        </div>

        <div className="flex min-w-[180px] items-center justify-end gap-2 sm:gap-3">
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
          <div className="flex items-center justify-end gap-2 shrink-0 min-w-0 sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-[#334155] dark:text-[#D1DBEF] dark:hover:bg-[#0a121b] dark:hover:text-white">
              <ThemeToggle />
            </div>
            <button
              className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-transparent transition hover:ring-blue-300 hover:bg-slate-200 md:hidden dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle navigation"
            >
              <HiBars3 className="text-sm" />
            </button>
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    setNotificationOpen((p) => !p);
                    setProfileOpen(false);
                  }}
                  className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 ring-1 ring-transparent transition hover:bg-slate-200 dark:border-[#334155] dark:hover:bg-white/10"
                  aria-label="Notifications"
                >
                  <HiOutlineBell className="h-5 w-5 text-sm" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-[0_0_0_2px_rgba(10,18,27,0.95)] animate-pulse">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                <FinanceNotificationDropdown
                  open={notificationOpen}
                  unreadCount={unreadCount}
                  onClose={() => setNotificationOpen(false)}
                />
              </div>
              <div ref={profileRef}>
                <FinanceProfileDropdown
                  open={profileOpen}
                  userName={selectedUser.name || selectedUser.id}
                  userId={selectedUser.id}
                  onToggle={() => {
                    setProfileOpen((p) => !p);
                    setNotificationOpen(false);
                  }}
                  onClose={() => setProfileOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FinanceMobileHeaderMenu
        open={menuOpen}
        pathname={normalizedPath}
        selectedUserId={selectedUser.id}
        userOptions={userOptions}
        initials={initials}
        unreadNotificationCount={unreadCount}
        onClose={() => setMenuOpen(false)}
        onSelectUser={handleUserChange}
      />
    </header>
  );
}
