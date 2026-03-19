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

  const availableStatusOptions = statusOptions.filter(
    (option) => option !== benefit.status,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_50%_52%,rgba(61,42,108,0.20),transparent_42%),linear-gradient(180deg,rgba(9,11,21,0.72),rgba(10,11,20,0.78))] px-6 backdrop-blur-[10px]">
      <div className="h-[599px] w-full max-w-[900px] rounded-[30px] border border-[rgba(255,255,255,0.13)] bg-[linear-gradient(180deg,rgba(28,35,64,0.96),rgba(29,37,67,0.94))] px-[48px] pb-[38px] pt-[44px] shadow-[0_32px_120px_rgba(3,6,18,0.36)]">
        <div>
          <h2 className="text-[31px] font-normal leading-none tracking-[-0.03em] text-white">
            {benefit.name}
          </h2>
          <p className="mt-[6px] text-[18px] leading-none text-[#8D95AF]">
            Edit benefit status
          </p>
        </div>

        <div className="mt-[34px] grid grid-cols-[1.02fr_1.38fr] gap-[16px]">
          <div className="flex h-[100px] flex-col justify-center rounded-[18px] border border-[#FFFFFF] bg-[rgba(255,255,255,0.015)] px-[24px]">
            <p className="text-[27px] font-normal leading-[1.02] tracking-[-0.03em] text-[#C7C8D2]">
              {employeeName}
            </p>
            <p className="mt-[6px] text-[17px] leading-none text-[#B8BDCA]">
              {employeeRole}
            </p>
          </div>

          <div className="flex h-[100px] items-center rounded-[18px] border border-[#FFFFFF]/20 bg-[rgba(255,255,255,0.015)] px-[12px] py-[14px]">
            <div className="grid w-full grid-cols-3 gap-[10px]">
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

        <label className="mt-[44px] block pl-[2px] text-[14px] leading-none text-[#A8AEBE]">
          *Reason for change (optional)
        </label>
        <textarea
          rows={6}
          value={draftReason}
          onChange={(e) => onDraftReasonChange(e.target.value)}
          placeholder="Comment..."
          className="mt-[14px] h-[179px] w-full resize-none rounded-[26px] border border-white/10 bg-[rgba(255,255,255,0.015)] px-[30px] py-[24px] text-[21px] font-normal text-white outline-none placeholder:text-[#A2A8B8] focus:border-[#2A9BFF]"
        />

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        {savedReason && !error && (
          <p className="mt-3 text-sm text-white/48">
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
            className="rounded-lg bg-[#0057ADCC] px-4 py-2 font-medium text-white transition hover:bg-[#3E82F7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
