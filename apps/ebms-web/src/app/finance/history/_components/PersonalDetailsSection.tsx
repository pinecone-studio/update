"use client";

import {
  HiOutlineUserCircle,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="text-lg text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-black">
          {value}
        </p>
      </div>
    </div>
  );
}

export function PersonalDetailsSection() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-black">
            Personal Details
          </h3>
          <p className="mt-0.5 text-sm text-slate-600">
            View and manage your personal information
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
          <HiOutlinePencilSquare className="text-base" />
          Edit Profile
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <DetailRow icon={HiOutlineUserCircle} label="Full Name" value="Finance Manager" />
        <DetailRow icon={HiOutlinePhone} label="Phone Number" value="—" />
        <DetailRow icon={HiOutlineEnvelope} label="Email Address" value="—" />
        <DetailRow icon={HiOutlineUserCircle} label="Employee ID" value="finance" />
      </div>
    </section>
  );
}
