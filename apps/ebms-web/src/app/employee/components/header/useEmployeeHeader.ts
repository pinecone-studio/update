import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchMe,
  fetchMyNotifications,
  formatRelativeTime,
  markAllNotificationsRead,
} from "@/app/employee/_lib/api";
import {
  fetchSwitchUserOptions,
  getInitialUserProfile,
  getActiveUserProfile,
  setActiveUserProfile,
  type ActiveUserProfile,
  type SwitchUserOption,
} from "@/app/_lib/activeUser";
import {
  TAGLINE_INDEX_KEY,
  TAGLINE_LAST_CHANGE_KEY,
  TAGLINE_CHANGE_MS,
  TAGLINES,
} from "./constants";
import type { HeaderNotification } from "./NotificationDropdown";

export function useEmployeeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [me, setMe] = useState<{ name: string; id: string } | null>(null);
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
  const [notifications, setNotifications] = useState<HeaderNotification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchMyNotifications(5)
      .then((list) => {
        if (cancelled) return;
        const mapped: HeaderNotification[] = list.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          time: formatRelativeTime(n.createdAt),
          tone:
            n.tone === "SUCCESS"
              ? "success"
              : n.tone === "WARNING"
                ? "warning"
                : "info",
          unread: !n.isRead,
        }));
        setNotifications(mapped);
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedUser.id]);

  useEffect(() => {
    const savedIndex = Number(localStorage.getItem(TAGLINE_INDEX_KEY) ?? "0");
    const lastChange = Number(
      localStorage.getItem(TAGLINE_LAST_CHANGE_KEY) ?? "0"
    );
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
    let next = currentTaglineIndex;
    while (next === currentTaglineIndex) {
      next = Math.floor(Math.random() * TAGLINES.length);
    }
    setCurrentTaglineIndex(next);
    localStorage.setItem(TAGLINE_INDEX_KEY, String(next));
    localStorage.setItem(TAGLINE_LAST_CHANGE_KEY, Date.now().toString());
  }, [currentTaglineIndex]);

  const handleUserChange = useCallback((value: string) => {
    const nextUser = userOptions.find((u) => u.id === value);
    if (!nextUser) return;
    const profile = {
      id: nextUser.id,
      name: nextUser.name,
      role: nextUser.role,
    };
    setSelectedUser(profile);
    setActiveUserProfile(profile);
  }, [userOptions]);

  const isAdminOrHrUser =
    (selectedUser.role ?? "").toLowerCase() === "admin" ||
    (selectedUser.role ?? "").toLowerCase() === "hr";
  const isFinanceManagerUser = (selectedUser.role ?? "")
    .toLowerCase()
    .includes("finance");

  const handleAdminNavigate = useCallback(
    (e: { preventDefault: () => void }) => {
      if (isAdminOrHrUser) return;
      e.preventDefault();
      alert(
        "Зөвхөн admin эсвэл hr role-тэй хэрэглэгч Admin хэсэг рүү орж чадна."
      );
    },
    [isAdminOrHrUser]
  );

  const handleFinanceNavigate = useCallback(
    (e: { preventDefault: () => void }) => {
      if (isFinanceManagerUser) return;
      e.preventDefault();
      alert(
        "Зөвхөн finance role-тэй хэрэглэгч Finance хэсэг рүү орж чадна."
      );
    },
    [isFinanceManagerUser]
  );

  const handleMarkAllNotificationsRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, unread: false }))
      );
    } catch {
      // Keep UI unchanged on error
    }
  }, []);

  return {
    menuOpen,
    setMenuOpen,
    notificationOpen,
    setNotificationOpen,
    profileOpen,
    setProfileOpen,
    userDropdownOpen,
    setUserDropdownOpen,
    userDropdownRef,
    currentTaglineIndex,
    handleRandomTagline,
    me,
    selectedUser,
    userOptions,
    notifications,
    notificationRef,
    profileRef,
    handleUserChange,
    isAdminOrHrUser,
    isFinanceManagerUser,
    handleAdminNavigate,
    handleFinanceNavigate,
    handleMarkAllNotificationsRead,
  };
}
