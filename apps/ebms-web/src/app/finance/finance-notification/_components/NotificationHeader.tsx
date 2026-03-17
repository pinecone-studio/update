"use client";

export function NotificationHeader() {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Finance Notifications
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Review benefit payments and reimbursement requests
        </p>
      </div>
    </header>
  );
}
