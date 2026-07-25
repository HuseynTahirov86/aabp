"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/firebase/useAuth";
import { updateUserProfile } from "@/lib/firebase/db-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [phone, setPhone] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (userData) {
      // eslint-disable-next-line
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setProfession(userData.profession || "");
      setBio(userData.bio || "");
      setLinkedin(userData.linkedin || "");
      setPhone(userData.phone || "");
      setCvUrl(userData.cvUrl || "");
      setPhotoUrl(userData.photoUrl || "");
    }
  }, [user, loading, userData, router]);

  const handleSave = async () => {
    if (!user || !userData) return;
    setIsSaving(true);
    try {
      await updateUserProfile(userData.id, {
        firstName,
        lastName,
        profession,
        bio,
        linkedin,
        phone,
        cvUrl,
        photoUrl
      });
      toast.success(t('profileUpdated'));
      // We could use context to refresh, but a simple reload works well for a settings page
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      toast.error(t('profileFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "profiles");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setPhotoUrl(data.url);
      toast.success(t('imageUploaded'));
    } catch (err) {
      console.error(err);
      toast.error(t('imageFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-secondary/20 pt-32 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/20 pt-8 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-4 w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('backToDashboard')}
          </Link>
          <h1 className="text-3xl font-bold font-serif text-primary">{t('settingsTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('settingsDesc')}</p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 space-y-6">
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-secondary overflow-hidden shrink-0 relative">
              {photoUrl ? (
                <Image src={photoUrl} alt="Profile" fill sizes="96px" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="text-sm font-medium">{t('profilePhoto')}</label>
              <div className="flex items-center gap-4">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange} 
                  disabled={isUploading}
                  className="w-full cursor-pointer"
                />
                {isUploading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground">{t('selectImage')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('firstName')}</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('lastName')}</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('profession')}</label>
            <Input value={profession} onChange={(e) => setProfession(e.target.value)} placeholder={t('profPlaceholder')} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('bio')}</label>
            <Textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder={t('bioPlaceholder')}
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('phoneNumber')}</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7000 000000" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('linkedin')}</label>
            <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder={t('linkedinPlaceholder')} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('cvUrlLabel')}</label>
            <Input value={cvUrl} readOnly className="bg-muted/50" placeholder="CV uploaded during registration" />
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-white hover:bg-primary/90 px-8">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {t('saveChanges')}
            </Button>
          </div>

        </div>
      </div>
    </main>
  );
}
