"use client";

export type EmployeeTabKey = "all" | "eligibility" | "request" | "warning";

type NotificationFiltersProps = {
  activeTab: EmployeeTabKey;
  onTabChange: (tab: EmployeeTabKey) => void;
  unreadOnly: boolean;
  onUnreadToggle: () => void;
};

export function NotificationFilters({
  activeTab,
  onTabChange,
  unreadOnly,
  onUnreadToggle,
}: NotificationFiltersProps) {
  const tabs: { key: EmployeeTabKey | "unread"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "eligibility", label: "Eligibility" },
    { key: "request", label: "Requests" },
    { key: "warning", label: "Warnings" },
    { key: "unread", label: "Unread Only" },
  ];

  const btnClass = (active: boolean) =>
    active
      ? "border-slate-900 text-white/50 dark:border-white  dark:text-white/50"
      : "border-slate-200  text-slate-700  dark:border-[#243041]  dark:text-slate-200 ";

  return (
    <section className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
      {tabs.map((tab) => {
        const isActive =
          tab.key === "unread" ? unreadOnly : activeTab === tab.key;
        const onClick =
          tab.key === "unread"
            ? onUnreadToggle
            : () => onTabChange(tab.key as EmployeeTabKey);
        return (
          <button
            key={tab.key}
            onClick={onClick}
            className={`rounded-full border px-3 py-1.5 transition ${btnClass(isActive)}`}
          >
            {tab.label}
          </button>
        );
      })}
    </section>
  );
}
