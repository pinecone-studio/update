/** @format */

"use client";

export type AdminTabKey =
	| "all"
	| "requests"
	| "documents"
	| "eligibility"
	| "warnings"
	| "system";

type NotificationFiltersProps = {
	activeTab: AdminTabKey;
	onTabChange: (tab: AdminTabKey) => void;
	unreadOnly: boolean;
	onUnreadToggle: () => void;
};

export function NotificationFilters({
	activeTab,
	onTabChange,
	unreadOnly,
	onUnreadToggle,
}: NotificationFiltersProps) {
	const tabs: { key: AdminTabKey | "unread"; label: string }[] = [
		{ key: "all", label: "All" },
		{ key: "requests", label: "Requests" },
		{ key: "documents", label: "Documents" },
		{ key: "eligibility", label: "Eligibility" },
		{ key: "warnings", label: "Warnings" },
		{ key: "system", label: "System" },
		{ key: "unread", label: "Unread Only" },
	];

	const btnClass = (active: boolean) =>
		active
			? "border-slate-800 bg-slate-800 text-white dark:border-white dark:bg-white/20 dark:text-white"
			: "border-slate-200 text-slate-700 dark:border-white/20 dark:text-slate-200";

	return (
		<section className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
			{tabs.map((tab) => {
				const isActive =
					tab.key === "unread" ? unreadOnly : activeTab === tab.key;
				const onClick =
					tab.key === "unread"
						? onUnreadToggle
						: () => onTabChange(tab.key as AdminTabKey);
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
