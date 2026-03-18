/** @format */

import { TAGLINES } from "./constants";

export const STORAGE_KEY = "ebms_employee_notifications";
export const TAGLINE_INDEX_KEY = "ebms_employee_tagline_index";
export const TAGLINE_LAST_CHANGE_KEY = "ebms_employee_tagline_last_change";
export const TAGLINE_CHANGE_MS = 24 * 60 * 60 * 1000;
export { TAGLINES };

export type EmployeeNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: "success" | "info" | "warning";
  unread: boolean;
  subtitle?: string;
  actions?: ("view" | "request")[];
};

export const DEFAULT_NOTIFICATIONS: EmployeeNotification[] = [
  {
    id: "1",
    title: "You're now eligible for Education Allowance!",
    body: "Congratulations! You've reached 1 year tenure with an OKR score of 82%.",
    time: "2h ago",
    tone: "success",
    unread: true,
    subtitle: "1 year tenure — OKR 82%",
    actions: ["request"],
  },
  {
    id: "2",
    title: "OKR score updated",
    body: "Your Q1 2026 OKR score has been updated to 82%.",
    time: "5h ago",
    tone: "info",
    unread: true,
    subtitle: "Q1 2026 — 82%",
    actions: ["view"],
  },
  {
    id: "3",
    title: "Transit pass request approved",
    body: "Your Transit Pass benefit request has been approved.",
    time: "1d ago",
    tone: "success",
    unread: false,
    subtitle: "Transit pass — Approved",
  },
];
