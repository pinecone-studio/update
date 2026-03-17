import { useEffect, useRef, useState } from "react";
import {
  fetchSwitchUserOptions,
  getInitialUserProfile,
  getActiveUserProfile,
  setActiveUserProfile,
  type ActiveUserProfile,
  type SwitchUserOption,
} from "@/app/_lib/activeUser";
import {
  STORAGE_KEY,
  DEFAULT_NOTIFICATIONS,
  type AdminNotification,
} from "./admin-header-constants";

export function useAdminHeader(pathname: string) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileNotificationRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>(
    DEFAULT_NOTIFICATIONS
  );
  const [selectedUser, setSelectedUser] = useState<ActiveUserProfile>(
    getInitialUserProfile()
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
    setSelectedUser(getActiveUserProfile());
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
    const profile = {
      id: nextUser.id,
      name: nextUser.name,
      role: nextUser.role,
    };
    setSelectedUser(profile);
    setActiveUserProfile(profile);
  };

  const setNotificationsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  return {
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
  };
}
