import { Suspense } from "react";
import AddBenefitsBuilderClient from "./AddBenefitsBuilderClient";

export default function AddBenefitsBuilderPage() {
  return (
    <Suspense fallback={<div className="rounded-3xl border border-[#2C4264] bg-[#1E293B] p-8 text-white">Loading…</div>}>
      <AddBenefitsBuilderClient />
    </Suspense>
  );
}
