"use client";

import { FiDollarSign, FiFileText, FiUsers } from "react-icons/fi";
import type { AddBenefitFormState } from "../_lib/types";

const cardClass =
  "rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5";

type Props = {
  form: AddBenefitFormState;
  onChange: (next: AddBenefitFormState) => void;
};

type ApprovalItemProps = {
  icon: React.ReactNode;
  iconBgClass: string;
  title: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ApprovalItem({
  icon,
  iconBgClass,
  title,
  checked,
  onChange,
}: ApprovalItemProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${iconBgClass} text-[var(--text-secondary)]`}
      >
        {icon}
      </div>
      <span className="min-w-0 flex-1 text-sm font-medium text-slate-900 dark:text-white">
        {title}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}

export function ApprovalSettingsSection({ form, onChange }: Props) {
  return (
    <section className={`${cardClass} flex h-full min-h-0 flex-col w-full`}>
      <h2 className="text-base font-medium text-slate-900 sm:text-lg">
        Approval Settings
      </h2>
      <div className="mt-2 flex flex-col gap-2">
        <ApprovalItem
          icon={<FiDollarSign size={18} />}
          iconBgClass="bg-emerald-500/20"
          title="Requires Finance Approval"
          checked={form.financeCheck ?? false}
          onChange={(v) => onChange({ ...form, financeCheck: v })}
        />
        <ApprovalItem
          icon={<FiFileText size={18} />}
          iconBgClass="bg-slate-500/20"
          title="Requires Vendor Contract"
          checked={form.requiresContract ?? false}
          onChange={(v) => onChange({ ...form, requiresContract: v })}
        />
        <ApprovalItem
          icon={<FiUsers size={18} />}
          iconBgClass="bg-slate-500/20"
          title="Requires Manager Approval"
          checked={form.managerApproval ?? false}
          onChange={(v) => onChange({ ...form, managerApproval: v })}
        />
      </div>
    </section>
  );
}
