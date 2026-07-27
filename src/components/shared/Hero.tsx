"use client";

import { motion } from "framer-motion";
import { fadeVariants } from "@/motion/fade";
import { slideUpVariants } from "@/motion/slide";
import { staggerContainerVariants } from "@/motion/stagger";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/routing";

interface HeroProps {
  title: string;
  subtitle: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  backgroundImage?: string;
}

export function Hero({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image / Overlay */}
      {backgroundImage && (
        <>
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
          </motion.div>
          {/* Elegant Dark/Navy Overlay for readability */}
          <div className="absolute inset-0 z-10 bg-[#0A192F]/80 mix-blend-multiply" />
        </>
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl flex flex-col items-center"
        >
          {/* Subtitle / Eyebrow */}
          <motion.span
            variants={fadeVariants}
            custom={1}
            className="text-sm md:text-base font-semibold tracking-widest uppercase mb-6 text-accent"
          >
            {subtitle}
          </motion.span>

          {/* Title */}
          <motion.h1
            variants={slideUpVariants}
            custom={2}
            className={`font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 ${
              backgroundImage ? "text-white" : "text-foreground"
            }`}
          >
            {title}
          </motion.h1>

          {/* Actions */}
          <motion.div
            variants={slideUpVariants}
            custom={4}
            className="flex flex-col sm:flex-row gap-4"
          >
            {primaryAction && (
              <Button
                render={<Link href={primaryAction.href} />}
                size="lg"
                className="bg-accent text-white hover:bg-accent/90 rounded-md px-8 h-14 text-lg shadow-soft font-medium"
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                render={<Link href={secondaryAction.href} />}
                size="lg"
                variant="outline"
                className={`rounded-md px-8 h-14 text-lg border-2 font-medium ${
                  backgroundImage
                    ? "text-white border-white hover:bg-white hover:text-primary"
                    : "text-accent border-accent hover:bg-accent hover:text-white"
                }`}
              >
                {secondaryAction.label} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
