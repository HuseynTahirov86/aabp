"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const PARTNERS = [
  {
    name: "TƏBİB",
    fullName: "Tibbi Ərazi Bölmələrinin İdarəetməsi Birliyi",
    logo: "/logos/tabib.svg",
    country: "🇦🇿",
  },
  {
    name: "ATU",
    fullName: "Azərbaycan Tibb Universiteti",
    logo: "/logos/amu.png",
    country: "🇦🇿",
  },
  {
    name: "NDU",
    fullName: "Naxçıvan Dövlət Universiteti",
    logo: "/logos/ndu.png",
    country: "🇦🇿",
  },
  {
    name: "Universal Hospital",
    fullName: "Universal Hospital (Azərbaycan)",
    logo: "/logos/universal-hospital.png",
    country: "🇦🇿",
  },
  {
    name: "AMD e.V.",
    fullName: "Aserbaidschanische Mediziner in Deutschland e.V.",
    logo: "/logos/amd-ev.svg",
    country: "🇩🇪",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function PartnersSection() {
  const t = useTranslations("Partners");

  return (
    <section className="py-24 bg-card/30 border-y border-border/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Logo Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {PARTNERS.map((p) => (
            <motion.div
              key={p.name}
              variants={cardVariants}
              className="group bg-card border border-border hover:border-accent/40 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-[0_0_24px_rgba(183,152,74,0.08)]"
            >
              {/* Logo container */}
              <div className="w-full h-16 flex items-center justify-center">
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={120}
                  height={60}
                  className="object-contain max-h-14 max-w-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  unoptimized={p.logo.endsWith(".svg")}
                />
              </div>

              {/* Divider */}
              <div className="w-8 h-px bg-border group-hover:bg-accent/40 transition-colors duration-300" />

              {/* Name */}
              <div className="text-center">
                <p className="text-xs font-bold text-foreground/80 group-hover:text-foreground transition-colors leading-tight">
                  {p.name}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1 leading-tight line-clamp-2">
                  {p.country} {p.fullName}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
