"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveUserProfile } from "@/app/_lib/activeUser";

export function FinanceRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const profile = getActiveUserProfile();
    const role = (profile.role ?? "").toLowerCase();
    const allowed = role.includes("finance");
    if (!allowed) {
      router.replace("/employee");
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (authorized === false) {
    return null;
  }
  if (authorized === null) {
    return (
      <div className="relative z-10 flex min-h-[200px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }
  return <>{children}</>;
}
