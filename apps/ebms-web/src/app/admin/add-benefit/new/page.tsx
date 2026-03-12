import { Suspense } from "react";
import AddBenefitsBuilderClient from "./AddBenefitsBuilderClient";

export default function AddBenefitsBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 dark:border-[#2C4264] dark:bg-[#1E293B] dark:text-white">
          Loading...
        </div>
      }
    >
      <AddBenefitsBuilderClient />
    </Suspense>
  );
}
