import { GraphQLClient, gql } from "graphql-request";

export type ActiveUserProfile = {
  id: string;
  name?: string;
  role?: string;
};

export type SwitchUserOption = {
  id: string;
  name: string;
  role: string;
};

export const ACTIVE_USER_STORAGE_KEY = "ebms_selected_user_profile";
const LEGACY_USER_ID_STORAGE_KEY = "ebms_selected_user";
const DEFAULT_API_BASE_URL = "http://localhost:8787";

export const FALLBACK_USER_OPTIONS: SwitchUserOption[] = [
  { id: "emp-1", name: "Employee One", role: "admin" },
  { id: "angarag-1", name: "Angarag", role: "employee" },
  { id: "zundui-1", name: "Zundui", role: "ux-engineer" },
  { id: "ogoo-1", name: "Ogoo", role: "admin" },
  { id: "soroo-1", name: "Soroo", role: "manager" },
  { id: "uganasa-1", name: "Uganasa", role: "employee" },
  { id: "ganaa-1", name: "Gantushig", role: "finance-manager" },
];

export function getInitialUserProfile(): ActiveUserProfile {
  return {
    id: process.env.NEXT_PUBLIC_EMPLOYEE_ID || "emp-1",
    role: (process.env.NEXT_PUBLIC_ROLE || "employee").toLowerCase(),
  };
}

export function getCurrentUserOptionFallback(): SwitchUserOption {
  // Keep initial render deterministic between SSR and hydration.
  const current =
    typeof window === "undefined"
      ? getInitialUserProfile()
      : getActiveUserProfile();
  return {
    id: current.id,
    name: current.name || current.id,
    role: (current.role || "employee").toLowerCase(),
  };
}

function readStoredProfile(): ActiveUserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ActiveUserProfile;
    if (!parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

function readLegacyId(): string | null {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(LEGACY_USER_ID_STORAGE_KEY);
  return id?.trim() ? id : null;
}

export function getActiveUserProfile(): ActiveUserProfile {
  const stored = readStoredProfile();
  if (stored) return stored;
  const legacyId = readLegacyId();
  if (legacyId) return { id: legacyId, role: "employee" };
  return getInitialUserProfile();
}

export function setActiveUserProfile(profile: ActiveUserProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(profile));
  window.localStorage.setItem(LEGACY_USER_ID_STORAGE_KEY, profile.id);
}

export function getActiveUserHeaders(
  defaultRole = "employee",
): Record<string, string> {
  const profile = getActiveUserProfile();
  const role = defaultRole.toLowerCase().trim() || "employee";
  return {
    "x-employee-id": profile.id,
    // Use section role consistently (admin/finance/employee) so user switch only changes actor id.
    "x-role": role,
  };
}

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;
  const base = raw.replace(/\/graphql\/?$/, "").trim();
  return base || DEFAULT_API_BASE_URL;
}

const USER_OPTIONS_QUERY = gql`
  query UserOptions {
    userOptions {
      id
      name
      role
    }
  }
`;

export async function fetchSwitchUserOptions(): Promise<SwitchUserOption[]> {
  try {
    const base = getApiBaseUrl();
    const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
    const client = new GraphQLClient(url, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await client.request<{
      userOptions?: Array<{
        id: string;
        name?: string | null;
        role?: string | null;
      }>;
    }>(USER_OPTIONS_QUERY);
    const users = (data.userOptions ?? [])
      .filter((u) => !!u.id)
      .map((u) => ({
        id: u.id,
        name: u.name || u.id,
        role: (u.role || "employee").toLowerCase(),
      }));
    return users.length > 0 ? users : [getCurrentUserOptionFallback()];
  } catch {
    return [getCurrentUserOptionFallback()];
  }
}

export async function ensureValidActiveUserProfile(): Promise<ActiveUserProfile> {
  const current = getActiveUserProfile();
  const options = await fetchSwitchUserOptions();
  if (options.some((u) => u.id === current.id)) {
    return current;
  }
  const first = options[0];
  if (!first) return current;
  const next: ActiveUserProfile = {
    id: first.id,
    name: first.name,
    role: first.role,
  };
  setActiveUserProfile(next);
  return next;
}
