"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const PARTNERS = [
  "Imperial College London",
  "King's College London",
  "University College London",
  "London School of Economics",
  "University of Oxford",
  "University of Cambridge",
  "AstraZeneca",
  "BP Azerbaijan",
  "Azerbaijan State Oil Company",
  "Baku State University",
  "London Business School",
  "Deloitte UK",
];

const items = [...PARTNERS, ...PARTNERS];

export function PartnersSection() {
  const t = useTranslations("Partners");

  return (
    <section className="py-16 bg-card/30 border-y border-border/50 overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-8">
        {t("label")}
      </p>
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-card/30 to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-card/30 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {items.map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 mx-8 text-muted-foreground/50 hover:text-muted-foreground transition-colors text-sm font-medium whitespace-nowrap"
            >
              {name}
              <span className="text-muted-foreground/30">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
