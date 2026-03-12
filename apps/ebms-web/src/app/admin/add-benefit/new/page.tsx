import { Suspense } from "react";
import AddBenefitsBuilderClient from "./AddBenefitsBuilderClient";
import { AddBenefitsBuilderSkeleton } from "./AddBenefitsBuilderSkeleton";

export default function AddBenefitsBuilderPage() {
  return (
    <Suspense fallback={<AddBenefitsBuilderSkeleton />}>
      <AddBenefitsBuilderClient />
    </Suspense>
  );
}
