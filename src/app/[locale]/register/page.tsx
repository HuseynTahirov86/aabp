"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { fadeVariants } from "@/motion/fade";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase/config";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useTranslations } from 'next-intl';
import Image from "next/image";

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        profession,
        bio,
        email,
        linkedin,
        role: "MEMBER",
        publicProfile: true,
        createdAt: new Date().toISOString()
      });

      try {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, firstName, type: 'WELCOME' })
        });
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr);
      }

      router.push("/dashboard");
    } catch (err) {
      const e = err as Error;
      toast.error(e.message || t('errorRegister'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      const docRef = doc(db, "users", user.uid);
      const { getDoc } = await import('firebase/firestore');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          role: "MEMBER",
          publicProfile: true,
          createdAt: new Date().toISOString()
        });
      }
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
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop" 
          alt="Networking" 
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
              Join the Network
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Create an account to access exclusive events, network with peers, and contribute to the community.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg py-10"
        >
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>

          <div className="text-left mb-10">
            <h1 className="font-serif text-4xl font-bold text-primary mb-3">{t('registerTitle')}</h1>
            <p className="text-muted-foreground text-base">{t('registerSubtitle')}</p>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">{t('firstName')}</label>
                <Input 
                  type="text" 
                  placeholder="John" 
                  className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-white focus:border-accent transition-all duration-300"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">{t('lastName')}</label>
                <Input 
                  type="text" 
                  placeholder="Smith" 
                  className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-white focus:border-accent transition-all duration-300"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">{t('profession')}</label>
              <Input 
                type="text" 
                placeholder="e.g. Software Engineer, Medical Researcher" 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-white focus:border-accent transition-all duration-300"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">{t('bio')}</label>
              <Input 
                type="text" 
                placeholder="A brief description of your background..." 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-white focus:border-accent transition-all duration-300"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">{t('profEmail')}</label>
              <Input 
                type="email" 
                placeholder="john.smith@example.com" 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-white focus:border-accent transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">{t('linkedin')}</label>
              <Input 
                type="url" 
                placeholder="https://linkedin.com/in/..." 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-white focus:border-accent transition-all duration-300"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">{t('passwordLabel')}</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-white focus:border-accent transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-xl bg-primary text-white hover:bg-primary/90 text-base font-medium shadow-md hover:shadow-lg transition-all"
              >
                {loading ? t('submitting') : t('submitApp')}
              </Button>
            </div>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-background px-4 text-muted-foreground font-bold">{t('orContinueWith')}</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-xl text-base font-medium hover:bg-secondary/50 transition-colors" 
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Google
            </Button>
          </div>

          <p className="text-center text-base text-muted-foreground">
            {t('alreadyAccount')}{" "}
            <Link href="/login" className="text-primary font-bold hover:text-accent transition-colors">
              {t('signIn')}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
