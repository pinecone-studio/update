"use client";

import { useMemo, useState } from "react";

type BenefitRow = {
  name: string;
  status: "Active" | "Eligible" | "Locked" | "Pending";
};

type EmployeeRow = {
  id: string;
  name: string;
  department: string;
  startDate: string;
  benefits: BenefitRow[];
};

const employees: EmployeeRow[] = [
  {
    id: "EMP-2847",
    name: "Sarah Johnson",
    department: "Engineering",
    startDate: "January 15, 2023",
    benefits: [
      { name: "Health Insurance", status: "Active" },
      { name: "401(k) Match", status: "Eligible" },
      { name: "Stock Options", status: "Locked" },
      { name: "Commuter Benefits", status: "Pending" },
    ],
  },
  {
    id: "EMP-2914",
    name: "Mike Chen",
    department: "Product",
    startDate: "March 02, 2022",
    benefits: [
      { name: "Health Insurance", status: "Active" },
      { name: "Travel Subsidy", status: "Eligible" },
      { name: "Remote Work", status: "Pending" },
    ],
  },
  {
    id: "EMP-3001",
    name: "Emily Rodriguez",
    department: "Marketing",
    startDate: "June 11, 2021",
    benefits: [
      { name: "Health Insurance", status: "Active" },
      { name: "Commuter Benefits", status: "Eligible" },
      { name: "Stock Options", status: "Locked" },
    ],
  },
  {
    id: "EMP-3042",
    name: "David Lee",
    department: "Finance",
    startDate: "October 23, 2020",
    benefits: [
      { name: "Health Insurance", status: "Active" },
      { name: "Down Payment", status: "Eligible" },
      { name: "MacBook Subsidy", status: "Pending" },
    ],
  },
];

const statusClass: Record<BenefitRow["status"], string> = {
  Active: "border-[#166534] bg-[#052E25] text-[#34D399]",
  Eligible: "border-[#1D4ED8] bg-[#122B4C] text-[#60A5FA]",
  Locked: "border-[#9F1239] bg-[#3A1026] text-[#FB7185]",
  Pending: "border-[#B45309] bg-[#3B2A12] text-[#FBBF24]",
};

export default function EmployeeEligibilityPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedEmployee = useMemo(
    () => employees.find((emp) => emp.id === selectedId) ?? null,
    [selectedId]
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Employee Eligibility Overview</h1>
        <p className="mt-3 text-5 text-[#A7B6D3]">
          Нийт ажилтнаас хайж, хүн дээр дарж benefit eligibility-г харна.
        </p>
      </div>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#93A4C3]">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ажилтны нэр, ID, эсвэл хэлтсээр хайх..."
            className="h-14 w-full rounded-2xl border border-[#324A70] bg-[#0F172A] pl-14 pr-4 text-5 text-white outline-none placeholder:text-[#8FA3C5] focus:border-[#4B6FA8]"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-6">
        <h2 className="text-10 font-semibold text-white">Ажилтнуудын жагсаалт</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[#324A70] bg-[#0F172A]">
          <table className="min-w-full text-left text-5">
            <thead className="border-b border-[#2C4264] uppercase tracking-wide text-[#8FA3C5]">
              <tr>
                <th className="px-6 py-4">№</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => {
                const isSelected = selectedId === emp.id;
                return (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedId(emp.id)}
                    className={`cursor-pointer border-b border-[#2C4264] transition last:border-b-0 ${
                      isSelected ? "bg-[#142544]" : "hover:bg-[#13213A]"
                    }`}
                  >
                    <td className="px-6 py-5 font-semibold text-white">{index + 1}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#7B7FFF] to-[#6B35FF] text-5 font-semibold text-white">
                          {getInitials(emp.name)}
                        </span>
                        <div>
                          <p className="font-medium text-white">{emp.name}</p>
                          <p className="text-5 text-[#8FA3C5]">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-xl bg-[#1C2B4A] px-4 py-2 text-5 text-[#C9D5EA]">{emp.department}</span>
                    </td>
                    <td className="px-6 py-5 text-[#C9D5EA]">{emp.startDate}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-xl border border-[#1E8E4E] bg-[#0D3E25] px-4 py-2 text-5 font-medium text-[#4ADE80]">
                        Сонгох
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredEmployees.length === 0 && (
            <p className="px-6 py-6 text-5 text-[#9FB0CF]">
              Хайлтад тохирох ажилтан олдсонгүй.
            </p>
          )}
        </div>
      </section>

      {selectedEmployee && (
        <>
          <section className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-7">
            <h2 className="text-xl font-semibold text-white">{selectedEmployee.name}</h2>
            <p className="mt-4 text-5 text-[#9FB0CF]">
              ID: {selectedEmployee.id} • {selectedEmployee.department} • Start Date: {selectedEmployee.startDate}
            </p>
          </section>

          <div className="space-y-5">
            {selectedEmployee.benefits.map((benefit) => (
              <article
                key={benefit.name}
                className="flex items-center justify-between rounded-3xl border border-[#2C4264] bg-[#1E293B] px-7 py-8"
              >
                <div className="flex items-center gap-5">
                  <h3 className="text-2 font-medium text-white">{benefit.name}</h3>
                  <span className={`rounded-lg border px-2 py-0.5 text-sm font-medium ${statusClass[benefit.status]}`}>
                    {benefit.status}
                  </span>
                </div>

                <button type="button" className="flex items-center gap-3 text-5 text-[#A7B6D3] hover:text-white">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                  <span>Show Rules</span>
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
