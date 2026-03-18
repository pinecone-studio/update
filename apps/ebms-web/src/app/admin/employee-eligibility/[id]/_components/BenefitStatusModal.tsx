"use client";

import type { BenefitRow, BenefitStatus } from "../_lib/types";
import { modalStatusOptions, statusCopy } from "../_lib/constants";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,10,20,0.26)] px-6 backdrop-blur-[2px]">
      <div className="h-[520px] w-full max-w-[760px] rounded-[30px] border border-white/12 bg-[rgba(31,39,68,0.60)] px-[34px] pb-[32px] pt-[44px] shadow-[0_40px_140px_rgba(3,6,15,0.34)] backdrop-blur-[10px]">
        <div>
          <h2 className="text-[26px] font-normal tracking-[-0.03em] text-white">
            {benefit.name}
          </h2>
          <p className="mt-[1px] text-[18px] text-white/45">
            Edit benefit status
          </p>
        </div>

        <div className="mt-[22px] grid grid-cols-[1.04fr_1.62fr] gap-[12px]">
          <div className="rounded-[16px] border border-white/8 bg-white/[0.02] px-[22px] py-[14px]">
            <p className="text-[24px] font-normal leading-[1.05] tracking-[-0.03em] text-white">
              {employeeName}
            </p>
            <p className="mt-[4px] text-[16px] text-white/63">
              {employeeRole}
            </p>
          </div>

          <div className="rounded-[16px] border border-white/8 bg-white/[0.02] p-[20px]">
            <div className="grid grid-cols-4 gap-[12px]">
              {modalStatusOptions.map((option) => {
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

        <label className="mt-2 block pl-[24px] text-[14px] text-white/50">
          *Reason for change (optional)
        </label>
        <textarea
          rows={6}
          value={draftReason}
          onChange={(e) => onDraftReasonChange(e.target.value)}
          placeholder="Comment..."
          className="mt-2 h-[120px] w-full rounded-[22px] border border-white/8 bg-white/[0.02] px-[24px] py-[20px] text-[23px] font-normal text-white outline-none placeholder:text-white/36 focus:border-[#2A9BFF]"
        />

        {error && (
          <p className="mt-3 text-sm text-red-300">{error}</p>
        )}

        {savedReason && !error && (
          <p className="mt-3 text-sm text-white/48">
            Last saved reason: {savedReason}
          </p>
        )}

        <div className="mt-[16px] flex justify-end gap-[20px]">
          <button
            type="button"
            onClick={onClose}
            className="h-[46px] w-34 rounded-[10px] bg-[#C3C3C3] px-[20px] py-[10px] text-[16px] font-ligth text-[#16346E] transition hover:bg-[#D1D1D1]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="h-[46px] w-50 rounded-[10px] bg-[#0868CB] px-[28px] py-[10px] text-[16px] font-light text-white transition hover:bg-[#0B76E4] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
