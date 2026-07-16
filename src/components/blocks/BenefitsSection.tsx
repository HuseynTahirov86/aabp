"use client";

import { motion } from "framer-motion";
import { Globe, Briefcase, BookOpen, CalendarCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { slideUpVariants } from "@/motion/slide";
import { Section, SectionHeader } from "@/components/shared/Section";

const BENEFITS = [
  { icon: Globe, key: "network", color: "text-blue-400" },
  { icon: Briefcase, key: "career", color: "text-emerald-400" },
  { icon: BookOpen, key: "research", color: "text-violet-400" },
  { icon: CalendarCheck, key: "events", color: "text-amber-400" },
] as const;

export function BenefitsSection() {
  const t = useTranslations("Benefits");

  return (
    <Section className="bg-background">
      <SectionHeader
        title={t("title")}
        subtitle={t("subtitle")}
        centered
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
        {BENEFITS.map(({ icon: Icon, key, color }, index) => (
          <motion.div
            key={key}
            variants={slideUpVariants}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group flex gap-6 p-8 rounded-2xl bg-card border border-border hover:border-border/60 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-card border border-border">
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                {t(`${key}.title` as Parameters<typeof t>[0])}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`${key}.desc` as Parameters<typeof t>[0])}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
