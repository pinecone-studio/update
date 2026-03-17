/** @format */

"use client";

import {
  HiOutlineBuildingOffice2,
  HiOutlineCalendar,
  HiOutlineEnvelope,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlineUserCircle,
} from "react-icons/hi2";

export type TabKey = "personal" | "performance" | "security";

type EmployeeProfile = {
  id: string;
  name: string;
  role: string;
  employmentStatus: string;
};

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="text-slate-900 text-sm font-medium mt-0.5 dark:text-white">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export function MyProfileHeader({
  me,
  error,
  initials,
}: {
  me: EmployeeProfile | null;
  error: string | null;
  initials: string;
}) {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
      <p className="text-slate-600 text-sm mt-1 dark:text-slate-400">
        Manage your account information and settings
      </p>
      {error ? <p className="mt-2 text-sm text-red-400">Error: {error}</p> : null}

      <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="h-16 w-16 rounded-full bg-blue-600 text-white text-xl font-semibold flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {me?.name ?? "—"}
          </h2>
          <p className="text-slate-600 text-sm dark:text-slate-400">{me?.role ?? "—"}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs dark:bg-slate-700/80 dark:text-slate-200">
              {me?.role ?? "—"}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs dark:bg-slate-700/80 dark:text-slate-200">
              {me?.employmentStatus ? me.employmentStatus.replace(/_/g, " ") : "—"}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs dark:bg-slate-700/80 dark:text-slate-200">
              {me?.id ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function MyProfileTabs({
  activeTab,
  onChange,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "personal", label: "Personal Information" },
    { key: "performance", label: "Performance & Benefits" },
    { key: "security", label: "Security" },
  ];

  return (
    <div className="flex gap-1 mt-8 border-b border-slate-200 dark:border-slate-700/60">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-3 text-sm font-medium transition ${
            activeTab === key
              ? "text-blue-600 border-b-2 border-blue-600 -mb-px dark:text-blue-400 dark:border-blue-400"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function PersonalInfoTab({ me }: { me: EmployeeProfile | null }) {
  return (
    <div className="mt-6 space-y-6">
      <section className="bg-white border border-slate-200 rounded-xl p-6 dark:bg-[#1A2333] dark:border-[#243041]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Personal Details
            </h3>
            <p className="text-slate-600 text-sm mt-0.5 dark:text-slate-400">
              View and manage your personal information
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium transition dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200">
            <HiOutlinePencilSquare className="text-base" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <InfoItem
            icon={<HiOutlineUserCircle className="text-slate-600 text-lg dark:text-slate-400" />}
            label="Full Name"
            value={me?.name ?? "—"}
          />
          <InfoItem
            icon={<HiOutlinePhone className="text-slate-600 text-lg dark:text-slate-400" />}
            label="Phone Number"
            value="—"
          />
          <InfoItem
            icon={<HiOutlineEnvelope className="text-slate-600 text-lg dark:text-slate-400" />}
            label="Email Address"
            value="—"
          />
          <InfoItem
            icon={<HiOutlineUserCircle className="text-slate-600 text-lg dark:text-slate-400" />}
            label="Employee ID"
            value={me?.id ?? "—"}
          />
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-6 dark:bg-[#1A2333] dark:border-[#243041]">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Employment Information
        </h3>
        <p className="text-slate-600 text-sm mt-0.5 dark:text-slate-400">
          Your company and position details
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <InfoItem
            icon={<HiOutlineBuildingOffice2 className="text-slate-600 text-lg dark:text-slate-400" />}
            label="Department"
            value="—"
          />
          <InfoItem
            icon={<HiOutlineCalendar className="text-slate-600 text-lg dark:text-slate-400" />}
            label="Start Date"
            value="—"
          />
          <InfoItem
            icon={<HiOutlineUserCircle className="text-slate-600 text-lg dark:text-slate-400" />}
            label="Manager"
            value="—"
          />
          <InfoItem
            icon={<HiOutlineBuildingOffice2 className="text-slate-600 text-lg dark:text-slate-400" />}
            label="Position"
            value={me?.role ?? "—"}
          />
          <InfoItem
            icon={<HiOutlineBuildingOffice2 className="text-slate-600 text-lg dark:text-slate-400" />}
            label="Employment Type"
            value={me?.employmentStatus ? me.employmentStatus.replace(/_/g, " ") : "—"}
          />
        </div>
      </section>
    </div>
  );
}

export function PlaceholderTab({ text }: { text: string }) {
  return (
    <div className="mt-6 bg-slate-100 rounded-xl p-8 text-center w-full min-h-[200px] dark:bg-[#0f172a]">
      <div className="mt-6 bg-white border border-slate-200 rounded-xl p-8 text-center dark:bg-[#1A2333] dark:border-[#243041]">
        <p className="text-slate-600 dark:text-slate-400">{text}</p>
      </div>
    </div>
  );
}
