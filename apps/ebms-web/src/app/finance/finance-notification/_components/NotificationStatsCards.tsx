"use client";

type NotificationStatsCardsProps = {
  pendingPayments: number;
  reimbursementCount: number;
  todayCount: number;
  totalCount: number;
};

export function NotificationStatsCards({
  pendingPayments,
  reimbursementCount,
  todayCount,
  totalCount,
}: NotificationStatsCardsProps) {
  const cards = [
    { label: "Pending Payments", value: pendingPayments, dot: "bg-blue-500" },
    {
      label: "Reimbursement Requests",
      value: reimbursementCount,
      dot: "bg-purple-500",
    },
    { label: "Today's Notifications", value: todayCount, dot: "bg-amber-500" },
    { label: "Total Notifications", value: totalCount, dot: "bg-emerald-500" },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/20 dark:bg-transparent sm:p-4"
        >
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <p className="pr-2 text-[11px] leading-snug text-slate-500 dark:text-white sm:text-xs">
              {card.label}
            </p>
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${card.dot}`}
            />
          </div>
          <p className="text-[28px] font-semibold leading-none text-slate-900 dark:text-white sm:text-xl">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
