"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Hero } from '@/components/shared/Hero';
import { Section, SectionHeader } from '@/components/shared/Section';
import { CommitteeCard } from '@/components/shared/cards/CommitteeCard';
import { Timeline } from '@/components/shared/data-display/Timeline';
import { getCommitteeMembers, AABPCommitteeMember } from '@/lib/firebase/db-committee';
import { Loader2 } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('About');
  const [committeeMembers, setCommitteeMembers] = useState<AABPCommitteeMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommittee = async () => {
      const data = await getCommitteeMembers();
      setCommitteeMembers(data);
      setIsLoading(false);
    };
    fetchCommittee();
  }, []);

  const historyEvents = [
    {
      year: "2015",
      title: t('event1Title'),
      description: t('event1Desc')
    },
    {
      year: "2018",
      title: t('event2Title'),
      description: t('event2Desc')
    },
    {
      year: "2021",
      title: t('event3Title'),
      description: t('event3Desc')
    },
    {
      year: "2026",
      title: t('event4Title'),
      description: t('event4Desc')
    }
  ];

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('title')}
        subtitle={t('subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      {/* Mission & Vision */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader 
              title={t('visionTitle')}
              subtitle={t('visionSubtitle')}
              className="mb-8"
            />
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t('visionDesc1')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('visionDesc2')}
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-glass">
            <Image 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Team collaboration" 
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* History Timeline */}
      <Section className="bg-secondary/30">
        <SectionHeader 
          title={t('journeyTitle')}
          subtitle={t('journeySubtitle')}
          centered
        />
        <div className="max-w-3xl mx-auto">
          <Timeline events={historyEvents} />
        </div>
      </Section>

      {/* Committee */}
      <Section className="bg-white">
        <SectionHeader 
          title={t('committeeTitle')}
          subtitle={t('committeeSubtitle')}
          centered
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : committeeMembers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('committeeEmpty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {committeeMembers.map((member, i) => (
              <CommitteeCard key={member.id || i} name={member.name} role={member.role || "Committee Member"} bio={member.bio || ""} imageUrl={member.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} index={i} />
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
