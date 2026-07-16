"use client";

import { motion } from "framer-motion";
import { slideUpVariants } from "@/motion/slide";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 py-4">
      {events.map((event, index) => (
        <motion.div
          key={index}
          variants={slideUpVariants}
          custom={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 ml-8 md:ml-12 relative"
        >
          {/* Node dot */}
          <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-5 h-5 rounded-full border-4 border-white bg-accent shadow-sm" />
          
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-soft hover:shadow-glass transition-shadow border border-border/50">
            <span className="inline-block py-1 px-3 rounded-full bg-secondary text-primary text-sm font-bold tracking-widest mb-4">
              {event.year}
            </span>
            <h3 className="font-serif text-2xl font-bold text-primary mb-3">
              {event.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
