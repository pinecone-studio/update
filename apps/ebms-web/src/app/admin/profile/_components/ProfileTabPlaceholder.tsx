"use client";

type ProfileTabPlaceholderProps = {
  message: string;
};

export function ProfileTabPlaceholder({ message }: ProfileTabPlaceholderProps) {
  return (
    <div className="mt-6 min-h-[200px] w-full rounded-xl bg-slate-100 p-8 text-center dark:bg-[#0f172a]">
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-[#243041] dark:bg-[#1A2333]">
        <p className="text-slate-600 dark:text-slate-400">{message}</p>
      </div>
    </div>
  );
}
