/** @format */

import { FiClock, FiExternalLink } from "react-icons/fi";
import { MdDirectionsBus } from "react-icons/md";

export const BenefitCard = () => {
	return (
		<div className="flex flex-col gap-3 w-full">
			<span className="text-white text-xs font-medium uppercase tracking-wider w-fit">
				FINANCIAL
			</span>

			<div className="w-full min-w-0 max-w-full h-[356px] rounded-xl bg-[#1A2536] border border-[#2d3a4d] overflow-hidden shadow-inner">
				<div className="p-5 pt-4">
					<div className="flex items-start gap-4 mb-5">
						<div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50]">
							<MdDirectionsBus size={24} />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-3">
								<div>
									<h3 className="text-lg font-bold text-white">Transit Pass</h3>
									<p className="text-sm text-[#94A3B8] mt-0.5">
										Monthly public transportation allowance
									</p>
								</div>
								<span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-[#4CAF50] text-white">
									ACTIVE
								</span>
							</div>
						</div>
					</div>

					<div className="space-y-3 mb-5 pb-5 border-b border-[#2d3a4d]">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
							<span className="text-sm text-[#94A3B8]">Subsidy Coverage</span>
							<span className="text-sm text-white">100%</span>
						</div>
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
							<span className="text-sm text-[#94A3B8]">Vendor</span>
							<a
								href="https://metrotra.example.com"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1.5 text-sm text-white hover:text-[#60A5FA] transition-colors"
							>
								Metro Transit Authority
								<FiExternalLink size={12} className="flex-shrink-0" />
							</a>
						</div>
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
							<span className="text-sm text-[#94A3B8]">
								Eligibility Criteria
							</span>
							<span className="text-sm text-white">
								Available from day 1 of employment
							</span>
						</div>
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
							<span className="text-sm text-[#94A3B8]">Expires</span>
							<div className="flex items-center gap-2 text-sm text-white">
								<FiClock size={14} className="text-[#94A3B8] flex-shrink-0" />
								2026-04-09
							</div>
						</div>
					</div>

					<button
						type="button"
						className="w-full py-3 px-4 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium text-sm transition-colors"
					>
						Manage Benefit
					</button>
				</div>
			</div>
		</div>
	);
};
