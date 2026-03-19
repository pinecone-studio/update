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
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/20 dark:bg-transparent sm:p-4"
        >
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <p className="pr-2 text-[11px] leading-snug text-slate-500 dark:text-white sm:text-xs">
              {card.label}
            </p>
            <span className={`h-2 w-2 shrink-0 rounded-full ${card.dot}`} />
          </div>
          <p className="text-[28px] font-semibold leading-none text-slate-900 sm:text-xl dark:text-white">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
