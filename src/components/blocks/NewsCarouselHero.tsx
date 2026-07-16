"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

import { getArticles } from "@/lib/firebase/db-articles";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
  link: string;
}

const FALLBACK_NEWS = [
  {
    id: "aabp-launch",
    title: "Association of Azerbaijani British Professionals — Connecting Talent Across Borders",
    category: "About",
    date: "2024-01-01",
    description:
      "AABP was founded to bridge the gap between Azerbaijani and British professionals across medical science, natural science, life science, social science, and engineering. Join our growing network today.",
    image: "/hero-1.jpg",
    link: "/about",
  },
  {
    id: "aabp-membership",
    title: "Apply for AABP Membership — Build Your Professional Network",
    category: "Membership",
    date: "2024-06-01",
    description:
      "Become part of an elite community of professionals, academics, and industry leaders bridging the UK and Azerbaijan. AABP members gain access to exclusive events, career opportunities, and research collaborations.",
    image: "/hero-2.jpg",
    link: "/auth/register",
  },
];

export function NewsCarouselHero() {
  const t = useTranslations("Index");
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const articles = await getArticles();
        const publishedArticles = articles.filter(a => a.status === 'Published').slice(0, 5);
        
        if (publishedArticles.length > 0) {
          const formattedNews = publishedArticles.map(a => ({
            id: a.id || `news-${Math.random()}`,
            title: a.title,
            category: "News",
            date: a.createdAt ? new Date(a.createdAt.toDate?.() || a.createdAt).toLocaleDateString() : 'Recent',
            description: a.summary || '',
            image: a.imageUrl || "https://images.unsplash.com/photo-1540575467063-1126a7081aaf?q=80&w=2070&auto=format&fit=crop",
            link: `/media/${a.id || ''}`,
          }));
          setNewsList(formattedNews);
        } else {
          setNewsList(FALLBACK_NEWS);
        }
      } catch (error) {
        console.error("Error fetching news for hero:", error);
        setNewsList(FALLBACK_NEWS);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (isLoading || newsList.length === 0) {
    return <div className="w-full h-[100vh] min-h-[750px] bg-primary animate-pulse" />;
  }

  return (
    <div className="relative w-full h-[100vh] min-h-[750px] overflow-hidden bg-primary group/hero">
      {/* Embla Viewport */}
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {newsList.map((news, index) => (
            <div 
              key={news.id} 
              className="relative min-w-full h-full flex-[0_0_100%]"
            >
              {/* Background Image with Slow Zoom (Ken Burns effect) */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image 
                  src={news.image} 
                  alt={news.title}
                  fill
                  className={cn(
                    "object-cover transition-transform ease-out",
                    index === selectedIndex ? "scale-110 duration-[15000ms]" : "scale-100 duration-1000"
                  )}
                />
                {/* Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Content Layer (Animated) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col pt-[180px] pb-[100px]">
        <div className="container mx-auto px-6 w-full my-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl pointer-events-auto"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-4 md:mb-5 shadow-xl"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(183,152,74,0.8)]" />
                {newsList[selectedIndex].category}
                <span className="text-white/60 mx-1">•</span>
                <span className="text-white/80">{newsList[selectedIndex].date}</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif font-bold text-white leading-[1.1] mb-4 md:mb-6 drop-shadow-2xl text-[clamp(2.5rem,5vh+1vw,4.5rem)]"
              >
                {newsList[selectedIndex].title}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/90 max-w-2xl leading-relaxed font-light drop-shadow-md mb-6 md:mb-8 text-[clamp(1.125rem,2vh+0.5vw,1.5rem)]"
              >
                {newsList[selectedIndex].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  render={<Link href={newsList[selectedIndex].link} />}
                  className="h-14 px-8 rounded-full bg-accent text-white hover:bg-accent/90 text-lg font-medium group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(183,152,74,0.4)]"
                >
                  Read Full Story
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  render={<Link href="/register" />}
                  variant="outline"
                  className="h-14 px-8 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-primary text-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  {t('applyMembership')}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-0 right-0 pointer-events-none">
        <div className="container mx-auto px-6 relative flex items-center justify-between pointer-events-auto">
          
          {/* Empty div to balance flex-between */}
          <div className="w-[100px] hidden md:block"></div>

          {/* Centered Premium Progress Indicators */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-black/20 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full shadow-2xl">
            {newsList.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`relative h-2 rounded-full transition-all duration-500 ease-out flex items-center justify-center ${
                  index === selectedIndex 
                    ? "w-8" 
                    : "w-2 bg-white/30 hover:bg-white/60 hover:scale-110"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === selectedIndex && (
                  <motion.div
                    layoutId="activeCarouselIndicator"
                    className="absolute inset-0 bg-accent rounded-full shadow-[0_0_10px_rgba(183,152,74,0.8)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300 focus:outline-none shadow-xl"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300 focus:outline-none shadow-xl"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
