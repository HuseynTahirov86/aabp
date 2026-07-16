"use client";

import { motion } from "framer-motion";
import { slideUpVariants } from "@/motion/slide";
import { staggerContainerVariants } from "@/motion/stagger";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  containerClassName?: string;
  animate?: boolean;
}

export function Section({
  children,
  className,
  containerClassName,
  animate = true,
  ...props
}: SectionProps) {
  const motionProps = animate
    ? {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-50px" },
        variants: slideUpVariants,
      }
    : {};

  if (animate) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <motion.section className={cn("py-20 md:py-32", className)} {...motionProps} {...(props as any)}>
        <div className={cn("container mx-auto px-6", containerClassName)}>
          {children}
        </div>
      </motion.section>
    );
  }

  return (
    <section className={cn("py-20 md:py-32", className)} {...props}>
      <div className={cn("container mx-auto px-6", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
  centered = false,
  className,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "mb-12 md:mb-20 max-w-3xl",
        centered && "mx-auto text-center",
        className
      )}
    >
      {subtitle && (
        <motion.span 
          variants={slideUpVariants}
          custom={1}
          className="text-accent font-semibold tracking-wider uppercase text-sm block mb-4"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2 
        variants={slideUpVariants}
        custom={2}
        className="font-serif text-3xl md:text-5xl font-bold text-primary"
      >
        {title}
      </motion.h2>
    </motion.div>
  );
}
