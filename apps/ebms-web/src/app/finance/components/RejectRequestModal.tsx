/** @format */

"use client";

type RejectRequestModalProps = {
	rejectionReason: string;
	onRejectionReasonChange: (value: string) => void;
	onCancel: () => void;
	onConfirm: () => void;
};

export function RejectRequestModal({
	rejectionReason,
	onRejectionReasonChange,
	onCancel,
	onConfirm,
}: RejectRequestModalProps) {
	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
			<div className="w-full max-w-[560px] rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
				<h3 className="text-5 font-semibold text-black">Reject Request</h3>
				<p className="mt-2 text-5 text-slate-600">
					Please provide a reason for rejecting this benefit request.
				</p>
				<textarea
					value={rejectionReason}
					onChange={(e) => onRejectionReasonChange(e.target.value)}
					placeholder="Enter rejection reason..."
					rows={4}
					className="mt-4 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-5 text-black placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						className="rounded-xl border border-slate-300 px-4 py-2 text-5 text-slate-600 hover:bg-slate-100"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={!rejectionReason.trim()}
						className="rounded-xl bg-red-500/90 px-4 py-2 text-5 font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Confirm Reject
					</button>
				</div>
			</div>
		</div>
	);
}
