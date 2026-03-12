'use client';

const STORAGE_KEY = 'admin-benefit-requests';
const APPROVED_BENEFITS_KEY = 'admin-approved-benefits';

export type LocalBenefitRequest = {
  id: string;
  employeeId: string;
  benefitId: string;
  status: string;
  createdAt: string;
  employeeName?: string | null;
  benefitName?: string | null;
};

export function getLocalBenefitRequests(): LocalBenefitRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalBenefitRequest(req: LocalBenefitRequest): void {
  const list = getLocalBenefitRequests();
  if (list.some((r) => r.id === req.id)) return;
  list.push(req);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function updateLocalBenefitRequestStatus(
  requestId: string,
  status: 'APPROVED' | 'REJECTED'
): void {
  const list = getLocalBenefitRequests().map((r) =>
    r.id === requestId ? { ...r, status } : r
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function getApprovedBenefitsMap(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(APPROVED_BENEFITS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Admin approve хийхэд (API эсвэл local request) employee dashboard-д ACTIVE харуулах */
export function addApprovedBenefit(employeeId: string, benefitId: string): void {
  const map = getApprovedBenefitsMap();
  const list = map[employeeId] ?? [];
  if (!list.includes(benefitId)) {
    map[employeeId] = [...list, benefitId];
    localStorage.setItem(APPROVED_BENEFITS_KEY, JSON.stringify(map));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('admin-approved-benefit', { detail: { employeeId, benefitId } })
      );
    }
  }
}

/** Employee dashboard: approved benefit IDs for overlay PENDING → ACTIVE */
export function getApprovedBenefitIdsForEmployee(employeeId: string): string[] {
  const fromRequests = getLocalBenefitRequests()
    .filter((r) => r.employeeId === employeeId && r.status === 'APPROVED')
    .map((r) => r.benefitId);
  const fromMap = getApprovedBenefitsMap()[employeeId] ?? [];
  return [...new Set([...fromRequests, ...fromMap])];
}

/** Admin: request list-аас approve хийгдсэн request ID-уудыг буцаана (load дээр sessionApprovedIds init) */
export function getApprovedRequestIds(
  requests: { id: string; employeeId: string; benefitId: string }[]
): Set<string> {
  const map = getApprovedBenefitsMap();
  const fromLocal = getLocalBenefitRequests()
    .filter((r) => r.status === 'APPROVED')
    .map((r) => r.id);
  const ids = new Set<string>(fromLocal);
  for (const req of requests) {
    const approved = map[req.employeeId]?.includes(req.benefitId);
    if (approved) ids.add(req.id);
  }
  return ids;
}
