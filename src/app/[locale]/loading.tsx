import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("Index");
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-secondary rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-muted-foreground font-medium animate-pulse">{t("loadingText")}</p>
    </div>
  );
}
