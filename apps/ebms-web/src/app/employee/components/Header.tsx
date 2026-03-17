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
        <Link href="/employee" className="flex min-w-0 items-center gap-2 text-slate-900 hover:opacity-90 dark:text-white">
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
          <label className="hidden md:flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-600 dark:border-[#334155] dark:text-[#A7B6D3]">
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

          <div className="h-10 w-10 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 dark:text-[#D1DBEF] dark:hover:text-white dark:hover:bg-[#0a121b]">
            <ThemeToggle />
          </div>

          <button
            className="md:hidden h-10 w-10 rounded-full bg-slate-100 text-slate-600 grid place-items-center hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle navigation"
          >
            <HiBars3 className="text-sm" />
          </button>

          <div className="hidden md:flex items-center gap-2">
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
            <div className="relative" ref={profileRef}>
							<button
								onClick={() => {
									setProfileOpen(!profileOpen);
									setNotificationOpen(false);
								}}
								className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200  text-sm font-semibold text-white "
								aria-label="Profile"
							>
								<ProfileIcon />
							</button>
							{profileOpen && (
								<div className="absolute right-0 top-full mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 dark:bg-[#1A2333] dark:border-[#243041]">
									<div className="p-4 border-b border-slate-200 dark:border-[#243041]">
										<div className="flex items-center gap-3">
											<div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200  text-sm font-semibold text-white ">
												<ProfileIcon />
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
											href="/admin"
											onClick={(e) => {
												handleAdminNavigate(e);
											}}
											className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white ${!isAdminOrHrUser ? "opacity-60 cursor-not-allowed" : ""}`}
										>
											<HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
											Admin
										</Link>
										<Link
											href="/finance"
											onClick={(e) => {
												handleFinanceNavigate(e);
											}}
											className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white ${!isFinanceManagerUser ? "opacity-60 cursor-not-allowed" : ""}`}
										>
											<HiOutlineChartBar className="h-4 w-4" />
											Finance
										</Link>
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
				className={`md:hidden absolute left-0 top-[72px] w-full bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800 ${
					menuOpen ? "block" : "hidden"
				}`}
			>
				<nav className="flex flex-col gap-1 p-3 text-slate-600 dark:text-slate-300 text-sm">
					<Link
						href="/admin"
						onClick={(e) => {
							handleAdminNavigate(e);
							if (isAdminOrHrUser) setMenuOpen(false);
						}}
						aria-disabled={!isAdminOrHrUser}
						className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 ring-1 ring-transparent hover:ring-blue-300 hover:text-slate-900 hover:bg-slate-100 transition dark:text-slate-300 dark:hover:ring-blue-300 dark:hover:text-white dark:hover:bg-slate-800"
					>
						<HiOutlineArrowTopRightOnSquare className="text-base" />
						Admin руу шилжих
					</Link>
					<Link
						href="/finance"
						onClick={(e) => {
							handleFinanceNavigate(e);
							if (isFinanceManagerUser) setMenuOpen(false);
						}}
						aria-disabled={!isFinanceManagerUser}
						className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 ring-1 ring-transparent hover:ring-blue-300 hover:text-slate-900 hover:bg-slate-100 transition dark:text-slate-300 dark:hover:ring-blue-300 dark:hover:text-white dark:hover:bg-slate-800"
					>
						<HiOutlineChartBar className="text-base" />
						Finance руу шилжих
					</Link>
					<div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
					<label className="inline-flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 dark:border-[#334155] dark:text-[#A7B6D3]">
						<span>User</span>
						<select
							value={selectedUser.id}
							onChange={(e) => handleUserChange(e.target.value)}
							className="ml-3 bg-transparent text-xs text-slate-700 outline-none dark:text-[#D1DBEF]"
							aria-label="Select active user"
						>
							{userOptions.map((opt) => (
								<option key={opt.id} value={opt.id} className="text-slate-900">
									{opt.name} ({opt.id})
								</option>
							))}
						</select>
					</label>
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
