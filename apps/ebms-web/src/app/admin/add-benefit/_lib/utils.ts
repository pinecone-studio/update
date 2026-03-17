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
