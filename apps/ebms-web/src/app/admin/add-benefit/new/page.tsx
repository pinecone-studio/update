import { Suspense } from "react";
import AddBenefitsBuilderClient from "./AddBenefitsBuilderClient";
import { AddBenefitsBuilderSkeleton } from "./AddBenefitsBuilderSkeleton";

export default function AddBenefitsBuilderPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Suspense fallback={<AddBenefitsBuilderSkeleton />}>
        <AddBenefitsBuilderClient />
      </Suspense>
    </div>
  );
}
