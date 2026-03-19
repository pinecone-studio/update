"use client";

type NotificationStatsCardsProps = {
  unreadCount: number;
  todayCount: number;
  totalCount: number;
};

export function NotificationStatsCards({
  unreadCount,
  todayCount,
  totalCount,
}: NotificationStatsCardsProps) {
  const cards = [
    { label: "Unread", value: unreadCount, dot: "bg-blue-500" },
    { label: "Today's Notifications", value: todayCount, dot: "bg-amber-500" },
    { label: "Total Notifications", value: totalCount, dot: "bg-emerald-500" },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-slate-200 p-4 shadow-sm dark:border-white/20"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-white">
              {card.label}
            </p>
            <span className={`h-2 w-2 rounded-full ${card.dot}`} />
          </div>
          <p className="text-lg font-semibold text-slate-900 sm:text-xl dark:text-white">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
