/** @format */

"use client";

import type { BenefitRow, BenefitStatus } from "../_lib/types";
import { statusCopy, statusOptions } from "../_lib/constants";
import { getStatusSegmentClass } from "../_lib/utils";

type BenefitStatusModalProps = {
  open: boolean;
  benefit: BenefitRow;
  employeeName: string;
  employeeRole: string;
  draftStatus: BenefitStatus;
  draftReason: string;
  error: string;
  savedReason: string;
  saving: boolean;
  onDraftStatusChange: (status: BenefitStatus) => void;
  onDraftReasonChange: (reason: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function BenefitStatusModal({
  open,
  benefit,
  employeeName,
  employeeRole,
  draftStatus,
  draftReason,
  error,
  savedReason,
  saving,
  onDraftStatusChange,
  onDraftReasonChange,
  onClose,
  onSave,
}: BenefitStatusModalProps) {
  if (!open) return null;

  const availableStatusOptions = statusOptions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-[10px] dark:bg-black/70 sm:px-6">
      <div className="max-h-[92vh] w-full max-w-[900px] overflow-y-auto rounded-[30px] border border-slate-200 bg-white px-5 pb-8 pt-8 shadow-[0_32px_120px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-[#16142a] dark:shadow-[0_32px_120px_rgba(0,0,0,0.5)] sm:px-[48px] sm:pb-[38px] sm:pt-[44px]">
        <div>
          <h2 className="text-[26px] font-normal leading-none tracking-[-0.03em] text-slate-900 dark:text-white sm:text-[31px]">
            {benefit.name}
          </h2>
          <p className="mt-[6px] text-[16px] leading-none text-slate-600 dark:text-[#8D95AF] sm:text-[18px]">
            Edit benefit status
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-[34px] sm:grid-cols-[1.02fr_1.38fr] sm:gap-[16px]">
          <div className="flex min-h-[100px] flex-col justify-center rounded-[18px] border border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-[#1e1a35] sm:h-[100px] sm:px-[24px]">
            <p className="text-[22px] font-normal leading-[1.02] tracking-[-0.03em] text-slate-900 dark:text-[#C7C8D2] sm:text-[27px]">
              {employeeName}
            </p>
            <p className="mt-[6px] text-[15px] leading-none text-slate-600 dark:text-[#B8BDCA] sm:text-[17px]">
              {employeeRole}
            </p>
          </div>

          <div className="flex min-h-[100px] items-center rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-3 dark:border-white/10 dark:bg-[#1e1a35] sm:h-[100px] sm:px-[12px] sm:py-[14px]">
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-[10px] lg:grid-cols-4">
              {availableStatusOptions.map((option) => {
                const selected = draftStatus === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onDraftStatusChange(option)}
                    className={getStatusSegmentClass(option, selected)}
                    aria-pressed={selected}
                  >
                    {statusCopy[option]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <label className="mt-[44px] block pl-[2px] text-[14px] leading-none text-slate-600 dark:text-[#A8AEBE]">
          *Reason for change (optional)
        </label>
        <textarea
          rows={6}
          value={draftReason}
          onChange={(e) => onDraftReasonChange(e.target.value)}
          placeholder="Comment..."
          className="mt-[14px] h-[179px] w-full resize-none rounded-[26px] border border-slate-200 bg-slate-50 px-[30px] py-[24px] text-[21px] font-normal text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-[#1e1a35] dark:text-white dark:placeholder:text-white/50 dark:focus:border-[#2A9BFF] dark:focus:ring-[#2A9BFF]"
        />

        {error && (
          <p className="mt-3 text-sm text-red-400 dark:text-red-300">{error}</p>
        )}

        {savedReason && !error && (
          <p className="mt-3 text-sm text-slate-600 dark:text-white/48">
            Last saved reason: {savedReason}
          </p>
        )}

        <div className="mt-[20px] flex justify-end gap-[18px]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#D1DBEF] dark:hover:bg-[#24364F]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-[#0057ADCC] px-4 py-2 font-medium text-white transition hover:bg-[#3E82F7] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#1a5fb4] dark:hover:bg-[#2A9BFF]"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
