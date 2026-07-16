"use client";

import { useEffect, useState } from "react";
import { Hero } from '@/components/shared/Hero';
import { Section, SectionHeader } from '@/components/shared/Section';
import { CommitteeCard } from '@/components/shared/cards/CommitteeCard';
import { getCommitteeMembers, AABPCommitteeMember } from '@/lib/firebase/db-committee';
import { Loader2 } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function LeadershipPage() {
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

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('leadership')}
        subtitle={t('execCommittee')}
        backgroundImage="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <SectionHeader 
            title={t('execCommittee')}
            subtitle={t('ourLeaders')}
            centered
            className="mb-6"
          />
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Executive Committee is the driving force behind AABP, responsible for setting our strategic direction, organizing our flagship events, and ensuring that our members receive the highest quality of professional support. Comprising leaders from diverse sectors, our committee is united by a shared dedication to fostering excellence.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : committeeMembers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('noCommittee')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {committeeMembers.map((member, i) => (
              <CommitteeCard 
                key={member.id || i} 
                name={member.name} 
                role={member.role || t('committeeMember')} 
                bio={member.bio || ""} 
                imageUrl={member.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
                index={i} 
              />
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
