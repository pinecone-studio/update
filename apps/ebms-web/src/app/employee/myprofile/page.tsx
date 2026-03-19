"use client";

import { useEffect, useState } from "react";
import { ProfileSkeleton } from "@/app/_components/ProfileSkeleton";
import { fetchMe, getApiErrorMessage } from "../_lib/api";
import {
  MyProfileHeader,
  BenefitHistorySection,
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
      <div className="min-h-screen bg-slate-50 w-full dark:bg-[#0B1220]">
        <div className="w-full bg-slate-50 px-4 py-4 dark:bg-transparent sm:px-6 sm:py-6">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full bg-slate-50 px-4 py-4 dark:bg-transparent sm:px-6 sm:py-6">
        <div className="max-w-[1500px] mx-auto">
          <MyProfileHeader me={me} error={error} initials={initials} />

          <div className="mt-6 sm:mt-8">
            <BenefitHistorySection />
          </div>
        </div>
      </div>
    </div>
  );
}
