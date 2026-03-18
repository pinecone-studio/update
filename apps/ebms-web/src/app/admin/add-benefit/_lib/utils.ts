/** Benefit category-аас icon styling-ийг буцаана */
export function getBenefitTone(category: string) {
  switch (category.trim().toLowerCase()) {
    case "health":
      return {
        iconBg: "bg-rose-100 dark:bg-rose-500/15",
        iconColor: "text-rose-600 dark:text-rose-300",
      };
    case "financial":
      return {
        iconBg: "bg-amber-100 dark:bg-amber-500/15",
        iconColor: "text-amber-600 dark:text-amber-300",
      };
    case "equipment":
      return {
        iconBg: "bg-cyan-100 dark:bg-cyan-500/15",
        iconColor: "text-cyan-600 dark:text-cyan-300",
      };
    case "career development":
      return {
        iconBg: "bg-violet-100 dark:bg-violet-500/15",
        iconColor: "text-violet-600 dark:text-violet-300",
      };
    case "flexibility":
      return {
        iconBg: "bg-indigo-100 dark:bg-indigo-500/15",
        iconColor: "text-indigo-600 dark:text-indigo-300",
      };
    default:
      return {
        iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
        iconColor: "text-emerald-600 dark:text-emerald-300",
      };
  }
}

/** Benefit name-ээс vendor display утгыг гаргана */
export function getVendorDisplay(name: string): string {
  return name.includes(" — ") || name.includes(" - ")
    ? name.split(/ — | - /).pop() ?? "Pinecone"
    : "Pinecone";
}

const UNIT_LABELS: Record<string, string> = {
  day: "day",
  month: "month",
  year: "year",
};

/** Validity period display string */
export function formatValidityPeriod(
  duration?: number,
  unit?: string,
): string | undefined {
  if (duration == null) return undefined;
  if (duration === 0) return "Unlimited";
  const u = unit ? UNIT_LABELS[unit] ?? unit : "month";
  return `${duration} ${u}${duration === 1 ? "" : "s"}`;
}

/** Usage frequency display string (e.g., "1 time per 7 days") */
export function formatUsagePeriod(
  period?: number,
  periodUnit?: string,
  limit?: number,
): string | undefined {
  if (period == null || limit == null || period < 1 || limit < 1)
    return undefined;
  const u = periodUnit ? UNIT_LABELS[periodUnit] ?? periodUnit : "day";
  return `${limit} time${limit === 1 ? "" : "s"} per ${period} ${u}${period === 1 ? "" : "s"}`;
}

/** Backend: requestDeadline display (ISO date → localized) */
export function formatRequestDeadline(iso?: string | null): string | undefined {
  if (!iso?.trim()) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Backend: usageLimitCount + usageLimitPeriod display */
export function formatUsageLimit(
  count?: number,
  period?: string | null,
): string | undefined {
  if (count == null || count < 1) return undefined;
  if (!period?.trim()) return `${count} удаа (хязгааргүй хугацаа)`;
  const p =
    period.toLowerCase() === "year"
      ? "year"
      : period.toLowerCase() === "7days"
        ? "7 days"
        : "month";
  return `${count} per ${p}`;
}
