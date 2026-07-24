"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { getResearchById, AABPResearch } from '@/lib/firebase/db-research';
import { Loader2, ArrowLeft, Calendar, User, Tag, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function ResearchDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const [research, setResearch] = useState<AABPResearch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResearch = async () => {
      if (params.id && typeof params.id === 'string') {
        const data = await getResearchById(params.id);
        setResearch(data);
      }
      setIsLoading(false);
    };
    fetchResearch();
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </main>
    );
  }

  if (!research) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background pt-8">
        <h1 className="text-3xl font-serif text-primary mb-4">Research not found</h1>
        <Button variant="outline" onClick={() => router.push('/research')}>Return to Research Hub</Button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={research.title}
        subtitle={research.field}
        backgroundImage="https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <Section className="bg-card">
        <div className="max-w-4xl mx-auto">
          <Link href="/research" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Research Hub
          </Link>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-10 pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {research.date}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {research.authors.join(', ')}
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {research.field}
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-foreground mb-12">
            <h3 className="text-2xl font-serif font-bold mb-4">Abstract</h3>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {research.abstract}
            </p>
          </div>

          <div className="flex justify-center border-t border-border pt-10">
            {research.link ? (
              <a href={research.link} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full bg-accent text-white hover:bg-accent/90 h-14 px-10 text-lg">
                  Read Full Publication <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </a>
            ) : (
              <p className="text-muted-foreground italic">Full publication link not available.</p>
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}
