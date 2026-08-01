"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ParticlesBg } from "@/components/blocks/ParticlesBg";

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="min-h-[calc(100vh-72px)] lg:min-h-[calc(100vh-150px)] relative overflow-hidden bg-background flex flex-col items-center justify-center text-center px-6 py-3 md:py-6">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(183,152,74,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(18,32,54,0.06)_0%,transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,32,54,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(18,32,54,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <ParticlesBg />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo + flags */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-2">
          <motion.div
            aria-hidden
            className="drop-shadow-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/flags/az-waving.gif"
              alt="Azerbaijan flag"
              className="w-12 h-8 md:w-16 md:h-10 lg:w-20 lg:h-12 object-cover rounded-md shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Image
              src="/logo.png"
              alt="AABP Logo"
              width={160}
              height={160}
              className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-md"
              priority
            />
          </motion.div>

          <motion.div
            aria-hidden
            className="drop-shadow-sm"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/flags/uk-waving.gif"
              alt="United Kingdom flag"
              className="w-12 h-8 md:w-16 md:h-10 lg:w-20 lg:h-12 object-cover rounded-md shadow-md"
            />
          </motion.div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] mb-4">
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
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-5 leading-relaxed"
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
            className="bg-accent text-white hover:bg-accent/90 rounded-full h-12 px-9 text-base font-semibold"
          >
            {t("applyBtn")}
          </Button>
          <Button
            render={<Link href="/about" />}
            variant="outline"
            className="border border-foreground/20 text-foreground hover:bg-foreground/5 rounded-full h-12 px-9 text-base"
          >
            {t("learnBtn")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
