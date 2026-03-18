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

export const DEFAULT_NOTIFICATIONS = [
  {
    id: "1",
    title: "New Vendor Contract Uploaded",
    body: "Vendor contract for Q2 2026 has been uploaded and is ready for review.",
    time: "1 hour ago",
    tone: "info" as const,
    unread: true,
  },
  {
    id: "2",
    title: "Eligibility Review Required",
    body: "5 employees reached 1 year tenure and require benefit eligibility review.",
    time: "3 hours ago",
    tone: "success" as const,
    unread: true,
  },
  {
    id: "3",
    title: "Audit Log Export Ready",
    body: "Your audit log export is ready to download.",
    time: "1 day ago",
    tone: "neutral" as const,
    unread: false,
  },
];

export type AdminNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: "info" | "success" | "warning" | "neutral";
  unread: boolean;
};
