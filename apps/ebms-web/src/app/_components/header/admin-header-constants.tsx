import type { ReactNode } from "react";
import { HrAuditIcon } from "@/app/icons/hrAudit";
import { HrBenefitsRuleIcon } from "@/app/icons/hrBenefitsRule";
import { HrDashboardIcon } from "@/app/icons/hrDashboard";
import { HrVendorIcon } from "@/app/icons/hrVendor";
import { HrEmployeeIcon } from "@/app/icons/hrEmployee";

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <HrDashboardIcon /> },
  {
    label: "Employees",
    href: "/admin/employee-eligibility",
    icon: <HrEmployeeIcon />,
  },
  {
    label: "Contracts",
    href: "/admin/vendor-contracts",
    icon: <HrVendorIcon />,
  },
  {
    label: "Benefits & Rules",
    href: "/admin/add-benefit",
    icon: <HrBenefitsRuleIcon />,
  },
  { label: "Audit Log", href: "/admin/audit-log", icon: <HrAuditIcon /> },
];

export const STORAGE_KEY = "ebms_admin_notifications";

export type AdminNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: "info" | "success" | "neutral";
  unread: boolean;
  subtitle?: string;
  actions?: ("review" | "view")[];
};

export const DEFAULT_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "1",
    title: "New vendor contract uploaded",
    body: "Vendor contract for Q2 2026 has been uploaded and is ready for review.",
    time: "1h ago",
    tone: "info",
    unread: true,
    subtitle: "Q2 2026 — Vendor contract",
    actions: ["review"],
  },
  {
    id: "2",
    title: "Eligibility review required",
    body: "5 employees reached 1 year tenure and require benefit eligibility review.",
    time: "3h ago",
    tone: "success",
    unread: true,
    subtitle: "5 employees — Benefit eligibility",
    actions: ["review"],
  },
  {
    id: "3",
    title: "Audit log export ready",
    body: "Your audit log export is ready to download.",
    time: "1d ago",
    tone: "neutral",
    unread: false,
    subtitle: "Export ready",
    actions: ["view"],
  },
];
