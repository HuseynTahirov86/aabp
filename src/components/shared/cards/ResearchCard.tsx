"use client";

import { motion } from "framer-motion";
import { slideUpVariants } from "@/motion/slide";
import { FileText, ExternalLink, Users } from "lucide-react";

import { Link } from "@/i18n/routing";

interface ResearchCardProps {
  id?: string;
  title: string;
  abstract: string;
  authors: string[];
  field: string;
  date: string;
  link?: string;
  index?: number;
}

export function ResearchCard({ id, title, abstract, authors, field, date, link, index = 0 }: ResearchCardProps) {
  return (
    <motion.div
      variants={slideUpVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group relative bg-white p-6 md:p-8 rounded-2xl shadow-soft hover:shadow-glass transition-all duration-300 border border-border/50"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-accent uppercase tracking-wider">{field}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      
      {id ? (
        <Link href={`/research/${id}`}>
          <h3 className="font-serif text-xl font-bold text-primary mb-4 leading-snug group-hover:text-primary/80 transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
      ) : (
        <h3 className="font-serif text-xl font-bold text-primary mb-4 leading-snug group-hover:text-primary/80 transition-colors">
          {title}
        </h3>
      )}
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
        {abstract}
      </p>
      
      <div className="flex items-center gap-2 text-sm text-primary/80 font-medium mb-6">
        <Users className="w-4 h-4 text-accent" />
        <span className="line-clamp-1">{authors.join(", ")}</span>
      </div>
      
      {link && (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
        >
          <FileText className="w-4 h-4" />
          Read Publication
          <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
        </a>
      )}
    </motion.div>
  );
}
