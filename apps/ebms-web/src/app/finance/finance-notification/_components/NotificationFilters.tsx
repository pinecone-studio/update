"use client";

type TabKey = "all" | "payments" | "reimbursements" | "completed";

type NotificationFiltersProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  unreadOnly: boolean;
  onUnreadToggle: () => void;
};

export function NotificationFilters({
  activeTab,
  onTabChange,
  unreadOnly,
  onUnreadToggle,
}: NotificationFiltersProps) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "payments", label: "Payments" },
    { key: "reimbursements", label: "Reimbursements" },
    { key: "completed", label: "Completed" },
  ];

  const btnClass = (active: boolean) =>
    active
      ? "border-slate-900 bg-slate-900 text-white dark:border-white/30 dark:bg-white/20 dark:text-white"
      : "border-slate-200 text-slate-900 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/10";

  return (
    <section className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-white/60">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`rounded-full border px-3 py-1.5 transition ${btnClass(activeTab === tab.key)}`}
        >
          {tab.label}
        </button>
      ))}
      <button
        onClick={onUnreadToggle}
        className={`rounded-full border px-3 py-1.5 transition ${btnClass(unreadOnly)}`}
      >
        Unread Only
      </button>
    </section>
  );
}
