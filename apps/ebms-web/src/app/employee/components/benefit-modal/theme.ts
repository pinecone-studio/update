/** @format */

import type {
	BenefitCardProps,
	EligibilityRule,
} from "@/app/_components/BenefitCard";

export type Status = BenefitCardProps["status"];

export const STATUS_BADGE: Record<Status, string> = {
	ACTIVE:
		"border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-950/80 dark:text-emerald-300",
	ELIGIBLE:
		"border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-500/25 dark:bg-blue-950/80 dark:text-blue-300",
	PENDING:
		"border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-500/25 dark:bg-amber-950/80 dark:text-amber-300",
	LOCKED:
		"border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-500/25 dark:bg-rose-950/80 dark:text-rose-300",
	REJECTED:
		"border-red-200 bg-red-100 text-red-800 dark:border-red-500/25 dark:bg-red-950/80 dark:text-red-300",
};

const lightFrame =
	"border border-slate-200 bg-white shadow-xl dark:border-[0.72px] dark:border-[rgba(185,189,255,0.24)] dark:shadow-[0_30px_80px_rgba(7,10,28,0.45)]";
const lightHeader =
	"bg-gradient-to-br from-slate-50 to-slate-100 dark:bg-[linear-gradient(135deg,rgba(18,20,56,0.98)_0%,rgba(22,28,72,0.98)_52%,rgba(16,18,54,0.98)_100%)]";
const lightBody =
	"bg-slate-50/80 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(88,119,255,0.15),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.10),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]";
const lightSection =
	"border-slate-200 bg-white/80 dark:border-slate-600/50 dark:bg-slate-800/60";
const lightFooter =
	"border-slate-200 bg-white dark:border-slate-600/50 dark:bg-slate-900/95";

export const MODAL_THEME: Record<
	Status,
	{
		frame: string;
		header: string;
		body: string;
		section: string;
		summary: string;
		rulePass: string;
		ruleFail: string;
		closeBtn: string;
		footer: string;
	}
> = {
	ACTIVE: {
		frame: lightFrame,
		header: lightHeader,
		body: "bg-emerald-50/60 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(88,119,255,0.15),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.10),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]",
		section: lightSection,
		summary:
			"border-emerald-200 bg-emerald-50/90 dark:border-emerald-700/50 dark:bg-emerald-950/70",
		rulePass:
			"border-emerald-200 bg-emerald-50 dark:border-emerald-600/40 dark:bg-emerald-950/80 dark:text-emerald-300",
		ruleFail:
			"border-rose-200 bg-rose-50 dark:border-rose-600/40 dark:bg-rose-950/80 dark:text-rose-300",
		closeBtn: "",
		footer: lightFooter,
	},
	ELIGIBLE: {
		frame: lightFrame,
		header: lightHeader,
		body: "bg-blue-50/50 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(88,119,255,0.15),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.10),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]",
		section: lightSection,
		summary:
			"border-blue-200 bg-blue-50/90 dark:border-blue-700/50 dark:bg-blue-950/70",
		rulePass:
			"border-emerald-200 bg-emerald-50 dark:border-emerald-600/40 dark:bg-emerald-950/80 dark:text-emerald-300",
		ruleFail:
			"border-rose-200 bg-rose-50 dark:border-rose-600/40 dark:bg-rose-950/80 dark:text-rose-300",
		closeBtn: "",
		footer: lightFooter,
	},
	PENDING: {
		frame: lightFrame,
		header: lightHeader,
		body: "bg-amber-50/50 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(255,184,77,0.12),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.08),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]",
		section: lightSection,
		summary:
			"border-amber-200 bg-amber-50/90 dark:border-amber-700/50 dark:bg-amber-950/70",
		rulePass:
			"border-emerald-200 bg-emerald-50 dark:border-emerald-600/40 dark:bg-emerald-950/80 dark:text-emerald-300",
		ruleFail:
			"border-rose-200 bg-rose-50 dark:border-rose-600/40 dark:bg-rose-950/80 dark:text-rose-300",
		closeBtn: "",
		footer: lightFooter,
	},
	LOCKED: {
		frame: lightFrame,
		header: lightHeader,
		body: "bg-rose-50/40 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(221,110,148,0.12),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.08),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]",
		section: lightSection,
		summary:
			"border-rose-200 bg-rose-50/90 dark:border-rose-700/50 dark:bg-rose-950/70",
		rulePass:
			"border-emerald-200 bg-emerald-50 dark:border-emerald-600/40 dark:bg-emerald-950/80 dark:text-emerald-300",
		ruleFail:
			"border-rose-200 bg-rose-50 dark:border-rose-600/40 dark:bg-rose-950/80 dark:text-rose-300",
		closeBtn: "",
		footer: lightFooter,
	},
	REJECTED: {
		frame: lightFrame,
		header: lightHeader,
		body: "bg-rose-50/40 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(225,103,118,0.14),transparent_28%),radial-gradient(circle_at_72%_60%,rgba(78,115,255,0.08),transparent_36%),linear-gradient(135deg,rgba(30,37,84,0.98)_0%,rgba(28,33,79,0.98)_46%,rgba(23,29,72,0.98)_100%)]",
		section: lightSection,
		summary:
			"border-rose-200 bg-rose-50/90 dark:border-red-700/50 dark:bg-red-950/70",
		rulePass:
			"border-emerald-200 bg-emerald-50 dark:border-emerald-600/40 dark:bg-emerald-950/80 dark:text-emerald-300",
		ruleFail:
			"border-rose-200 bg-rose-50 dark:border-rose-600/40 dark:bg-rose-950/80 dark:text-rose-300",
		closeBtn: "",
		footer: lightFooter,
	},
};

export function getRules(benefit: BenefitCardProps): EligibilityRule[] {
	if (benefit.eligibilityRules && benefit.eligibilityRules.length > 0) {
		return benefit.eligibilityRules;
	}
	const baseRule = (benefit.eligibilityCriteria ?? "").trim();
	const fallbackRule =
		baseRule ||
		(benefit.status === "LOCKED" ? "Role requirement" : "Eligibility rule");
	const failureDetail =
		benefit.status === "LOCKED"
			? benefit.lockReason
			: benefit.status === "REJECTED"
				? benefit.rejectReason
				: undefined;

	if (benefit.status === "LOCKED" || benefit.status === "REJECTED") {
		return [
			{
				rule: fallbackRule,
				passed: false,
				detail: failureDetail,
			},
		];
	}

	return [
		{
			rule: fallbackRule,
			passed: true,
		},
	];
}
