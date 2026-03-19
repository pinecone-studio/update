"use client";

type EmployeeSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function EmployeeSearchInput({ value, onChange }: EmployeeSearchInputProps) {
  return (
    <section>
      <div className="relative">
        <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/50">
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search employees by name"
          className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-4 text-[20px] font-normal text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50 dark:focus:border-[#2A9BFF] dark:focus:ring-[#2A9BFF]/30"
        />
      </div>
    </section>
  );
}
