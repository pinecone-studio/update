/** @format */

"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY_PREFIX = "ebms-cached-count";

function getCachedCount(key: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}-${key}`);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
}

function setCachedCount(key: string, count: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${STORAGE_KEY_PREFIX}-${key}`, String(count));
  } catch {
    // ignore
  }
}

/**
 * Returns a cached count for skeleton loaders. Call updateCount when data loads
 * to persist for the next visit. Use for benefitCount, requestRowCount, etc.
 * Uses defaultCount on initial render (server + first client render) to avoid
 * hydration mismatch, then syncs from sessionStorage after mount.
 */
export function useCachedCount(
  key: string,
  options?: { defaultCount?: number }
): [number, (count: number) => void] {
  const defaultCount = options?.defaultCount ?? 3;
  const [displayCount, setDisplayCount] = useState<number>(defaultCount);

  useEffect(() => {
    const stored = getCachedCount(key);
    if (stored != null) setDisplayCount(stored);
  }, [key]);

  const updateCount = useCallback(
    (count: number) => {
      setCachedCount(key, count);
      setDisplayCount(count);
    },
    [key]
  );

  return [displayCount, updateCount];
}
