"use client";

import { useEffect, useState } from 'react';
import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { EventCard } from '@/components/shared/cards/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { getEvents, AABPEvent } from '@/lib/firebase/db-events';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

export default function EventsPage() {
  const t = useTranslations('Events');
  const [allEvents, setAllEvents] = useState<AABPEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchPublicEvents = async () => {
      const data = await getEvents(true); // Fetch only published events
      setAllEvents(data);
      setIsLoading(false);
    };
    fetchPublicEvents();
  }, []);

  const categories = ["All", ...Array.from(new Set(allEvents.map(e => e.category).filter(Boolean)))];

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || 
                          event.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('title')}
        subtitle={t('subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <Section className="bg-secondary/20 pt-10">
        {/* Filter / Search Bar */}
        <div className="max-w-4xl mx-auto mb-16 bg-white p-4 rounded-2xl shadow-glass flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              type="text" 
              placeholder={t('search')} 
              className="pl-12 h-14 rounded-xl border-border bg-muted/30 focus-visible:ring-accent text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {categories.map(cat => (
              <Button 
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"} 
                className={`rounded-xl h-14 px-6 ${selectedCategory === cat ? 'bg-primary' : ''}`} 
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "All" ? t('all') : cat}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-[350px] w-full rounded-2xl" />
            <Skeleton className="h-[350px] w-full rounded-2xl" />
            <Skeleton className="h-[350px] w-full rounded-2xl" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {t('noEvents')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, i) => (
              <EventCard key={event.id || i} {...event} index={i} />
            ))}
          </div>
        )}
        
      </Section>
    </main>
  );
}
