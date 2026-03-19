"use client";

import AddBenefitsBuilderClient from "../new/AddBenefitsBuilderClient";

type AddBenefitModalProps = {
  onClose: () => void;
  onSaved: () => Promise<void>;
};

export function AddBenefitModal({ onClose, onSaved }: AddBenefitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 px-3 pb-8 pt-20 dark:bg-black/70 sm:px-4 sm:pb-10 sm:pt-24">
      <button
        type="button"
        aria-label="Close add benefit modal"
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-md"
      />
      <div className="relative z-10 max-h-[calc(100vh-9.5rem)] w-full max-w-[90vw] overflow-hidden rounded-3xl xl:max-w-6xl">
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
