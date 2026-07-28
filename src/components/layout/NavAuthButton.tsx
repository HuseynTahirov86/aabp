"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";

interface NavAuthButtonProps {
  variant: "desktop" | "mobile";
}

export function NavAuthButton({ variant }: NavAuthButtonProps) {
  const t = useTranslations("Navbar");
  const { user, loading } = useAuth();

  if (variant === "mobile") {
    return (
      <Link href={user ? "/dashboard" : "/login"}>
        <Button className="w-full bg-primary text-white hover:bg-primary/90 rounded-full h-12" disabled={loading}>
          {loading ? "..." : user ? t('dashboard') : t('signIn')}
        </Button>
      </Link>
    );
  }

  return (
    <Link href={user ? "/dashboard" : "/login"}>
      <Button
        className="rounded-full px-6 font-medium shadow-sm transition-all bg-accent text-white hover:bg-accent/90"
        disabled={loading}
      >
        {loading ? "..." : user ? t('dashboard') : t('signIn')}
      </Button>
    </Link>
  );
}
