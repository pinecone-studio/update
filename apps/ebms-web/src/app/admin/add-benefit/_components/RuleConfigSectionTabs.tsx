/** @format */

"use client";

import { useState, useEffect } from "react";
import type { BenefitFromCatalog, BenefitConfig, Rule } from "../_lib/types";
import { ROLE_VALUES } from "../_lib/constants";

const cardClass =
	"rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6 dark:border-white/10 dark:bg-[#1e1a35]";
const inputClass =
	"rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-[#16142a] dark:text-white dark:placeholder:text-white/50 dark:focus:border-[#B18CFF]";

const EMPLOYMENT_STATUS_VALUES = [
	{ value: "active", label: "Active" },
	{ value: "leave", label: "Leave" },
	{ value: "terminated", label: "Terminated" },
	{ value: "probation", label: "Probation" },
] as const;
const RESPONSIBILITY_LEVEL_VALUES = [1, 2, 3] as const;
const LATE_ARRIVAL_COUNT_VALUES = [0, 1, 2, 3, 4, 5, 6] as const;
const OKR_SUBMITTED_VALUES = [
	{ value: "true", label: "True" },
	{ value: "false", label: "False" },
] as const;
const DEFAULT_TENURE_DAYS = 180;

const FIELD_LABELS: Record<string, string> = {
	employment_status: "Employee status",
	role: "Role",
	okr_submitted: "OKR submitted",
	late_arrival_count: "Late arrival count",
	responsibility_level: "Responsibility level",
	tenure: "Tenure",
	attendance: "Attendance",
};

const OPERATORS_EN: { value: string; label: string }[] = [
	{ value: "eq", label: "Equal (eq)" },
	{ value: "ne", label: "Not Equal (ne)" },
	{ value: "lt", label: "Less than (lt)" },
	{ value: "lte", label: "Less or equal (lte)" },
	{ value: "gte", label: "Greater or equal (gte)" },
	{ value: "gt", label: "Greater than (gt)" },
];

type Props = {
	rulesForSelected: BenefitConfig | null;
	attributes: string[];
	onUpdateRule: (
		ruleIndex: number,
		field: keyof Rule,
		value: string | number | boolean,
	) => void;
	onRuleTypeChange?: (ruleIndex: number, newType: string) => void;
	onAddRule: () => void;
	onRemoveRule: (ruleIndex: number) => void;
	error: string | null;
	message: string | null;
};

export function RuleConfigSectionTabs({
	rulesForSelected,
	attributes,
	onUpdateRule,
	onRuleTypeChange,
	onAddRule,
	onRemoveRule,
	error,
	message,
}: Props) {
	const [activeRuleIndex, setActiveRuleIndex] = useState(0);
	const rules = rulesForSelected?.rules ?? [];

	useEffect(() => {
		if (activeRuleIndex >= rules.length && rules.length > 0) {
			setActiveRuleIndex(Math.max(0, rules.length - 1));
		}
	}, [rules.length, activeRuleIndex]);
	const normalizedAttributes = Array.from(
		new Set(
			attributes.map((a) => (a === "attendance" ? "late_arrival_count" : a)),
		),
	);
	const attrsWithTenure = normalizedAttributes.includes("tenure")
		? normalizedAttributes
		: [...normalizedAttributes, "tenure"];

	const activeRule = rules[activeRuleIndex];
	const ruleType =
		activeRule?.type === "attendance" ? "late_arrival_count" : activeRule?.type;

	const getFieldLabel = (type: string) =>
		FIELD_LABELS[type] ?? type.replace(/_/g, " ");

	return (
		<section className={`${cardClass} h-full`}>
			<h2 className="text-base font-medium text-slate-900 dark:text-white sm:text-lg">
				Eligibility Rules
			</h2>

			{error && (
				<div className="mt-2 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-600 dark:bg-red-500/20 dark:border-red-500/50 dark:text-red-200">
					{error}
				</div>
			)}
			{message && (
				<div className="mt-2 rounded-lg border border-green-300 bg-green-50 px-3 py-1.5 text-sm text-green-700 dark:bg-green-500/20 dark:border-green-500/50 dark:text-green-200">
					{message}
				</div>
			)}

			<div className="mt-3">
				<button
					type="button"
					onClick={onAddRule}
					className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-[#334155] dark:text-[#C9D5EA] dark:hover:bg-[#24364F]"
				>
					+ Add Rule
				</button>

				{rules.length > 0 && (
					<>
						<div className="mt-3 flex flex-wrap gap-1 border-b border-slate-200 dark:border-[#334155]">
							{rules.map((_, ri) => (
								<button
									key={ri}
									type="button"
									onClick={() => setActiveRuleIndex(ri)}
									className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
										activeRuleIndex === ri
											? "border-blue-500 text-slate-900 dark:border-blue-500 dark:text-white"
											: "border-transparent text-slate-500 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-[#C9D5EA]"
									}`}
								>
									Rule {ri + 1}
								</button>
							))}
						</div>

						{activeRule && (
							<div className="mt-3 space-y-3">
								<div className="flex min-w-0 flex-wrap items-center gap-2">
									<select
										value={ruleType}
										onChange={(e) => {
											const newType = e.target.value;
											if (onRuleTypeChange) {
												onRuleTypeChange(activeRuleIndex, newType);
											} else {
												onUpdateRule(activeRuleIndex, "type", newType);
											}
										}}
										className={`${inputClass} min-w-0 w-full sm:min-w-[140px] sm:w-auto`}
									>
										{attrsWithTenure.map((a) => (
											<option key={a} value={a}>
												{getFieldLabel(a)}
											</option>
										))}
									</select>
									<select
										value={activeRule.operator}
										onChange={(e) =>
											onUpdateRule(activeRuleIndex, "operator", e.target.value)
										}
										className={`${inputClass} min-w-0 w-full sm:min-w-[120px] sm:w-auto`}
									>
										{(ruleType === "employment_status" || ruleType === "role"
											? OPERATORS_EN.slice(0, 2)
											: OPERATORS_EN
										).map((o) => (
											<option key={o.value} value={o.value}>
												{o.label}
											</option>
										))}
									</select>
									{ruleType === "employment_status" ? (
										<select
											value={String(activeRule.value ?? "active").toLowerCase()}
											onChange={(e) =>
												onUpdateRule(activeRuleIndex, "value", e.target.value)
											}
											className={`${inputClass} min-w-0 w-full sm:min-w-[120px] sm:w-auto`}
										>
											{EMPLOYMENT_STATUS_VALUES.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
									) : ruleType === "responsibility_level" ? (
										<select
											value={Number(activeRule.value ?? 1)}
											onChange={(e) =>
												onUpdateRule(
													activeRuleIndex,
													"value",
													Number(e.target.value),
												)
											}
											className={`${inputClass} min-w-[80px]`}
										>
											{RESPONSIBILITY_LEVEL_VALUES.map((level) => (
												<option key={level} value={level}>
													{level}
												</option>
											))}
										</select>
									) : ruleType === "late_arrival_count" ? (
										<select
											value={Number(activeRule.value ?? 0)}
											onChange={(e) =>
												onUpdateRule(
													activeRuleIndex,
													"value",
													Number(e.target.value),
												)
											}
											className={`${inputClass} min-w-[80px]`}
										>
											{LATE_ARRIVAL_COUNT_VALUES.map((count) => (
												<option key={count} value={count}>
													{count}
												</option>
											))}
										</select>
									) : ruleType === "tenure" ? (
										<input
											type="number"
											min={0}
											placeholder="Days"
											value={Math.max(
												0,
												Math.floor(
													Number(activeRule.value ?? DEFAULT_TENURE_DAYS) || 0,
												),
											)}
											onChange={(e) => {
												const v = Math.max(
													0,
													Math.floor(Number(e.target.value) || 0),
												);
												onUpdateRule(activeRuleIndex, "value", v);
											}}
											className={`${inputClass} min-w-[80px]`}
										/>
									) : ruleType === "okr_submitted" ? (
										<select
											value={String(activeRule.value ?? "false")}
											onChange={(e) =>
												onUpdateRule(
													activeRuleIndex,
													"value",
													e.target.value === "true",
												)
											}
											className={`${inputClass} min-w-[80px]`}
										>
											{OKR_SUBMITTED_VALUES.map(({ value, label }) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
									) : ruleType === "role" ? (
										<select
											value={String(
												activeRule.value ?? "employee",
											).toLowerCase()}
											onChange={(e) =>
												onUpdateRule(activeRuleIndex, "value", e.target.value)
											}
											className={`${inputClass} min-w-0 w-full sm:min-w-[120px] sm:w-auto`}
										>
											{ROLE_VALUES.map((r) => (
												<option key={r} value={r}>
													{r.charAt(0).toUpperCase() + r.slice(1)}
												</option>
											))}
										</select>
									) : (
										<input
											type="text"
											placeholder="Value"
											value={
												typeof activeRule.value === "boolean"
													? activeRule.value
														? "true"
														: "false"
													: String(activeRule.value ?? "")
											}
											onChange={(e) => {
												const v = e.target.value;
												if (v === "true")
													onUpdateRule(activeRuleIndex, "value", true);
												else if (v === "false")
													onUpdateRule(activeRuleIndex, "value", false);
												else if (/^\d+$/.test(v))
													onUpdateRule(activeRuleIndex, "value", Number(v));
												else onUpdateRule(activeRuleIndex, "value", v);
											}}
											className={`${inputClass} min-w-[100px]`}
										/>
									)}
									<button
										type="button"
										onClick={() => onRemoveRule(activeRuleIndex)}
										className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
									>
										Remove
									</button>
								</div>

								<div className="flex flex-col gap-2 sm:flex-row">
									<input
										type="text"
										placeholder="Error message (when the rule is not met)"
										value={activeRule.errorMessage ?? ""}
										onChange={(e) =>
											onUpdateRule(
												activeRuleIndex,
												"errorMessage",
												e.target.value,
											)
										}
										className={`${inputClass} min-w-0 flex-1`}
									/>
									<button
										type="button"
										onClick={() =>
											onUpdateRule(activeRuleIndex, "errorMessage", "")
										}
										className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-[#334155] dark:text-[#C9D5EA] dark:hover:bg-[#24364F]"
									>
										Clear
									</button>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
}
