import { Suspense } from "react";
import AddBenefitsBuilderClient from "./AddBenefitsBuilderClient";
import { AddBenefitsBuilderSkeleton } from "./AddBenefitsBuilderSkeleton";

export default function AddBenefitsBuilderPage() {
  return (
    <div className="flex w-full min-w-0 flex-col overflow-x-hidden px-2 pb-8 sm:px-4 lg:px-6">
      <Suspense fallback={<AddBenefitsBuilderSkeleton />}>
        <AddBenefitsBuilderClient />
      </Suspense>
    </div>
  );
}
