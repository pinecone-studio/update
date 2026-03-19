/** @format */
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EmployeeEligibilitySkeleton } from "../components/EmployeeEligibilitySkeleton";
import { EmployeeEligibilityHeader } from "./_components/EmployeeEligibilityHeader";
import { EmployeeSearchInput } from "./_components/EmployeeSearchInput";
import { EmployeeListSection } from "./_components/EmployeeListSection";
import { ensureValidActiveUserProfile } from "@/app/_lib/activeUser";
import { getClient, fetchEmployees, type EmployeeRow } from "./_lib/api";

function EmployeeEligibilityPageContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [loading, setLoading] = useState(true);
  const [employeeList, setEmployeeList] = useState<EmployeeRow[]>([]);
  const [search, setSearch] = useState(initialSearch);

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employeeList;
    return employeeList.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
    );
  }, [search, employeeList]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureValidActiveUserProfile();
        const client = getClient();
        const rows = await fetchEmployees(client);
        if (!cancelled) setEmployeeList(rows);
      } catch {
        if (!cancelled) setEmployeeList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  if (loading) return <EmployeeEligibilitySkeleton />;

  return (
    <div className="space-y-4 sm:space-y-6">
      <EmployeeEligibilityHeader />
      <EmployeeSearchInput value={search} onChange={setSearch} />
      <EmployeeListSection employees={filteredEmployees} />
    </div>
  );
}

export default function EmployeeEligibilityPage() {
  return (
    <Suspense fallback={<EmployeeEligibilitySkeleton />}>
      <EmployeeEligibilityPageContent />
    </Suspense>
  );
}
