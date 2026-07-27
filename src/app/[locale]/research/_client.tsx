"use client";

import { useEffect, useState } from 'react';
import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { ResearchCard } from '@/components/shared/cards/ResearchCard';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { getResearch, AABPResearch } from '@/lib/firebase/db-research';
import { useTranslations } from 'next-intl';

export function ResearchClient() {
  const t = useTranslations('Research');
  const [researchList, setResearchList] = useState<AABPResearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string>("All Fields");

  useEffect(() => {
    const fetchAllResearch = async () => {
      try {
        const data = await getResearch();
        setResearchList(data);
      } catch {
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllResearch();
  }, []);

  const fields = ["All Fields", ...Array.from(new Set(researchList.map(item => item.field)))];

  const filteredResearch = selectedField === "All Fields"
    ? researchList
    : researchList.filter(item => item.field === selectedField);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('title')}
        subtitle={t('subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <Section className="bg-secondary/20 pt-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-card p-6 rounded-2xl shadow-soft sticky top-32 border border-border/50">
              <h3 className="font-serif font-bold text-xl text-foreground mb-6">{t('filterTitle')}</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">{t('byField')}</h4>
                  <div className="space-y-2 flex flex-col">
                    {fields.map(field => (
                      <Button
                        key={field}
                        variant="ghost"
                        className={`justify-start hover:text-accent ${selectedField === field ? 'font-medium text-accent bg-secondary/30' : 'font-normal text-muted-foreground'}`}
                        onClick={() => setSelectedField(field)}
                      >
                        {field}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Research List */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-foreground font-serif">
                {selectedField === "All Fields" ? t('latestPubs') : `${selectedField} ${t('pubs')}`}
                {!isLoading && ` (${filteredResearch.length})`}
              </h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : filteredResearch.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                {t('noPubs')}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredResearch.map((item, i) => (
                  <ResearchCard key={item.id || i} {...item} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}
