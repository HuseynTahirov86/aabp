"use client";

import { useEffect, useState } from "react";
import { Hero } from '@/components/shared/Hero';
import { Section, SectionHeader } from '@/components/shared/Section';
import { useTranslations } from 'next-intl';
import { getProjects, AABPProject } from '@/lib/firebase/db-projects';
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ProjectsPage() {
  const t = useTranslations('Research');
  const [projects, setProjects] = useState<AABPProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects(100);
      setProjects(data.filter(p => p.status === 'Published'));
      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('projectsTitle')}
        subtitle={t('projectsSubtitle')}
        backgroundImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <Section className="bg-card">
        <SectionHeader 
          title={t('ongoingProjects')}
          subtitle={t('collaborations')}
          centered
        />
        <div className="max-w-6xl mx-auto py-12">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-8">
                {t('projectsDesc')}
              </p>
              <div className="bg-secondary/30 p-8 rounded-2xl border border-border inline-block">
                <h3 className="text-xl font-semibold text-primary mb-2">{t('newProjects')}</h3>
                <p className="text-muted-foreground">{t('stayTuned')}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Card key={project.id} className="shadow-sm border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  {project.imageUrl ? (
                    <div className="w-full h-48 bg-muted overflow-hidden relative">
                      <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-secondary/50 flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-10 h-10 opacity-20" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground line-clamp-2">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3" /> 
                      {project.createdAt ? new Date(project.createdAt.toDate?.() || project.createdAt).toLocaleDateString() : 'Recent'}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {project.summary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
