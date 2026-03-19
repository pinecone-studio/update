"use client";

type ProfileTabPlaceholderProps = {
  message: string;
};

export function ProfileTabPlaceholder({ message }: ProfileTabPlaceholderProps) {
  return (
    <div className="mt-6 min-h-[200px] w-full rounded-xl bg-slate-100 p-8 text-center">
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  );
}
