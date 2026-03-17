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
};

export function ProfileSummary({ me, initials }: ProfileSummaryProps) {
  return (
    <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white">
        {initials}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {me?.name ?? "—"}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {me?.role ?? "—"}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700 dark:bg-slate-700/80 dark:text-slate-200">
            {me?.role ?? "—"}
          </span>
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700 dark:bg-slate-700/80 dark:text-slate-200">
            {me?.employmentStatus
              ? me.employmentStatus.replace(/_/g, " ")
              : "—"}
          </span>
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700 dark:bg-slate-700/80 dark:text-slate-200">
            {me?.id ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
