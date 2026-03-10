"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import {
  HiOutlineUserCircle,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineBuildingOffice2,
  HiOutlineCalendar,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

type TabKey = "personal" | "performance" | "security";

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "personal", label: "Personal Information" },
    { key: "performance", label: "Performance & Benefits" },
    { key: "security", label: "Security" },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] w-full">
      <Header />
      <div className="w-full bg-[#0F172A] px-6 py-6">
        <div className="max-w-[921px] mx-auto">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your account information and settings
          </p>

          {/* Profile Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
            <div className="h-16 w-16 rounded-full bg-blue-600 text-white text-xl font-semibold flex items-center justify-center flex-shrink-0">
              JD
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-white">John Doe</h2>
              <p className="text-slate-400 text-sm">Senior Software Engineer</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-slate-700/80 text-slate-200 text-xs">
                  Engineering
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-700/80 text-slate-200 text-xs">
                  Full-time
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-700/80 text-slate-200 text-xs">
                  EMP-2024-1234
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-8 border-b border-slate-700/60">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-3 text-sm font-medium transition ${
                  activeTab === key
                    ? "text-blue-400 border-b-2 border-blue-400 -mb-px"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "personal" && (
            <div className="mt-6 space-y-6">
              {/* Personal Details */}
              <section className="bg-[#1A2333] border border-[#243041] rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Personal Details
                    </h3>
                    <p className="text-slate-400 text-sm mt-0.5">
                      View and manage your personal information
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition">
                    <HiOutlinePencilSquare className="text-base" />
                    Edit Profile
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineUserCircle className="text-slate-400 text-lg" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Full Name</p>
                      <p className="text-white text-sm font-medium mt-0.5">
                        John Doe
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlinePhone className="text-slate-400 text-lg" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Phone Number</p>
                      <p className="text-white text-sm font-medium mt-0.5">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineEnvelope className="text-slate-400 text-lg" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Email Address</p>
                      <p className="text-white text-sm font-medium mt-0.5">
                        john.doe@company.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineUserCircle className="text-slate-400 text-lg" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Employee ID</p>
                      <p className="text-white text-sm font-medium mt-0.5">
                        EMP-2024-1234
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Employment Information */}
              <section className="bg-[#1A2333] border border-[#243041] rounded-xl p-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Employment Information
                  </h3>
                  <p className="text-slate-400 text-sm mt-0.5">
                    Your company and position details
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineBuildingOffice2 className="text-slate-400 text-lg" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Department</p>
                      <p className="text-white text-sm font-medium mt-0.5">
                        Engineering
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineCalendar className="text-slate-400 text-lg" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Start Date</p>
                      <p className="text-white text-sm font-medium mt-0.5">
                        —
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineUserCircle className="text-slate-400 text-lg" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Manager</p>
                      <p className="text-white text-sm font-medium mt-0.5">
                        Sarah Johnson
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineBuildingOffice2 className="text-slate-400 text-lg" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Position</p>
                      <p className="text-white text-sm font-medium mt-0.5">
                        Senior Software Engineer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <HiOutlineBuildingOffice2 className="text-slate-400 text-lg" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Employment Type</p>
                      <p className="text-white text-sm font-medium mt-0.5">
                        Full-time
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="mt-6 bg-[#of172a]  rounded-xl p-8 text-center w-full h-screen">
                <div className="mt-6 bg-[#1A2333] border border-[#243041] rounded-xl p-8 text-center">
              <p className="text-slate-400">Performance & Benefits content coming soon</p>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="mt-6 bg-[0f172a]  rounded-xl p-8 text-center w-full h-screen">
                  <div className="mt-6 bg-[#1A2333] border border-[#243041] rounded-xl p-8 text-center">
              <p className="text-slate-400">Security settings coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
