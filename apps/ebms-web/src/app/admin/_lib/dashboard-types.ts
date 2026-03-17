import type { ReactNode } from "react";

export type BenefitRequest = {
  id: string;
  employeeId: string;
  benefitId: string;
  status: string;
  createdAt: string;
  employeeName?: string | null;
  benefitName?: string | null;
  rejectReason?: string | null;
  requiresContract: boolean;
  contractAcceptedAt?: string | null;
  contractTemplateUrl?: string | null;
};

export type EmployeeSearchItem = {
  id: string;
  name: string;
  department: string;
};

export type StatCard = {
  key: "employees" | "benefits";
  title: string;
  value: string;
  icon: ReactNode;
  toneClass: string;
};
