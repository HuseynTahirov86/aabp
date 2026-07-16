"use client";

import { motion } from "framer-motion";
import { slideUpVariants } from "@/motion/slide";
import { Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommitteeCardProps {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  linkedinUrl?: string;
  email?: string;
  index?: number;
}

export function CommitteeCard({ name, role, bio, imageUrl, linkedinUrl, email, index = 0 }: CommitteeCardProps) {
  return (
    <motion.div
      variants={slideUpVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      className="group flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-soft hover:shadow-glass transition-all duration-500 border border-border/50 hover:border-accent/30"
    >
      <Avatar className="w-32 h-32 mb-6 border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-500">
        <AvatarImage src={imageUrl} alt={name} className="object-cover" />
        <AvatarFallback className="bg-secondary text-primary font-serif text-2xl font-bold">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <h3 className="font-serif text-xl font-bold text-primary mb-1">{name}</h3>
      <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">{role}</p>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        {bio}
      </p>
      
      <div className="mt-auto flex items-center justify-center gap-4">
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
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
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
