"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import { slideUpVariants } from "@/motion/slide";
import { ArrowRight, Calendar, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/firebase/useAuth";
import { registerForEvent } from "@/lib/firebase/db-events";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  category: string;
  imageUrl?: string;
  index?: number;
  id?: string;
}

export function EventCard({ id, title, date, location, category, imageUrl, index = 0 }: EventCardProps) {
  const { user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = async () => {
    if (!id) return;
    if (!user) {
      toast.error("Please login to register for events");
      return;
    }
    
    setIsRegistering(true);
    try {
      await registerForEvent(id, user.uid);
      setRegistered(true);
      toast.success("Successfully registered!");
    } catch (error) {
      const e = error as Error;
      if (e.message === "Already registered") {
        setRegistered(true);
        toast.info("You are already registered for this event.");
      } else {
        toast.error("Failed to register. Please try again.");
      }
    } finally {
      setIsRegistering(false);
    }
  };
  return (
    <motion.div
      variants={slideUpVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      className="group flex flex-col bg-card/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-soft hover:shadow-glass transition-all duration-500 border border-border/50 hover:border-accent/40 hover:shadow-[0_0_20px_rgba(183,152,74,0.08)]"
    >
      {/* Image Area */}
      <div className="relative h-48 w-full bg-secondary overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
        )}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-foreground uppercase tracking-wider shadow-sm">
          {category}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <Link href={`/events/${id}`}>
          <h3 className="font-serif text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="w-4 h-4 text-accent" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-between hover:bg-secondary/50 text-foreground group-hover:text-accent transition-colors"
            onClick={handleRegister}
            disabled={isRegistering || registered}
          >
            {isRegistering ? <Loader2 className="w-4 h-4 animate-spin" /> : registered ? "Registered" : "Register Now"}
            {!isRegistering && !registered && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
