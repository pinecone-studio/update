/** @format */

"use client";

export type ContractTaskStatus = "PENDING" | "APPROVED";

export type ContractTask = {
  requestId: string;
  benefitId: string;
  benefitName: string;
  requestStatus: ContractTaskStatus;
  uploadedUrl?: string | null;
  createdAt: string;
};

interface ContractTaskCardProps {
  task: ContractTask;
  isUploading: boolean;
  selectedFile: File | null;
  errorText?: string;
  onSelectFile: (requestId: string, file: File | null) => void;
  onUpload: (requestId: string) => void;
}

export function ContractTaskCard({
  task,
  isUploading,
  selectedFile,
  errorText,
  onSelectFile,
  onUpload,
}: ContractTaskCardProps) {
  const needsUpload = task.requestStatus === "APPROVED" && !task.uploadedUrl;

  return (
    <div
      className="rounded-xl border border-white/10 bg-white/5 p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-xs font-medium text-white/90">Contract status</p>
      <p className="mt-1 text-xs text-white/70">
        {task.benefitName} ({task.requestId})
      </p>
      <p className="mt-1 text-xs text-amber-100/80">Status: {task.requestStatus}</p>

      {task.requestStatus === "PENDING" ? (
        <p className="mt-2 text-xs text-amber-100/80">
          Admin approval pending. Upload will be enabled after approval.
        </p>
      ) : null}

      {!needsUpload ? (
        <div className="mt-2 flex items-center gap-3">
          {task.uploadedUrl ? (
            <>
              <span className="text-xs text-emerald-300">
                Signed contract uploaded
              </span>
              <a
                href={task.uploadedUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-300 hover:text-blue-200"
              >
                View uploaded file
              </a>
            </>
          ) : null}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => onSelectFile(task.requestId, e.target.files?.[0] ?? null)}
            className="text-xs text-white/80 file:mr-2 file:rounded-md file:border-0 file:bg-white/20 file:px-3 file:py-1.5 file:text-xs file:text-white hover:file:bg-white/30"
          />
          <button
            type="button"
            disabled={!selectedFile || isUploading}
            onClick={() => onUpload(task.requestId)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload signed PDF"}
          </button>
        </div>
      )}

      {errorText ? <p className="mt-2 text-xs text-red-300">{errorText}</p> : null}
    </div>
  );
}
