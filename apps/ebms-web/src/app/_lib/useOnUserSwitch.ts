"use client";

import { useEffect } from "react";
import { USER_SWITCHED_EVENT } from "./activeUser";

/**
 * Calls the given callback whenever the active user is switched.
 * Use this in data-fetching hooks to refetch when user changes.
 */
export function useOnUserSwitch(callback: () => void): void {
  useEffect(() => {
    const handler = () => callback();
    window.addEventListener(USER_SWITCHED_EVENT, handler);
    return () => window.removeEventListener(USER_SWITCHED_EVENT, handler);
  }, [callback]);
}
