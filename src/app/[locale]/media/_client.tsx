"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { Hero } from '@/components/shared/Hero';
import { Section, SectionHeader } from '@/components/shared/Section';
import { getArticles, AABPArticle } from '@/lib/firebase/db-articles';
import { MOCK_ARTICLES } from '@/lib/mock/articles';
import { Loader2, AlertTriangle, Calendar } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from 'next-intl';

export function MediaClient() {
  const t = useTranslations('Media');
  const [articles, setArticles] = useState<AABPArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let data = await getArticles();
        if (data.length === 0) {
          data = MOCK_ARTICLES;
        }
        setArticles(data.filter(a => a.status === 'Published'));
      } catch {
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('title')}
        subtitle={t('subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <Section className="bg-card">
        <SectionHeader
          title={t('latestNews')}
          subtitle={t('updates')}
          centered
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('noNews')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {articles.map((article) => (
              <Card key={article.id} className="shadow-sm border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                {article.imageUrl && (
                  <div className="w-full h-48 bg-muted overflow-hidden">
                    <Image src={article.imageUrl} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl text-foreground line-clamp-2">
                    <Link href={`/media/${article.id}`} className="hover:text-accent transition-colors">
                      {article.title}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Calendar className="w-3 h-3" />
                    {article.createdAt ? new Date(article.createdAt.toDate?.() || article.createdAt).toLocaleDateString() : 'Recent'}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {article.summary}
                  </p>
                  <Link href={`/media/${article.id}`} className="text-sm font-semibold text-accent hover:underline">
                    {t('readMore')} &rarr;
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
