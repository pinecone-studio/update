export function asBool01(v: unknown): boolean {
  return v === 1 || v === true || v === '1';
}

export function mapBenefitStatus(
  status: string
): 'ACTIVE' | 'ELIGIBLE' | 'LOCKED' | 'PENDING' {
  const s = (status ?? '').toLowerCase();
  if (s === 'active') return 'ACTIVE';
  if (s === 'eligible') return 'ELIGIBLE';
  if (s === 'pending') return 'PENDING';
  return 'LOCKED';
}

export function mapRequestStatus(
  status: string
): 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' {
  const s = (status ?? '').toLowerCase();
  if (s === 'approved') return 'APPROVED';
  if (s === 'rejected') return 'REJECTED';
  if (s === 'cancelled') return 'CANCELLED';
  return 'PENDING';
}

export function mapEmploymentStatus(
  status: string
): 'ACTIVE' | 'PROBATION' | 'LEAVE' | 'TERMINATED' {
  const s = (status ?? '').toLowerCase();
  if (s === 'active') return 'ACTIVE';
  if (s === 'probation') return 'PROBATION';
  if (s === 'leave') return 'LEAVE';
  if (s === 'terminated') return 'TERMINATED';
  return 'PROBATION';
}

export function safeJsonParse<T>(input: string, fallback: T): T {
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}

