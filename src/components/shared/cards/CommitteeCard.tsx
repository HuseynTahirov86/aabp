"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { slideUpVariants } from "@/motion/slide";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommitteeCardProps {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  linkedinUrl?: string;
  email?: string;
  index?: number;
  featured?: boolean;
}

export function CommitteeCard({ name, role, bio, imageUrl, linkedinUrl, email, index = 0, featured = false }: CommitteeCardProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("About");

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        variants={slideUpVariants}
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ y: -8 }}
        className={`group flex flex-col items-center text-center p-6 bg-card/80 backdrop-blur-md rounded-3xl shadow-soft hover:shadow-glass transition-all duration-500 border border-border/50 hover:border-accent/30 cursor-pointer w-full ${featured ? "md:p-8" : ""}`}
      >
        <Avatar className={`${featured ? "w-32 h-32 md:w-36 md:h-36" : "w-24 h-24"} mb-4 border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-500`}>
          <AvatarImage src={imageUrl} alt={name} className="object-cover" />
          <AvatarFallback className="bg-secondary text-accent font-serif text-2xl font-bold">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <h3 className={`font-serif ${featured ? "text-2xl" : "text-lg"} font-bold text-foreground mb-1`}>{name}</h3>
        <p className="text-xs font-semibold text-accent uppercase tracking-wider">{role}</p>
        <span className="mt-3 text-[11px] font-medium text-muted-foreground group-hover:text-accent transition-colors">
          {t("viewProfile")}
        </span>
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <div className="flex flex-col items-center text-center gap-4 pt-2">
              <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                <AvatarImage src={imageUrl} alt={name} className="object-cover" />
                <AvatarFallback className="bg-secondary text-accent font-serif text-2xl font-bold">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="font-serif text-2xl font-bold text-foreground">{name}</DialogTitle>
                <p className="text-sm font-semibold text-accent uppercase tracking-wider mt-1">{role}</p>
              </div>
            </div>
          </DialogHeader>

          <p className="text-muted-foreground text-sm leading-relaxed text-left max-h-[40vh] overflow-y-auto">
            {bio}
          </p>

          {(linkedinUrl || email) && (
            <div className="flex items-center justify-center gap-4 pt-2">
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent hover:bg-primary hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
