type BenefitRow = {
  name: string;
  status: "Active" | "Eligible" | "Locked" | "Pending";
};

const benefits: BenefitRow[] = [
  { name: "Health Insurance", status: "Active" },
  { name: "401(k) Match", status: "Eligible" },
  { name: "Stock Options", status: "Locked" },
  { name: "Commuter Benefits", status: "Pending" },
];

const statusClass: Record<BenefitRow["status"], string> = {
  Active: "border-[#166534] bg-[#052E25] text-[#34D399]",
  Eligible: "border-[#1D4ED8] bg-[#122B4C] text-[#60A5FA]",
  Locked: "border-[#9F1239] bg-[#3A1026] text-[#FB7185]",
  Pending: "border-[#B45309] bg-[#3B2A12] text-[#FBBF24]",
};

export default function EmployeeEligibilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">
          Employee Eligibility Overview
        </h1>
        <p className="mt-3 text-2xl text-[#A7B6D3]">
          Search and view employee benefit eligibility with rule evaluation
        </p>
      </div>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#93A4C3]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by employee name, ID, or department..."
              className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] pl-14 pr-4 text-lg text-white outline-none placeholder:text-[#8FA3C5] focus:border-[#4B6FA8]"
            />
          </div>
          <button
            type="button"
            className="h-14 rounded-2xl  bg-[#0F172A] px-10 text-4 font-medium text-white transition hover:bg-[#3E82F7]"
          >
            Search
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-7">
        <h2 className="text-xl font-semibold text-white">Sarah Johnson</h2>
        <p className="mt-4 text-4 text-[#9FB0CF]">
          ID: EMP-2847 • Engineering • Start Date: January 15, 2023
        </p>
      </section>

      <div className="space-y-5">
        {benefits.map((benefit) => (
          <article
            key={benefit.name}
            className="flex items-center justify-between rounded-3xl border border-[#2C4264] bg-[#1E293B] px-7 py-8"
          >
            <div className="flex items-center gap-5">
              <h3 className="text-2 font-medium text-white">{benefit.name}</h3>
              <span
                className={`rounded-lg border px-2 py-0.5 text-sm font-medium ${statusClass[benefit.status]}`}
              >
                {benefit.status}
              </span>
            </div>

            <button
              type="button"
              className="flex items-center gap-3 text-5 text-[#A7B6D3] hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
              <span>Show Rules</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
