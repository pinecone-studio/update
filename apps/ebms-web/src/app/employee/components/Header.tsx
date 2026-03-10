"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import {
  HiSquares2X2,
  HiOutlineBookmark,
  HiOutlineDocumentText,
  HiOutlineBell,
  HiBars3,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    icon: HiOutlineAcademicCap,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
    title: "You're Now Eligible for Education Allowance!",
    description:
      "Congratulations! You've reached 1 year tenure with an OKR score of 82%. You can now request Education Allowance.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    icon: HiOutlineChartBar,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/20",
    title: "OKR Score Updated",
    description:
      "Your Q1 2026 OKR score has been updated to 82%. This may affect your benefit eligibility.",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: "3",
    icon: HiOutlineCheckCircle,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/20",
    title: "Transit Pass Request Approved",
    description: "Your Transit Pass benefit request has been approved.",
    time: "1 day ago",
    unread: false,
  },
];

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export const Header = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useClickOutside(notificationsRef, () => setNotificationsOpen(false));
  useClickOutside(profileRef, () => setProfileOpen(false));

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const NotificationsPopup = () => (
    <div className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)] rounded-xl bg-slate-800 border border-slate-700 shadow-xl overflow-hidden z-[100]">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiOutlineBell className="text-slate-300 text-lg" />
            <span className="font-semibold text-white">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={() => setNotificationsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
            aria-label="Close"
          >
            <HiOutlineXMark className="text-xl" />
          </button>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition"
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-[320px] overflow-y-auto p-2">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className="flex gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition"
            >
              <div
                className={`shrink-0 w-10 h-10 rounded-lg ${n.iconBg} flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${n.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{n.title}</p>
                <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">
                  {n.description}
                </p>
                <a
                  href="#"
                  className="inline-block text-blue-400 text-xs font-medium mt-1 hover:text-blue-300"
                >
                  View Details →
                </a>
                <p className="text-slate-500 text-xs mt-1">{n.time}</p>
              </div>
              {n.unread && (
                <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
              )}
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={() => {
            setNotificationsOpen(false);
            router.push("/employee/notification");
          }}
          className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition"
        >
          View All Notifications
        </button>
      </div>
    </div>
  );

  const ProfilePopup = () => (
    <div className="absolute right-0 top-full mt-2 w-[280px] rounded-xl bg-slate-800 border border-slate-700 shadow-xl overflow-hidden z-[100]">
      <div className="p-4 bg-slate-800/80 border-b border-slate-700">
        <p className="font-bold text-white">John Doe</p>
        <p className="text-slate-400 text-sm mt-0.5">john.doe@company.com</p>
        <p className="text-slate-500 text-xs mt-0.5">EMP-2024-1234</p>
      </div>
      <div className="p-2">
        <button
          onClick={() => {
            setProfileOpen(false);
            router.push("/employee/profile");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition text-left"
        >
          <HiOutlineUser className="text-lg text-slate-400" />
          My Profile
        </button>
        <button
          onClick={() => {
            setProfileOpen(false);
            router.push("/employee/settings");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition text-left"
        >
          <HiOutlineCog6Tooth className="text-lg text-slate-400" />
          Settings
        </button>
        <button
          onClick={() => {
            setProfileOpen(false);
            router.push("/");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition text-left"
        >
          <HiOutlineArrowRightOnRectangle className="text-lg" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <header className="w-full bg-[#1E293B] h-[64px] px-4 relative sticky top-0 z-50">
      <div className="h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-white">
            <img src="/logo.png" alt="EBMS Logo" className="h-8 w-auto" />
            <span className="text-lg font-semibold tracking-wide">EBMS</span>
          </div>
          <nav className="hidden md:flex items-center gap-2 text-slate-300 text-xs ml-6">
            <button
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 transition ${
                activeTab === "dashboard"
                  ? "text-white bg-blue-600 ring-blue-300"
                  : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <HiSquares2X2 className="text-base" />
              Dashboard
            </button>
            <button
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 transition ${
                activeTab === "eligibility"
                  ? "text-white bg-blue-600 ring-blue-300"
                  : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("eligibility")}
            >
              <HiOutlineBookmark className="text-base" />
              Benefit Eligibility
            </button>
            <button
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 transition ${
                activeTab === "requests"
                  ? "text-white bg-blue-600 ring-blue-300"
                  : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("requests")}
            >
              <HiOutlineDocumentText className="text-base" />
              Benefit Requests
            </button>
            <button
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 transition ${
                activeTab === "notifications"
                  ? "text-white bg-blue-600 ring-blue-300"
                  : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
              }`}
              onClick={() => {
                setActiveTab("notifications");
                router.push("/employee/notification");
              }}
            >
              <HiOutlineBell className="text-base" />
              Notifications
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="md:hidden h-8 w-8 rounded-full bg-slate-800 text-slate-200 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-700 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <HiBars3 className="text-sm" />
          </button>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setNotificationsOpen(!notificationsOpen);
                }}
                className="relative h-8 w-8 rounded-full bg-slate-800 text-slate-200 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-700 transition"
                aria-label="Notifications"
              >
                <HiOutlineBell className="text-sm" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-[#1E293B]" />
                )}
              </button>
              {notificationsOpen && <NotificationsPopup />}
            </div>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(false);
                  setProfileOpen(!profileOpen);
                }}
                className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center ml-1 ring-1 ring-transparent hover:ring-blue-300 hover:bg-blue-500 transition"
                aria-label="Profile"
              >
                JD
              </button>
              {profileOpen && <ProfilePopup />}
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
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ring-1 transition ${
              activeTab === "dashboard"
                ? "text-white bg-blue-600 ring-blue-300"
                : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => {
              setActiveTab("dashboard");
              setMenuOpen(false);
            }}
          >
            <HiSquares2X2 className="text-base" />
            Dashboard
          </button>
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ring-1 transition ${
              activeTab === "eligibility"
                ? "text-white bg-blue-600 ring-blue-300"
                : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => {
              setActiveTab("eligibility");
              setMenuOpen(false);
            }}
          >
            <HiOutlineBookmark className="text-base" />
            Benefit Eligibility
          </button>
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ring-1 transition ${
              activeTab === "requests"
                ? "text-white bg-blue-600 ring-blue-300"
                : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => {
              setActiveTab("requests");
              setMenuOpen(false);
            }}
          >
            <HiOutlineDocumentText className="text-base" />
            Benefit Requests
          </button>
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ring-1 transition ${
              activeTab === "notifications"
                ? "text-white bg-blue-600 ring-blue-300"
                : "text-slate-300 ring-transparent hover:ring-blue-300 hover:text-white hover:bg-slate-800"
            }`}
            onClick={() => {
              setActiveTab("notifications");
              setMenuOpen(false);
              router.push("/employee/notification");
            }}
          >
            <HiOutlineBell className="text-base" />
            Notifications
          </button>
          <div className="h-px bg-slate-800 my-2" />
          <div className="flex items-center gap-2">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  setNotificationsOpen(!notificationsOpen);
                }}
                className="relative h-8 w-8 rounded-full bg-slate-800 text-slate-200 grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-slate-700 transition"
              >
                <HiOutlineBell className="text-sm" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-slate-900" />
                )}
              </button>
              {notificationsOpen && (
                <div className="fixed inset-0 z-40 md:hidden" onClick={() => setNotificationsOpen(false)}>
                  <div className="absolute right-4 top-20 w-[calc(100vw-2rem)] max-w-[380px]" onClick={(e) => e.stopPropagation()}>
                    <NotificationsPopup />
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(false);
                  setProfileOpen(!profileOpen);
                }}
                className="h-8 w-8 rounded-full bg-blue-600 text-white text-[10px] font-semibold grid place-items-center ring-1 ring-transparent hover:ring-blue-300 hover:bg-blue-500 transition"
              >
                JD
              </button>
              {profileOpen && (
                <div className="fixed inset-0 z-40 md:hidden" onClick={() => setProfileOpen(false)}>
                  <div className="absolute right-4 top-20 w-[calc(100vw-2rem)] max-w-[280px]" onClick={(e) => e.stopPropagation()}>
                    <ProfilePopup />
                  </div>
                </div>
              )}
            </div>
            <span className="text-slate-300 text-xs">Account</span>
          </div>
        </nav>
      </div>
      {(notificationsOpen || profileOpen) && (
        <div
          className="hidden md:block fixed inset-0 z-40"
          onClick={() => {
            setNotificationsOpen(false);
            setProfileOpen(false);
          }}
          aria-hidden="true"
        />
      )}
    </header>
  );
};
