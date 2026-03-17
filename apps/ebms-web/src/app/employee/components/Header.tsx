/** @format */

"use client";

import Link from "next/link";
import { HiBars3 } from "react-icons/hi2";
import { ThemeToggle } from "@/app/_components/ThemeToggle";
import { TaglineBar } from "./header/TaglineBar";
import { NotificationDropdown } from "./header/NotificationDropdown";
import { ProfileDropdown } from "./header/ProfileDropdown";
import { MobileHeaderMenu } from "./header/MobileHeaderMenu";
import { TAGLINES } from "./header/headerData";
import { useEmployeeHeader } from "../_hooks/useEmployeeHeader";

export const Header = () => {
  const {
    menuOpen,
    setMenuOpen,
    notificationOpen,
    setNotificationOpen,
    profileOpen,
    setProfileOpen,
    currentTaglineIndex,
    me,
    notifications,
    selectedUser,
    userOptions,
    notificationRef,
    profileRef,
    diceButtonRef,
    unreadCount,
    isAdminOrHrUser,
    isFinanceManagerUser,
    handleRandomTagline,
    handleUserChange,
    handleAdminNavigate,
    handleFinanceNavigate,
  } = useEmployeeHeader();

  return (
    <header className="sticky top-0 z-50 h-[72px] w-full border-b border-white/10 bg-[#0A121B]/95 px-3 sm:px-4 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1512px] items-center justify-between gap-3 sm:gap-4">
        <Link
          href="/employee"
          className="flex min-w-0 items-center gap-2 text-slate-900 hover:opacity-90 dark:text-white"
        >
          <img src="/logo.png" alt="EBMS Logo" className="h-9 w-auto sm:h-10" />
          <p className="text-[20px] font-semibold text-white">UPDATE</p>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center px-2 md:flex">
          <TaglineBar
            text={TAGLINES[currentTaglineIndex]}
            onRandom={handleRandomTagline}
            diceButtonRef={diceButtonRef}
          />
        </div>

        <div className="flex min-w-[180px] items-center justify-end gap-2">
          <label className="hidden items-center gap-2 rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-600 md:flex dark:border-[#334155] dark:text-[#A7B6D3]">
            <span>User</span>
            <select
              value={selectedUser.id}
              onChange={(e) => handleUserChange(e.target.value)}
              className="bg-transparent text-xs text-slate-700 outline-none dark:text-[#D1DBEF]"
              aria-label="Select active user"
            >
              {userOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="text-slate-900">
                  {opt.name} ({opt.id})
                </option>
              ))}
            </select>
          </label>

          <div className="h-10 w-10 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 dark:text-[#D1DBEF] dark:hover:bg-[#0a121b] dark:hover:text-white">
            <ThemeToggle />
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 md:hidden dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle navigation"
          >
            <HiBars3 className="text-sm" />
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <div ref={notificationRef}>
              <NotificationDropdown
                open={notificationOpen}
                unreadCount={unreadCount}
                notifications={notifications}
                onToggle={() => {
                  setNotificationOpen((p) => !p);
                  setProfileOpen(false);
                }}
                onClose={() => setNotificationOpen(false)}
              />
            </div>
          </div>

          <div ref={profileRef}>
            <ProfileDropdown
              open={profileOpen}
              me={me}
              isAdminOrHrUser={isAdminOrHrUser}
              isFinanceManagerUser={isFinanceManagerUser}
              onToggle={() => {
                setProfileOpen((p) => !p);
                setNotificationOpen(false);
              }}
              onClose={() => setProfileOpen(false)}
              onAdminNavigate={handleAdminNavigate}
              onFinanceNavigate={handleFinanceNavigate}
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full bg-[linear-gradient(90deg,rgba(118,55,255,0.0)_0%,rgba(118,55,255,0.65)_50%,rgba(118,55,255,0.0)_100%)]" />

      <MobileHeaderMenu
        open={menuOpen}
        selectedUserId={selectedUser.id}
        userOptions={userOptions}
        meName={me?.name}
        isAdminOrHrUser={isAdminOrHrUser}
        isFinanceManagerUser={isFinanceManagerUser}
        onClose={() => setMenuOpen(false)}
        onSelectUser={handleUserChange}
        onAdminNavigate={handleAdminNavigate}
        onFinanceNavigate={handleFinanceNavigate}
      />
    </header>
  );
};
