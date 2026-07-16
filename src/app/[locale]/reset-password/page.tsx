"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { fadeVariants } from "@/motion/fade";
import { useTranslations } from 'next-intl';

export default function ResetPasswordPage() {
  const t = useTranslations('Auth');
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      const e = err as Error;
      toast.error(e.message || t('errorReset'));
      setError(e.message || t('errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary/30 px-6 py-20">
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white rounded-3xl shadow-glass p-8 md:p-10 border border-border"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">{t('resetTitle')}</h1>
          <p className="text-muted-foreground text-sm">{t('resetSubtitle')}</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm text-center">
            {t('resetSent')}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">{t('emailLabel')}</label>
            <Input 
              type="email" 
              placeholder="email@example.com" 
              className="h-12 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-primary text-white hover:bg-primary/90 mt-2"
            disabled={isLoading}
          >
            {isLoading ? t('sending') : t('sendReset')}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          {t('rememberPass')}{" "}
          <Link href="/login" className="text-accent font-semibold hover:underline">
            {t('backToSignIn')}
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
