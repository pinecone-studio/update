/** @format */

"use client";

import { useState } from "react";
import { EmployeeContracts } from "./EmployeeContracts";
import { VendorContracts } from "./VendorContracts";

export default function VendorContractsPage() {
	const [activeTab, setActiveTab] = useState<"employee" | "vendor">("employee");

	return (
		<div className="space-y-6">
			<div>
				<div
					className="flex flex-wrap items-center gap-3"
					role="tablist"
					aria-label="Contract type"
				>
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === "employee"}
						onClick={() => setActiveTab("employee")}
						className={`rounded-xl font-medium transition py-2 px-3 ${
							activeTab === "employee"
								? "text-[24px] text-white border-b border-[#2A9BFF] rounded-b-none"
								: "text-[24px] text-slate-600 dark:text-slate-300 dark:hover:text-white"
						}`}
					>
						Employee contract
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === "vendor"}
						onClick={() => setActiveTab("vendor")}
						className={`rounded-xl px-3 py-2 font-medium transition ${
							activeTab === "vendor"
								? "text-[24px] text-white border-b border-[#2A9BFF] rounded-b-none"
								: "text-[24px] text-slate-600 dark:text-slate-300 dark:hover:text-white"
						}`}
					>
						Vendor contract
					</button>
				</div>
				<p className="mt-3 text-5 text-slate-600 dark:text-[#A7B6D3]">
					{activeTab === "employee"
						? "Manage employee contracts and track lifecycle status"
						: "Manage vendor contracts and track lifecycle status"}
				</p>
			</div>

			{activeTab === "employee" ? <EmployeeContracts /> : <VendorContracts />}
		</div>
	);
}
