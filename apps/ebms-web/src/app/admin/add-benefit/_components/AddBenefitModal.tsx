"use client";

import AddBenefitsBuilderClient from "../new/AddBenefitsBuilderClient";

type AddBenefitModalProps = {
  onClose: () => void;
  onSaved: () => Promise<void>;
};

export function AddBenefitModal({ onClose, onSaved }: AddBenefitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close add benefit modal"
        onClick={onClose}
        className="absolute inset-0 bg-[#020B1FCC] backdrop-blur-md"
      />
      <div className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-auto rounded-3xl">
        <AddBenefitsBuilderClient
          inModal
          compactCreateMode
          onClose={onClose}
          onSaved={async () => {
            onClose();
            await onSaved();
          }}
        />
      </div>
    </div>
  );
}
