"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { getDb } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function NewsletterSection() {
  const t = useTranslations("Newsletter");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(getDb(), "newsletter_subscribers"), {
        email,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      // silently fail — user still sees success state
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-24 bg-card relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(183,152,74,0.06)_0%,transparent_70%)]" />
      <motion.div
        className="relative max-w-2xl mx-auto text-center px-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-8">
          <Mail className="w-8 h-8 text-accent" />
        </div>
        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-4">
          {t("subtitle")}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
          {t("title")}
        </h2>
        <p className="text-muted-foreground mb-10">{t("desc")}</p>

        {submitted ? (
          <p className="text-accent font-semibold">{t("success")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 h-12 bg-background border border-border rounded-full px-5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-accent/50 transition-colors"
            />
            <button
              type="submit"
              className="h-12 px-6 bg-accent text-white rounded-full font-semibold text-sm hover:bg-accent/90 transition-colors flex items-center gap-2 justify-center disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("btn")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-xs text-muted-foreground/50 mt-4">{t("note")}</p>
      </motion.div>
    </section>
  );
}
