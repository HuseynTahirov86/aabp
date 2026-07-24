"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ParticlesBg } from "@/components/blocks/ParticlesBg";

const FIELD_KEYS = ["medical", "natural", "life", "social", "engineering"] as const;

export function HeroSection() {
  const t = useTranslations("Hero");
  const tFields = useTranslations("Fields");

  return (
    <section className="min-h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center text-center px-6 py-32">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(183,152,74,0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(18,32,54,0.8)_0%,transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <ParticlesBg />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
        >
          🇬🇧 · 🇦🇿 {t("badge")}
        </motion.div>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.05] mb-6">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t("heroLine1")}
          </motion.span>
          <motion.span
            className="block text-accent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t("heroLine2")}
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {t("heroLine3")}
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
        >
          {t("heroSubtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button
            render={<Link href="/register" />}
            className="bg-accent text-white hover:bg-accent/90 rounded-full h-14 px-10 text-base font-semibold"
          >
            {t("applyBtn")}
          </Button>
          <Button
            render={<Link href="/about" />}
            variant="outline"
            className="border border-foreground/20 text-foreground hover:bg-foreground/5 rounded-full h-14 px-10 text-base"
          >
            {t("learnBtn")}
          </Button>
        </motion.div>

        {/* Field tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-16">
          {FIELD_KEYS.map((key, i) => (
            <motion.span
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0 + i * 0.1 }}
              className="bg-card border border-border text-muted-foreground text-xs font-medium px-4 py-2 rounded-full"
            >
              {tFields(`${key}.name`)}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
