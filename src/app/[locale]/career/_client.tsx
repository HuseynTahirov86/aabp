"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/shared/Hero";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Building, ExternalLink, Loader2 } from "lucide-react";
import { getJobs, AABPJob } from "@/lib/firebase/db-jobs";
import { useTranslations } from 'next-intl';

export function CareerClient() {
  const t = useTranslations('Career');
  const [jobs, setJobs] = useState<AABPJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await getJobs();
      setJobs(data);
      setIsLoading(false);
    };
    fetchJobs();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('title')}
        subtitle={t('subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      <Section className="bg-secondary/10 pt-10 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">{t('noJobs')}</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="shadow-sm border-border hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <CardTitle className="text-xl font-bold text-primary mb-1">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.type}</span>
                    </div>
                  </div>
                  <a href={job.link} target="_blank" rel="noopener noreferrer">
                    <Button className="mt-4 md:mt-0 rounded-full bg-accent text-white hover:bg-accent/90">
                      {t('applyNow')} <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{job.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
