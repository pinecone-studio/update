/** @format */

"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "@/app/icons/back";

type EmployeeEligibilityDetailHeaderProps = {
	employeeName: string;
	employeeRole: string;
};

export function EmployeeEligibilityDetailHeader({
	employeeName,
	employeeRole,
}: EmployeeEligibilityDetailHeaderProps) {
	const router = useRouter();

	return (
		<div className="mb-[42px] flex items-start justify-between gap-[22px]">
			<button
				type="button"
				onClick={() => router.push("/admin/employee-eligibility")}
				aria-label="Back"
				className="mt-[6px] inline-flex h-[74px] w-[74px] items-center justify-center rounded-[16px] border-[#35527A] bg-[#FFFFFF1A] text-white/88 transition hover:bg-[rgba(40,58,92,0.92)]"
			>
				<BackIcon />
			</button>

			<div className="flex flex-col justify-end">
				<h1 className="text-[53px] font-normal leading-[1.02] tracking-[-0.04em] text-white">
					{employeeName}
				</h1>
				<p className="mt-[12px] text-[27px] font-normal tracking-[-0.02em] text-white/48">
					Role <span className="text-[#9AA8AB]">: {employeeRole}</span>
				</p>
			</div>
		</div>
	);
}
