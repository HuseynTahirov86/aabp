"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

interface StatItem {
  value: number;
  suffix: string;
  labelKey: string;
  descKey: string;
}

const STATS: StatItem[] = [
  { value: 200, suffix: "+", labelKey: "members", descKey: "membersDesc" },
  { value: 25, suffix: "+", labelKey: "events", descKey: "eventsDesc" },
  { value: 5, suffix: "", labelKey: "fields", descKey: "fieldsDesc" },
  { value: 2, suffix: "", labelKey: "countries", descKey: "countriesDesc" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const t = useTranslations("Stats");

  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            {t("subtitle")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
            {t("title")}
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-serif text-4xl md:text-5xl font-bold text-white mb-1">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-accent font-semibold text-sm uppercase tracking-wide mb-1">
                {t(stat.labelKey)}
              </div>
              <div className="text-white/60 text-xs">
                {t(stat.descKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
