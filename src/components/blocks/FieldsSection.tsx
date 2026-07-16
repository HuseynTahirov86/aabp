"use client";

import { motion } from "framer-motion";
import { Heart, FlaskConical, Dna, Users, Cog } from "lucide-react";
import { useTranslations } from "next-intl";
import { slideUpVariants } from "@/motion/slide";
import { Section, SectionHeader } from "@/components/shared/Section";

const FIELDS = [
  { icon: Heart, key: "medical", gradient: "from-rose-500/10 to-transparent" },
  { icon: FlaskConical, key: "natural", gradient: "from-emerald-500/10 to-transparent" },
  { icon: Dna, key: "life", gradient: "from-cyan-500/10 to-transparent" },
  { icon: Users, key: "social", gradient: "from-violet-500/10 to-transparent" },
  { icon: Cog, key: "engineering", gradient: "from-orange-500/10 to-transparent" },
] as const;

export function FieldsSection() {
  const t = useTranslations("Fields");

  return (
    <Section className="bg-card/50">
      <SectionHeader
        title={t("title")}
        subtitle={t("subtitle")}
        centered
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
        {FIELDS.map(({ icon: Icon, key, gradient }, index) => (
          <motion.div
            key={key}
            variants={slideUpVariants}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`group relative bg-card border border-border hover:border-accent/40 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(183,152,74,0.1)] overflow-hidden${index === 4 ? " lg:col-start-2" : ""}`}
          >
            {/* Gradient hover overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            {/* Icon */}
            <div className="relative w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
              <Icon className="w-7 h-7 text-accent" />
            </div>

            {/* Text */}
            <h3 className="relative font-serif text-xl font-bold text-foreground mb-3">
              {t(`${key}.name` as Parameters<typeof t>[0])}
            </h3>
            <p className="relative text-muted-foreground text-sm leading-relaxed">
              {t(`${key}.desc` as Parameters<typeof t>[0])}
            </p>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-accent transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
