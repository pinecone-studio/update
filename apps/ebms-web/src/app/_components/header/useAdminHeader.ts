import { useEffect, useRef, useState } from "react";
import {
  fetchSwitchUserOptions,
  getInitialUserProfile,
  getActiveUserProfile,
  setActiveUserProfile,
  type ActiveUserProfile,
  type SwitchUserOption,
} from "@/app/_lib/activeUser";
import { useOnUserSwitch } from "@/app/_lib/useOnUserSwitch";
import {
  DEFAULT_NOTIFICATIONS,
  type AdminNotification,
} from "./admin-header-constants";
import {
  fetchUnclosedFeedback,
  fetchAdminNotifications,
  markAllAdminNotificationsRead,
} from "@/app/admin/_lib/api";
import { formatRelativeTime } from "@/app/admin/_lib/utils";

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
  const [unclosedFeedbackCount, setUnclosedFeedbackCount] = useState(0);

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

  const [notificationsRefreshKey, setNotificationsRefreshKey] = useState(0);

  useOnUserSwitch(() => setNotificationsRefreshKey((k) => k + 1));

  useEffect(() => {
    let cancelled = false;
    fetchAdminNotifications(50)
      .then((items) => {
        if (cancelled) return;
        const mapped: AdminNotification[] = items.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          time: formatRelativeTime(n.createdAt),
          tone: (n.tone ?? "info") as AdminNotification["tone"],
          unread: n.unread,
        }));
        setNotifications(mapped.length > 0 ? mapped : DEFAULT_NOTIFICATIONS);
      })
      .catch(() => {
        if (!cancelled) setNotifications(DEFAULT_NOTIFICATIONS);
      });
    return () => {
      cancelled = true;
    };
  }, [notificationsRefreshKey]);

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

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetchUnclosedFeedback()
        .then((items) => {
          if (!cancelled) setUnclosedFeedbackCount(items.length);
        })
        .catch(() => {
          if (!cancelled) setUnclosedFeedbackCount(0);
        });
    load();
    const id = setInterval(load, 60000);
    const onFeedbackMarkedRead = () => load();
    window.addEventListener("ebms:feedback-marked-read", onFeedbackMarkedRead);
    return () => {
      cancelled = true;
      clearInterval(id);
      window.removeEventListener("ebms:feedback-marked-read", onFeedbackMarkedRead);
    };
  }, []);

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

  const setNotificationsRead = async () => {
    try {
      await markAllAdminNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    }
  };

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
    unclosedFeedbackCount,
    normalizedPath,
    notificationRef,
    profileRef,
    mobileNotificationRef,
    handleUserChange,
    setNotificationsRead,
  };
}
