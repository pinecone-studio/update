"use client";

import {
  HiOutlineBuildingOffice2,
  HiOutlineCalendar,
  HiOutlineUserCircle,
} from "react-icons/hi2";

type EmploymentInfoSectionProps = {
  role: string;
  employmentStatus: string;
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
        <Icon className="text-lg text-slate-600 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export function EmploymentInfoSection({
  role,
  employmentStatus,
}: EmploymentInfoSectionProps) {
  const employmentType = employmentStatus
    ? employmentStatus.replace(/_/g, " ")
    : "—";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#243041] dark:bg-[#1A2333]">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Employment Information
        </h3>
        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
          Your company and position details
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <DetailRow icon={HiOutlineBuildingOffice2} label="Department" value="—" />
        <DetailRow icon={HiOutlineCalendar} label="Start Date" value="—" />
        <DetailRow icon={HiOutlineUserCircle} label="Manager" value="—" />
        <DetailRow icon={HiOutlineBuildingOffice2} label="Position" value={role} />
        <DetailRow
          icon={HiOutlineBuildingOffice2}
          label="Employment Type"
          value={employmentType}
        />
      </div>
    </section>
  );
}
