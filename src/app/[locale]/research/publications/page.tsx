"use client";

import { useEffect, useState } from "react";
import { Hero } from '@/components/shared/Hero';
import { Section, SectionHeader } from '@/components/shared/Section';
import { ResearchCard } from '@/components/shared/cards/ResearchCard';
import { getResearch, AABPResearch } from '@/lib/firebase/db-research';
import { Loader2 } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function PublicationsPage() {
  const t = useTranslations('Research');
  const [publications, setPublications] = useState<AABPResearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      const data = await getResearch();
      setPublications(data);
      setIsLoading(false);
    };
    fetchPublications();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('publicationsTitle')}
        subtitle={t('publicationsSubtitle')}
        backgroundImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <Section className="bg-card">
        <SectionHeader 
          title={t('recentPubs')}
          subtitle={t('networkOutput')}
          centered
        />
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : publications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('noPubs')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {publications.map((item, i) => (
              <ResearchCard 
                key={item.id || i} 
                title={item.title}
                abstract={item.abstract}
                authors={item.authors}
                field={item.field}
                date={item.date}
                link={item.link}
                index={i} 
              />
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
