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
      {/* Background: Azerbaijan + UK flag photo, dark overlay for text legibility */}
      <Image
        src="/images/hero-flags-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#0A192F]/80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060e1a] via-[#0A192F]/60 to-[#0A192F]/30" />
      <ParticlesBg variant="dark" />

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
              src="https://flagcdn.com/w80/az.png"
              alt="Azerbaijan flag"
              className="w-9 h-6 md:w-11 md:h-7 lg:w-14 lg:h-9 object-cover rounded-sm shadow-sm"
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
              src="https://flagcdn.com/w80/gb.png"
              alt="United Kingdom flag"
              className="w-9 h-6 md:w-11 md:h-7 lg:w-14 lg:h-9 object-cover rounded-sm shadow-sm"
            />
          </motion.div>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-4 drop-shadow-md">
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
          className="text-lg md:text-xl text-white/80 max-w-2xl mb-5 leading-relaxed"
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
            className="bg-transparent border border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full h-12 px-9 text-base"
          >
            {t("learnBtn")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
