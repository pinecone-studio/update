"use client";

import { useEffect, useState } from "react";
import { useOnUserSwitch } from "@/app/_lib/useOnUserSwitch";
import { ProfileSkeleton } from "@/app/_components/ProfileSkeleton";
import { fetchMe, getApiErrorMessage } from "../_lib/api";
import {
  BenefitHistorySection,
  MyProfileHeader,
} from "../components/MyProfileSections";

export default function MyProfilePage() {
  const [me, setMe] = useState<{
    id: string;
    name: string;
    role: string;
    employmentStatus: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useOnUserSwitch(() => setRefreshKey((k) => k + 1));

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
  }, [refreshKey]);

  const initials =
    me?.name
      ?.split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "—";

  if (loading) {
    return (
      <div className="min-h-screen w-full dark:bg-[#0B1220]">
        <div className="w-full px-6 py-6 dark:bg-transparent">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full px-6 py-6 dark:bg-transparent">
        <div className="max-w-[1500px] mx-auto">
          <MyProfileHeader me={me} error={error} initials={initials} />

          <div className="mt-8">
            <BenefitHistorySection />
          </div>
        </div>
      </div>
    </div>
  );
}
