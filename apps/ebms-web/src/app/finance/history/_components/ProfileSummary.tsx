"use client";

type ProfileData = {
  id: string;
  name: string;
  role: string;
  employmentStatus: string;
};

type ProfileSummaryProps = {
  me: ProfileData | null;
  initials: string;
  loading: boolean;
};

export function ProfileSummary({ me, initials, loading }: ProfileSummaryProps) {
  return (
    <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white">
        {loading ? "…" : initials}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-black">
          Finance Manager
        </h2>
        <p className="text-sm text-slate-600">
          Finance Manager
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-black">
            finance
          </span>
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-black">
            {me?.employmentStatus
              ? me.employmentStatus.replace(/_/g, " ")
              : "—"}
          </span>
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-black">
            finance
          </span>
        </div>
      </div>
    </div>
  );
}
