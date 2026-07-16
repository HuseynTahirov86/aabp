import { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <h3 className="font-serif text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center gap-2 bg-accent text-white hover:bg-accent/90 rounded-full px-6 h-10 text-sm font-semibold"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
