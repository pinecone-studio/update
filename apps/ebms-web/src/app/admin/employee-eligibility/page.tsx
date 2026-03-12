/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { EmployeeEligibilitySkeleton } from "../components/EmployeeEligibilitySkeleton";
import { createPortal } from "react-dom";
import { GraphQLClient, gql } from "graphql-request";

type BenefitStatus = "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING";

type EmployeeListItem = {
  id: string;
  name?: string | null;
  role?: string | null;
  employmentStatus?: string | null;
};

type EmployeeBenefit = {
  benefit: { id: string; name: string };
  status: BenefitStatus;
  ruleEvaluations: Array<{ ruleType: string; passed: boolean; reason: string }>;
};

type EmployeeDetail = EmployeeListItem & {
  benefits: EmployeeBenefit[];
};

const EMPLOYEES_QUERY = gql`
  query Employees {
    employees {
      id
      name
      role
      employmentStatus
    }
  }
`;

const EMPLOYEE_QUERY = gql`
  query Employee($id: ID!) {
    employee(id: $id) {
      id
      name
      role
      employmentStatus
      benefits {
        benefit {
          id
          name
        }
        status
        ruleEvaluations {
          ruleType
          passed
          reason
        }
      }
    }
  }
`;

const OVERRIDE_ELIGIBILITY_MUTATION = gql`
  mutation OverrideEligibility($input: OverrideInput!) {
    overrideEligibility(input: $input) {
      benefit {
        id
      }
      status
    }
  }
`;

const statusClass: Record<BenefitStatus, string> = {
  ACTIVE: "border-[#166534] bg-[#052E25] text-[#34D399]",
  ELIGIBLE: "border-[#1D4ED8] bg-[#122B4C] text-[#60A5FA]",
  LOCKED: "border-[#9F1239] bg-[#3A1026] text-[#FB7185]",
  PENDING: "border-[#B45309] bg-[#3B2A12] text-[#FBBF24]",
};

const statusOptions: BenefitStatus[] = ["ACTIVE", "PENDING", "ELIGIBLE", "LOCKED"];

function getClient(): GraphQLClient {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
  const base = raw.replace(/\/graphql\/?$/, "").trim() || "http://localhost:8787";
  const url = base.endsWith("/graphql") ? base : `${base}/graphql`;
  return new GraphQLClient(url, {
    headers: {
      "x-employee-id": "admin",
      "x-role": "admin",
    },
  });
}

function getErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "response" in e) {
    const res = (e as { response?: { errors?: Array<{ message?: string }> } }).response;
    const msg = res?.errors?.[0]?.message;
    if (msg) return msg;
  }
  if (e instanceof Error) return e.message;
  return String(e);
}

export default function EmployeeEligibilityPage() {
	const [loading, setLoading] = useState(true);
	const [employeeList, setEmployeeList] =
		useState<EmployeeRow[]>(initialEmployees);
	const [search, setSearch] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [expandedBenefitKey, setExpandedBenefitKey] = useState<string | null>(
		null,
	);
	const [draftStatusByKey, setDraftStatusByKey] = useState<
		Record<string, BenefitRow["status"]>
	>({});
	const [draftReasonByKey, setDraftReasonByKey] = useState<
		Record<string, string>
	>({});
	const [savedReasonByKey, setSavedReasonByKey] = useState<
		Record<string, string>
	>({});
	const currentAdmin = "HR Admin";

	const filteredEmployees = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return employeeList;
		return employeeList.filter(
			(emp) =>
				emp.name.toLowerCase().includes(q) ||
				emp.id.toLowerCase().includes(q) ||
				emp.department.toLowerCase().includes(q),
		);
	}, [search, employeeList]);

	const selectedEmployee = useMemo(
		() => employeeList.find((emp) => emp.id === selectedId) ?? null,
		[selectedId, employeeList],
	);

	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();

	const handleCloseModal = () => {
		setSelectedId(null);
		setExpandedBenefitKey(null);
	};

	const handleShowToggle = (
		key: string,
		currentStatus: BenefitRow["status"],
	) => {
		setExpandedBenefitKey((prev) => (prev === key ? null : key));
		setDraftStatusByKey((prev) =>
			prev[key] ? prev : { ...prev, [key]: currentStatus },
		);
	};

	const handleSaveStatus = (benefitName: string, key: string) => {
		if (!selectedId) return;
		const reason = (draftReasonByKey[key] ?? "").trim();
		if (!reason) return;

		const nextStatus = draftStatusByKey[key] ?? "Pending";
		const changedAt = new Date().toLocaleString();
		setEmployeeList((prev) =>
			prev.map((emp) =>
				emp.id !== selectedId
					? emp
					: {
							...emp,
							benefits: emp.benefits.map((benefit) =>
								benefit.name === benefitName
									? {
											...benefit,
											status: nextStatus,
											history: [
												{
													status: nextStatus,
													reason,
													changedAt,
													changedBy: currentAdmin,
												},
												...benefit.history,
											],
										}
									: benefit,
							),
						},
			),
		);
		setSavedReasonByKey((prev) => ({ ...prev, [key]: reason }));
		setDraftReasonByKey((prev) => ({ ...prev, [key]: "" }));
		setExpandedBenefitKey(null);
	};

	useEffect(() => {
		const t = setTimeout(() => setLoading(false), 400);
		return () => clearTimeout(t);
	}, []);

	if (loading) {
		return <EmployeeEligibilitySkeleton />;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-xl font-semibold text-white">
					Employee Eligibility Overview
				</h1>
				<p className="mt-3 text-5 text-[#A7B6D3]">
					Нэрээр хайж, ажилтан дээр дарахад benefit eligibility-г төв popup дээр
					харна.
				</p>
			</div>

			<section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
				<div className="relative">
					<span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#93A4C3]">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							className="h-6 w-6"
							stroke="currentColor"
							strokeWidth="1.8"
						>
							<circle cx="11" cy="11" r="7" />
							<path d="m20 20-4-4" />
						</svg>
					</span>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Ажилтны нэрээр хайх..."
						className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] pl-14 pr-4 text-5 text-white outline-none placeholder:text-[#8FA3C5] focus:border-[#4B6FA8]"
					/>
				</div>
			</section>

			<section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
				<h2 className="text-10 font-semibold text-white">
					Ажилтнуудын жагсаалт
				</h2>
				<div className="mt-4 space-y-2">
					{filteredEmployees.map((emp) => (
						<button
							key={emp.id}
							type="button"
							onClick={() => setSelectedId(emp.id)}
							className="flex w-full items-center gap-4 rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 py-3 text-left transition hover:bg-[#142544]"
						>
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7B7FFF] to-[#6B35FF] text-5 font-semibold text-white">
								{getInitials(emp.name)}
							</span>
							<div>
								<p className="text-5 font-medium text-white">{emp.name}</p>
								<p className="text-5 text-[#8FA3C5]">{emp.department}</p>
							</div>
						</button>
					))}
					{filteredEmployees.length === 0 && (
						<p className="rounded-2xl border border-[#324A70] bg-[#0F172A] px-4 py-3 text-5 text-[#9FB0CF]">
							Хайлтад тохирох ажилтан олдсонгүй.
						</p>
					)}
				</div>
			</section>

			{selectedEmployee &&
				typeof document !== "undefined" &&
				createPortal(
					<div
						className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
						style={{
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							width: "100vw",
							height: "100dvh",
							minHeight: "100vh",
						}}
						onClick={handleCloseModal}
					>
						<div
							className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-[#2C4264] bg-[#0F172A] p-6 shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
						<div className="mb-5 flex items-center justify-between">
							<div>
								<h2 className="text-xl font-semibold text-white">
									{selectedEmployee.name}
								</h2>
								<p className="mt-2 text-5 text-[#9FB0CF]">
									{selectedEmployee.id} • {selectedEmployee.department}
								</p>
							</div>
							<button
								type="button"
								onClick={handleCloseModal}
								className="rounded-xl border border-[#324A70] bg-[#1E293B] px-4 py-2 text-5 text-[#C9D5EA] hover:text-white"
							>
								Хаах
							</button>
						</div>

						<div className="space-y-4">
							{selectedEmployee.benefits.map((benefit) =>
								(() => {
									const key = `${selectedEmployee.id}-${benefit.name}`;
									const isExpanded = expandedBenefitKey === key;
									const draftStatus = draftStatusByKey[key] ?? benefit.status;
									const draftReason = draftReasonByKey[key] ?? "";
									const canSave = draftReason.trim().length > 0;
									const lastReason = savedReasonByKey[key];
									const statusOptions: BenefitRow["status"][] = [
										"Active",
										"Pending",
										"Eligible",
										"Locked",
									];

									return (
										<article
											key={benefit.name}
											className="rounded-3xl border border-[#2C4264] bg-[#1E293B] px-7 py-6"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-5">
													<h3 className="text-2 font-medium text-white">
														{benefit.name}
													</h3>
													<span
														className={`rounded-lg border px-2 py-0.5 text-sm font-medium ${statusClass[benefit.status]}`}
													>
														{benefit.status}
													</span>
												</div>

												<button
													type="button"
													onClick={() => handleShowToggle(key, benefit.status)}
													className="flex items-center gap-3 text-5 text-[#A7B6D3] hover:text-white"
												>
													<span className="rounded-lg border border-[#324A70] bg-[#0F172A] px-2 py-1 text-5 text-[#C9D5EA]">
														Change {benefit.history.length}
													</span>
													<svg
														viewBox="0 0 24 24"
														fill="none"
														className="h-6 w-6"
														stroke="currentColor"
														strokeWidth="1.8"
													>
														<path
															d={isExpanded ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"}
														/>
													</svg>
													<span>Show</span>
												</button>
											</div>

											{isExpanded && (
												<div className="mt-4 rounded-2xl border border-[#324A70] bg-[#0F172A] p-4">
													<p className="text-5 text-[#C9D5EA]">
														Status сонголт
													</p>
													<div className="mt-3 flex flex-wrap gap-2">
														{statusOptions.map((option) => (
															<button
																key={option}
																type="button"
																onClick={() =>
																	setDraftStatusByKey((prev) => ({
																		...prev,
																		[key]: option,
																	}))
																}
																className={`rounded-lg border px-3 py-1.5 text-5 transition ${
																	draftStatus === option
																		? statusClass[option]
																		: "border-[#324A70] text-[#C9D5EA] hover:text-white"
																}`}
															>
																{option}
															</button>
														))}
													</div>
													<label className="mt-4 block text-5 text-[#C9D5EA]">
														Яагаад өөрчилснөө бичнэ үү
													</label>
													<textarea
														rows={3}
														value={draftReason}
														onChange={(e) =>
															setDraftReasonByKey((prev) => ({
																...prev,
																[key]: e.target.value,
															}))
														}
														placeholder="Шалтгаан..."
														className="mt-2 w-full rounded-xl border border-[#324A70] bg-[#1E293B] px-3 py-2 text-5 text-white outline-none"
													/>
													<div className="mt-3 flex items-center gap-3">
														<button
															type="button"
															onClick={() =>
																handleSaveStatus(benefit.name, key)
															}
															disabled={!canSave}
															className="rounded-xl bg-[#2F66E8] px-4 py-2 text-5 text-white disabled:cursor-not-allowed disabled:opacity-60"
														>
															Save
														</button>
													</div>
													{lastReason && (
														<p className="mt-3 text-5 text-[#8FA3C5]">
															Сүүлд хадгалсан тайлбар: {lastReason}
														</p>
													)}

													<div className="mt-4">
														<p className="text-5 text-[#C9D5EA]">
															Өөрчлөлтийн түүх
														</p>
														{benefit.history.length === 0 ? (
															<p className="mt-2 text-5 text-[#8FA3C5]">
																Түүх алга.
															</p>
														) : (
															<div className="mt-2 space-y-2">
																{benefit.history.map((entry, idx) => (
																	<div
																		key={`${entry.changedAt}-${idx}`}
																		className="rounded-xl border border-[#324A70] bg-[#1E293B] px-3 py-2"
																	>
																		<p className="text-5 text-white">
																			{entry.changedBy} • {entry.changedAt}
																		</p>
																		<p className="mt-1 text-5 text-[#A7B6D3]">
																			Status: {entry.status}
																		</p>
																		<p className="mt-1 text-5 text-[#8FA3C5]">
																			Шалтгаан: {entry.reason}
																		</p>
																	</div>
																))}
															</div>
														)}
													</div>
												</div>
											)}
										</article>
									);
								})(),
							)}
							{selectedEmployee.benefits.length === 0 && (
								<p className="rounded-2xl border border-[#324A70] bg-[#1E293B] px-6 py-5 text-5 text-[#9FB0CF]">
									Benefit мэдээлэл олдсонгүй.
								</p>
							)}
						</div>
					</div>
				</div>,
					document.body
				)}
		</div>
	);
}
