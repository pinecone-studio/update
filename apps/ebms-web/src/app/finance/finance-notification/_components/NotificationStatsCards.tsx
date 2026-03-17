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
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#243041] dark:bg-[#1A2333]"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {card.label}
            </p>
            <span
              className={`h-2 w-2 rounded-full ${card.dot}`}
            />
          </div>
          <p className="text-xl font-semibold text-slate-900 dark:text-white">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
