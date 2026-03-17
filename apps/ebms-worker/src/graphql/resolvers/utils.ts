export function asBool01(v: unknown): boolean {
  if (v === true) return true;
  if (v === false || v == null) return false;
  if (typeof v === "number") return v > 0;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "yes") return true;
    if (s === "false" || s === "no" || s === "") return false;
    const n = Number(s);
    if (!Number.isNaN(n)) return n > 0;
  }
  return false;
}

export function mapBenefitStatus(
  status: string,
): "ACTIVE" | "ELIGIBLE" | "LOCKED" | "PENDING" {
  const s = (status ?? "").toLowerCase();
  if (s === "active") return "ACTIVE";
  if (s === "eligible") return "ELIGIBLE";
  if (s === "pending") return "PENDING";
  return "LOCKED";
}

export function mapRequestStatus(
  status: string,
): "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" {
  const s = (status ?? "").toLowerCase();
  if (s === "approved") return "APPROVED";
  if (s === "rejected") return "REJECTED";
  if (s === "cancelled") return "CANCELLED";
  return "PENDING";
}

export function mapEmploymentStatus(
  status: string,
): "ACTIVE" | "PROBATION" | "LEAVE" | "TERMINATED" {
  const s = (status ?? "").toLowerCase();
  if (s === "active") return "ACTIVE";
  if (s === "probation") return "PROBATION";
  if (s === "leave") return "LEAVE";
  if (s === "terminated") return "TERMINATED";
  return "PROBATION";
}

export function safeJsonParse<T>(input: string, fallback: T): T {
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}
