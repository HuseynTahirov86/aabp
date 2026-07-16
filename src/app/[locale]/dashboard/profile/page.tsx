"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";

// /dashboard/profile is a legacy route.
// All profile editing functionality now lives at /dashboard/settings.
export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/settings");
  }, [router]);

  return null;
}
