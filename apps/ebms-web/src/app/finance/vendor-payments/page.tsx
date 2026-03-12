const vendorPayments = [
  { vendor: "PineFit Gym", benefit: "Gym Membership", amount: "$1,200", status: "Pending" as const },
  { vendor: "BlueCross", benefit: "Insurance", amount: "$850", status: "Paid" as const },
  { vendor: "Apple", benefit: "MacBook Subsidy", amount: "$900", status: "Pending" as const },
];

const recentPayments = [
  { vendor: "PineFit Gym", amount: "$1,200", status: "Paid" as const },
  { vendor: "BlueCross", amount: "$850", status: "Paid" as const },
];

export default function VendorPaymentsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-5 font-semibold text-slate-900 dark:text-white">Vendor Payments</h1>
        <p className="mt-2 text-5 text-slate-600 dark:text-slate-400">
          Manage payments to benefit providers and vendors
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#1E3258] dark:bg-[#0D1B3A]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3A2A16] text-5 text-[#FF9D33]">
            $
          </div>
          <p className="text-5 text-slate-600 dark:text-slate-300">Total Pending Payments</p>
        </div>
        <p className="mt-3 text-5 font-bold text-slate-900 dark:text-white">$3,450</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#1E3258] dark:bg-[#0D1B3A]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-[#1E3258] dark:text-[#A7B6D3]">
              <tr>
                <th className="px-6 py-5 font-medium">Vendor</th>
                <th className="px-6 py-5 font-medium">Benefit</th>
                <th className="px-6 py-5 font-medium">Amount</th>
                <th className="px-6 py-5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {vendorPayments.map((item) => (
                <tr key={`${item.vendor}-${item.benefit}`} className="border-b border-slate-200 last:border-b-0 dark:border-[#182A4A]">
                  <td className="px-6 py-6 font-semibold text-slate-900 dark:text-white">{item.vendor}</td>
                  <td className="px-6 py-6 text-slate-600 dark:text-slate-300">{item.benefit}</td>
                  <td className="px-6 py-6 font-semibold text-slate-900 dark:text-white">{item.amount}</td>
                  <td className="px-6 py-6">
                    <span
                      className={`inline-flex items-center rounded-xl border px-4 py-2 text-5 ${
                        item.status === "Paid"
                          ? "border-[#0E6B4F] bg-[#15342B] text-[#00E08B]"
                          : "border-[#7D4B21] bg-[#3A2A16] text-[#FF9D33]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#1E3258] dark:bg-[#0D1B3A]">
        <h2 className="text-5 font-semibold text-slate-900 dark:text-white">Recent Vendor Payments</h2>
        <div className="mt-5 space-y-4">
          {recentPayments.map((item) => (
            <div
              key={`${item.vendor}-${item.amount}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-[#1E3258] dark:bg-[#07132B]"
            >
              <p className="text-5 text-slate-700 dark:text-slate-200">{item.vendor}</p>
              <div className="flex items-center gap-4">
                <p className="text-5 font-semibold text-slate-900 dark:text-white">{item.amount}</p>
                <span className="inline-flex items-center rounded-xl border border-[#0E6B4F] bg-[#15342B] px-4 py-2 text-5 text-[#00E08B]">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
