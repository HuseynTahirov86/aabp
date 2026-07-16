"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { getArticleById, AABPArticle } from '@/lib/firebase/db-articles';
import { MOCK_ARTICLES } from '@/lib/mock/articles';
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export default function ArticlePage() {
  const t = useTranslations('Media');
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<AABPArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (params.id && typeof params.id === 'string') {
        let data = await getArticleById(params.id);
        if (!data) {
          data = MOCK_ARTICLES.find(a => a.id === params.id) || null;
        }
        setArticle(data);
      }
      setIsLoading(false);
    };
    fetchArticle();
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background pt-8">
        <h1 className="text-3xl font-serif text-primary mb-4">{t('notFound')}</h1>
        <Button variant="outline" onClick={() => router.push('/media')}>{t('returnToMedia')}</Button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={article.title}
        subtitle=""
        backgroundImage={article.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"}
      />
      
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto">
          <Link href="/media" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('backToNews')}
          </Link>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-10 pb-6 border-b border-border">
            {article.authorName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" /> {article.authorName}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {article.createdAt ? new Date(article.createdAt.toDate?.() || article.createdAt).toLocaleDateString() : 'Recent'}
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none text-primary" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </Section>
    </main>
  );
}
