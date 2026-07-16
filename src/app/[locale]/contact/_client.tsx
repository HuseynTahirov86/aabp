"use client";

import React, { useState } from "react";
import { Hero } from "@/components/shared/Hero";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Mail, Phone, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export function ContactClient() {
  const t = useTranslations("Index");
  const tContact = useTranslations("Contact");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "CONTACT" }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      toast.success(tContact("successMsg"));
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error(tContact("errorMsg"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t("contactUs") || "Contact Us"}
        subtitle="Get in touch with the AABP team"
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <Section className="py-20 bg-secondary/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-4">{tContact("heading")}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {tContact("desc")}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-primary">{tContact("emailLabel")}</p>
                  <p className="text-muted-foreground">contact@aabporg.uk</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-primary">{tContact("phoneLabel")}</p>
                  <p className="text-muted-foreground">+44 7454 776856</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-primary">{tContact("officeLabel")}</p>
                  <p className="text-muted-foreground">{tContact("officeLocation")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-glass border border-border">
            <h3 className="text-2xl font-bold text-primary mb-6">{tContact("formHeading")}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">{tContact("nameLabel")}</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={tContact("namePlaceholder")}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">{tContact("emailLabel")}</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={tContact("emailPlaceholder")}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">{tContact("subjectLabel")}</label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder={tContact("subjectPlaceholder")}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">{tContact("messageLabel")}</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder={tContact("messagePlaceholder")}
                  className="min-h-[150px] rounded-xl resize-none"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary text-white mt-2">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? tContact("sendingBtn") : tContact("sendBtn")}
              </Button>
            </form>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="mt-16 rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317715.7119164344!2d-0.3817765138166552!3d51.528308259628746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2suk!4v1721123456789!5m2!1sen!2suk"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="AABP Office Location — London, UK"
          />
        </div>
      </Section>
    </main>
  );
}
