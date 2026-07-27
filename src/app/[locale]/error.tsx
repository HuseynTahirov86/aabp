"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-red-500/15 text-red-400 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold font-serif text-foreground mb-2">{t("errorTitle")}</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("errorDesc")}</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="bg-primary text-white hover:bg-primary/90">
          {t("tryAgain")}
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          {t("returnHome")}
        </Button>
      </div>
    </div>
  );
}
