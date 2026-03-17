/** @format */
"use client";

import { useEffect, useState } from "react";
import { ProfileSkeleton } from "@/app/_components/ProfileSkeleton";
import { fetchMe, getApiErrorMessage } from "../../employee/_lib/api";
import { ProfileHeader } from "./_components/ProfileHeader";
import { ProfileSummary } from "./_components/ProfileSummary";
import {
  ProfileTabs,
  type TabKey,
} from "./_components/ProfileTabs";
import { PersonalDetailsSection } from "./_components/PersonalDetailsSection";
import { EmploymentInfoSection } from "./_components/EmploymentInfoSection";
import { ProfileTabPlaceholder } from "./_components/ProfileTabPlaceholder";

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

  const initials =
    me?.name
      ?.split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "—";

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0B1220]">
        <div className="w-full px-6 py-6 dark:bg-[#0F172A]">
          <ProfileSkeleton variant="admin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full bg-slate-50 px-6 py-6 dark:bg-transparent">
        <div className="mx-auto max-w-[1500px]">
          <ProfileHeader error={error} />
          <ProfileSummary me={me} initials={initials} />
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "personal" && me && (
            <div className="mt-6 space-y-6">
              <PersonalDetailsSection name={me.name} id={me.id} />
              <EmploymentInfoSection
                role={me.role}
                employmentStatus={me.employmentStatus}
              />
            </div>
          )}

          {activeTab === "performance" && (
            <ProfileTabPlaceholder message="Performance & Benefits content coming soon" />
          )}

          {activeTab === "security" && (
            <ProfileTabPlaceholder message="Security settings coming soon" />
          )}
        </div>
      </div>
    </div>
  );
}
