"use client";

type EmployeeSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function EmployeeSearchInput({ value, onChange }: EmployeeSearchInputProps) {
  return (
    <section>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 sm:left-5 dark:text-[#93A4C3]">
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
          className="h-12 w-full rounded-2xl border border-white/50 bg-slate-50 pl-12 pr-4 text-base font-normal text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#FAFBFB1A10] dark:border-[#324A70]/10 dark:bg-[#0B102B1A]/10 dark:text-white dark:placeholder:text-white/50 dark:focus:border-white/50 sm:h-14 sm:pl-14 sm:text-[20px]"
        />
      </div>
    </section>
  );
}
