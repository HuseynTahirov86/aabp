"use client";

import * as React from "react";
import { useRouter } from "@/i18n/routing";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { FileText, Calendar, Users, Briefcase, Search } from "lucide-react";

import { useTranslations } from "next-intl";

export function CommandPalette() {
  const t = useTranslations("CommandPalette");
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm text-white/80 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10"
      >
        <Search className="w-4 h-4" />
        <span>{t("searchPrompt")}</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium opacity-100 text-white">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t("dialogTitle")}
        description={t("dialogDescription")}
      >
        <CommandInput placeholder={t("placeholder")} />
        <CommandList>
          <CommandEmpty>{t("noResults")}</CommandEmpty>
          
          <CommandGroup heading={t("platform")}>
            <CommandItem onSelect={() => runCommand(() => router.push("/about"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>{t("about")}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/research"))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>{t("research")}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/events"))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>{t("events")}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/career"))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>{t("career")}</span>
            </CommandItem>

          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading={t("quickActions")}>
            <CommandItem onSelect={() => runCommand(() => router.push("/login"))}>
              <span>{t("login")}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/register"))}>
              <span>{t("apply")}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
