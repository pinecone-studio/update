"use client";

export type TabKey = "personal" | "performance" | "security";

const TABS: { key: TabKey; label: string }[] = [
  { key: "personal", label: "Personal Information" },
  { key: "performance", label: "Performance & Benefits" },
  { key: "security", label: "Security" },
];

type ProfileTabsProps = {
  activeTab: TabKey;
  onTabChange: (key: TabKey) => void;
};

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="mt-8 flex gap-1 border-b border-slate-200 dark:border-slate-700/60">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`px-4 py-3 text-sm font-medium transition ${
            activeTab === key
              ? "-mb-px border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
