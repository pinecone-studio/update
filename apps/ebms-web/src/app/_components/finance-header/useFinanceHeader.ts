import { useEffect, useRef, useState } from "react";
import {
  fetchSwitchUserOptions,
  getInitialUserProfile,
  getActiveUserProfile,
  setActiveUserProfile,
  type ActiveUserProfile,
  type SwitchUserOption,
} from "@/app/_lib/activeUser";
import { Taglines, TAGLINE_INDEX_KEY, TAGLINE_LAST_CHANGE_KEY, TAGLINE_CHANGE_MS, FINANCE_NOTIFICATIONS } from "./constants";

export function useFinanceHeader(pathname: string) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
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
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const normalizedPath =
    pathname?.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname ?? "";

  const unreadCount =
    normalizedPath.startsWith("/finance/finance-notification")
      ? 0
      : FINANCE_NOTIFICATIONS.filter((n) => n.unread).length;

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
        // keep fallback list when query fails
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedUser.id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRandomTagline = () => {
    if (Taglines.length <= 1) return;
    let next = currentTaglineIndex;
    while (next === currentTaglineIndex) {
      next = Math.floor(Math.random() * Taglines.length);
    }
    setCurrentTaglineIndex(next);
    localStorage.setItem(TAGLINE_INDEX_KEY, String(next));
    localStorage.setItem(TAGLINE_LAST_CHANGE_KEY, Date.now().toString());
  };

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

  const initials = (selectedUser.name || selectedUser.id || "FM")
    .split(" ")
    .map((s) => s[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
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
  };
}
