"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { getAuthInstance } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { fadeVariants } from "@/motion/fade";
import { useTranslations } from 'next-intl';
import Image from "next/image";

export default function LoginPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(getAuthInstance(), email, password);
      router.push("/dashboard");
    } catch (err) {
      const e = err as Error;
      toast.error(e.message || t('errorSignIn'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex w-full bg-background">
      {/* Left Side - Image/Branding (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
          alt="Office" 
          fill 
          priority
          className="object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-10 p-12 text-center text-white max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">
              {t('loginHeroTitle')}
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              {t('loginHeroDesc')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <div className="text-left mb-10">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-3">{t('signInTitle')}</h1>
            <p className="text-muted-foreground text-base">{t('signInSubtitle')}</p>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleEmailSignIn} className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('emailLabel')}</label>
              <Input 
                type="email" 
                placeholder="email@example.com" 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-card focus:border-accent transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('passwordLabel')}</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-card focus:border-accent transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between items-center text-sm pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-accent focus:ring-accent w-4 h-4" />
                <span className="text-muted-foreground font-medium">{t('rememberMe')}</span>
              </label>
              <Link href="/reset-password" className="text-accent hover:text-foreground transition-colors font-semibold">
                {t('forgotPassword')}
              </Link>
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-xl bg-primary text-white hover:bg-primary/90 mt-4 text-base font-medium shadow-md hover:shadow-lg transition-all"
            >
              {loading ? "..." : t('signInBtn')}
            </Button>
          </form>

          <p className="text-center text-base text-muted-foreground mt-10">
            {t('notMember')}{" "}
            <Link href="/register" className="text-accent font-bold hover:text-foreground transition-colors">
              {t('applyMembership')}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
