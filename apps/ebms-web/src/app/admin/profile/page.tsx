"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineUserCircle,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineBuildingOffice2,
  HiOutlineCalendar,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import { fetchMe, getApiErrorMessage } from "../../employee/_lib/api";

type TabKey = "personal" | "performance" | "security";

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [me, setMe] = useState<{
    id: string;
    name: string;
    role: string;
    employmentStatus: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMe();
        if (!cancelled) {
          setMe({
            id: data.id,
            name: data.name,
            role: data.role,
            employmentStatus: data.employmentStatus ?? "",
          });
        }
      } catch (e) {
        if (!cancelled) setError(getApiErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "personal", label: "Personal Information" },
    { key: "performance", label: "Performance & Benefits" },
    { key: "security", label: "Security" },
  ];

  const initials =
    me?.name
      ?.split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "—";

  return (
    <div className="min-h-screen">
      <div className="w-full bg-slate-50 px-6 py-6 dark:bg-transparent">
        <div className="max-w-[1500px] mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-slate-600 text-sm mt-1 dark:text-slate-400">
            Manage your account information and settings
          </p>
          {error && <p className="mt-2 text-sm text-red-400">Error: {error}</p>}

          {/* Profile Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
            <div className="h-16 w-16 rounded-full bg-blue-600 text-white text-xl font-semibold flex items-center justify-center flex-shrink-0">
              {loading ? "…" : initials}
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {loading ? "Loading..." : (me?.name ?? "—")}
              </h2>
              <p className="text-slate-600 text-sm dark:text-slate-400">
                {loading ? "…" : (me?.role ?? "—")}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs dark:bg-slate-700/80 dark:text-slate-200">
                  {me?.role ?? "—"}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs dark:bg-slate-700/80 dark:text-slate-200">
                  {me?.employmentStatus
                    ? me.employmentStatus.replace(/_/g, " ")
                    : "—"}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs dark:bg-slate-700/80 dark:text-slate-200">
                  {me?.id ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 border-b border-slate-200 dark:border-slate-700/60">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
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

          {/* Tab Content */}
          {activeTab === "personal" && (
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
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
                      <HiOutlineUserCircle className="text-slate-600 text-lg dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs dark:text-slate-500">
                        Full Name
                      </p>
                      <p className="text-slate-900 text-sm font-medium mt-0.5 dark:text-white">
                        {me?.name ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
                      <HiOutlinePhone className="text-slate-600 text-lg dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Phone Number</p>
                      <p className="text-slate-900 text-sm font-medium mt-0.5 dark:text-white">
                        —
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
                      <HiOutlineEnvelope className="text-slate-600 text-lg dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Email Address</p>
                      <p className="text-slate-900 text-sm font-medium mt-0.5 dark:text-white">
                        —
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
                      <HiOutlineUserCircle className="text-slate-600 text-lg dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Employee ID</p>
                      <p className="text-slate-900 text-sm font-medium mt-0.5 dark:text-white">
                        {me?.id ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white border border-slate-200 rounded-xl p-6 dark:bg-[#1A2333] dark:border-[#243041]">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Employment Information
                  </h3>
                  <p className="text-slate-600 text-sm mt-0.5 dark:text-slate-400">
                    Your company and position details
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
                      <HiOutlineBuildingOffice2 className="text-slate-600 text-lg dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Department</p>
                      <p className="text-slate-900 text-sm font-medium mt-0.5 dark:text-white">
                        —
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
                      <HiOutlineCalendar className="text-slate-600 text-lg dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Start Date</p>
                      <p className="text-slate-900 text-sm font-medium mt-0.5 dark:text-white">
                        —
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
                      <HiOutlineUserCircle className="text-slate-600 text-lg dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Manager</p>
                      <p className="text-slate-900 text-sm font-medium mt-0.5 dark:text-white">
                        —
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
                      <HiOutlineBuildingOffice2 className="text-slate-600 text-lg dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Position</p>
                      <p className="text-slate-900 text-sm font-medium mt-0.5 dark:text-white">
                        {me?.role ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
                      <HiOutlineBuildingOffice2 className="text-slate-600 text-lg dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Employment Type</p>
                      <p className="text-slate-900 text-sm font-medium mt-0.5 dark:text-white">
                        {me?.employmentStatus
                          ? me.employmentStatus.replace(/_/g, " ")
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="mt-6 bg-slate-100 rounded-xl p-8 text-center w-full min-h-[200px] dark:bg-[#0f172a]">
              <div className="mt-6 bg-white border border-slate-200 rounded-xl p-8 text-center dark:bg-[#1A2333] dark:border-[#243041]">
                <p className="text-slate-600 dark:text-slate-400">
                  Performance & Benefits content coming soon
                </p>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="mt-6 bg-slate-100 rounded-xl p-8 text-center w-full min-h-[200px] dark:bg-[#0f172a]">
              <div className="mt-6 bg-white border border-slate-200 rounded-xl p-8 text-center dark:bg-[#1A2333] dark:border-[#243041]">
                <p className="text-slate-600 dark:text-slate-400">
                  Security settings coming soon
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
