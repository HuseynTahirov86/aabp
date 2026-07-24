"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      const e = err as Error;
      toast.error(e.message || t('errorSignIn'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      const e = err as Error;
      toast.error(e.message || t('errorGoogle'));
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
              <Link href="/reset-password" className="text-accent hover:text-primary transition-colors font-semibold">
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

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-background px-4 text-muted-foreground font-bold">{t('orContinueWith')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-xl text-base font-medium hover:bg-secondary/50 transition-colors" 
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Google
            </Button>
          </div>

          <p className="text-center text-base text-muted-foreground mt-10">
            {t('notMember')}{" "}
            <Link href="/register" className="text-primary font-bold hover:text-accent transition-colors">
              {t('applyMembership')}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
