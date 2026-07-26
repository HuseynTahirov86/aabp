"use client";

import React, { useState, useRef } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { fadeVariants } from "@/motion/fade";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { getAuthInstance, getDb } from "@/lib/firebase/config";
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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!cvFile) {
      toast.error("Please upload your CV.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", cvFile);
      formData.append("folder", "cvs");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json();
        throw new Error(uploadErr.error || "Failed to upload CV.");
      }

      const { url: cvUrl } = await uploadRes.json();

      const userCredential = await createUserWithEmailAndPassword(getAuthInstance(), email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      await sendEmailVerification(user);

      await setDoc(doc(getDb(), "users", user.uid), {
        firstName,
        lastName,
        profession,
        bio,
        email,
        phone,
        linkedin,
        cvUrl,
        role: "PENDING",
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

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, DOC, or DOCX files are allowed.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB.");
        return;
      }
      setCvFile(file);
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
          sizes="(max-width: 1024px) 0vw, 50vw"
          className="object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-10 p-12 text-center text-white max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">
              {t('registerHeroTitle')}
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              {t('registerHeroDesc')}
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
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>

          <div className="text-left mb-10">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-3">{t('registerTitle')}</h1>
            <p className="text-muted-foreground text-base">{t('registerSubtitle')}</p>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t('firstName')}</label>
                <Input 
                  type="text" 
                  placeholder="John" 
                  className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-card focus:border-accent transition-all duration-300"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t('lastName')}</label>
                <Input 
                  type="text" 
                  placeholder="Smith" 
                  className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-card focus:border-accent transition-all duration-300"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('profession')}</label>
              <Input 
                type="text" 
                placeholder="e.g. Software Engineer, Medical Researcher" 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-card focus:border-accent transition-all duration-300"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('bio')}</label>
              <Input 
                type="text" 
                placeholder="A brief description of your background..." 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-card focus:border-accent transition-all duration-300"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('profEmail')}</label>
              <Input 
                type="email" 
                placeholder="john.smith@example.com" 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-card focus:border-accent transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('phoneNumber')}</label>
              <Input 
                type="tel" 
                placeholder="+44 7000 000000" 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-card focus:border-accent transition-all duration-300"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('linkedin')}</label>
              <Input 
                type="url" 
                placeholder="https://linkedin.com/in/..." 
                className="h-14 rounded-xl px-4 bg-secondary/50 border-transparent focus:bg-card focus:border-accent transition-all duration-300"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t('cvUpload')} <span className="text-red-500">*</span></label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-14 rounded-xl px-4 bg-secondary/50 border border-dashed border-border hover:border-accent transition-all duration-300 flex items-center gap-3 text-muted-foreground"
              >
                {cvFile ? (
                  <>
                    <FileText className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-foreground truncate">{cvFile.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 shrink-0" />
                    <span>{t('cvUploadHelp')}</span>
                  </>
                )}
              </button>
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
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-xl bg-primary text-white hover:bg-primary/90 text-base font-medium shadow-md hover:shadow-lg transition-all"
              >
                {loading ? t('uploading') : t('submitApp')}
              </Button>
            </div>
          </form>

          <p className="text-center text-base text-muted-foreground">
            {t('alreadyAccount')}{" "}
            <Link href="/login" className="text-accent font-bold hover:text-foreground transition-colors">
              {t('signIn')}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
