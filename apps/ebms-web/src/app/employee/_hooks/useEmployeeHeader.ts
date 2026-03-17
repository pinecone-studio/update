/** @format */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchMe } from "../_lib/api";
import {
  fetchSwitchUserOptions,
  getActiveUserProfile,
  getInitialUserProfile,
  setActiveUserProfile,
  type ActiveUserProfile,
  type SwitchUserOption,
} from "@/app/_lib/activeUser";
import {
  DEFAULT_NOTIFICATIONS,
  STORAGE_KEY,
  TAGLINE_CHANGE_MS,
  TAGLINE_INDEX_KEY,
  TAGLINE_LAST_CHANGE_KEY,
  TAGLINES,
  type EmployeeNotification,
} from "../components/header/headerData";

export function useEmployeeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [me, setMe] = useState<{ name: string; id: string } | null>(null);
  const [notifications, setNotifications] = useState<EmployeeNotification[]>(
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

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const diceButtonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const current = getActiveUserProfile();
    setSelectedUser(current);
  }, []);

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
  }, [selectedUser.id]);

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

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as EmployeeNotification[];
      if (Array.isArray(parsed) && parsed.length > 0) setNotifications(parsed);
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const savedIndex = Number(localStorage.getItem(TAGLINE_INDEX_KEY) ?? "0");
    const lastChange = Number(localStorage.getItem(TAGLINE_LAST_CHANGE_KEY) ?? "0");
    if (Number.isFinite(savedIndex) && savedIndex >= 0) {
      setCurrentTaglineIndex(savedIndex % TAGLINES.length);
    }
    if (!lastChange) {
      localStorage.setItem(TAGLINE_LAST_CHANGE_KEY, Date.now().toString());
      return;
    }
    if (Date.now() - lastChange >= TAGLINE_CHANGE_MS) {
      const next = (savedIndex + 1) % TAGLINES.length;
      setCurrentTaglineIndex(next);
      localStorage.setItem(TAGLINE_INDEX_KEY, String(next));
      localStorage.setItem(TAGLINE_LAST_CHANGE_KEY, Date.now().toString());
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTaglineIndex((prev) => {
        const next = (prev + 1) % TAGLINES.length;
        localStorage.setItem(TAGLINE_INDEX_KEY, String(next));
        localStorage.setItem(TAGLINE_LAST_CHANGE_KEY, Date.now().toString());
        return next;
      });
    }, TAGLINE_CHANGE_MS);
    return () => window.clearInterval(interval);
  }, []);

  const handleRandomTagline = useCallback(() => {
    if (TAGLINES.length <= 1) return;
    diceButtonRef.current?.animate(
      [
        { transform: "translateY(-50%) rotate(0deg) scale(1)" },
        { transform: "translateY(-50%) rotate(-10deg) scale(0.96)" },
        { transform: "translateY(-50%) rotate(12deg) scale(1.03)" },
        { transform: "translateY(-50%) rotate(0deg) scale(1)" },
      ],
      { duration: 320, easing: "ease-in-out" },
    );

    let next = currentTaglineIndex;
    while (next === currentTaglineIndex) next = Math.floor(Math.random() * TAGLINES.length);

    setCurrentTaglineIndex(next);
    localStorage.setItem(TAGLINE_INDEX_KEY, String(next));
    localStorage.setItem(TAGLINE_LAST_CHANGE_KEY, Date.now().toString());
  }, [currentTaglineIndex]);

  const unreadCount = pathname?.startsWith("/employee/notification")
    ? 0
    : notifications.filter((n) => n.unread).length;

  const handleUserChange = (value: string) => {
    const nextUser = userOptions.find((u) => u.id === value);
    if (!nextUser) return;
    const profile = { id: nextUser.id, name: nextUser.name, role: nextUser.role };
    setSelectedUser(profile);
    setActiveUserProfile(profile);
  };

  const isAdminOrHrUser =
    (selectedUser.role ?? "").toLowerCase() === "admin" ||
    (selectedUser.role ?? "").toLowerCase() === "hr";
  const isFinanceManagerUser = (selectedUser.role ?? "")
    .toLowerCase()
    .includes("finance");

  const handleAdminNavigate = (e: { preventDefault: () => void }) => {
    if (isAdminOrHrUser) return;
    e.preventDefault();
    alert("Зөвхөн admin эсвэл hr role-тэй хэрэглэгч Admin хэсэг рүү орж чадна.");
  };

  const handleFinanceNavigate = (e: { preventDefault: () => void }) => {
    if (isFinanceManagerUser) return;
    e.preventDefault();
    alert("Зөвхөн finance role-тэй хэрэглэгч Finance хэсэг рүү орж чадна.");
  };

  return {
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
  };
}
