"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Hero } from '@/components/shared/Hero';
import { Section, SectionHeader } from '@/components/shared/Section';
import { CommitteeCard } from '@/components/shared/cards/CommitteeCard';
import { getCommitteeMembers, splitFeaturedPresident, AABPCommitteeMember } from '@/lib/firebase/db-committee';
import { Loader2, AlertTriangle } from "lucide-react";
import { useTranslations } from 'next-intl';

export function AboutClient() {
  const t = useTranslations('About');
  const [committeeMembers, setCommitteeMembers] = useState<AABPCommitteeMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        const data = await getCommitteeMembers();
        setCommitteeMembers(data);
      } catch {
        setError("Failed to load committee members. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommittee();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('title')}
        subtitle={t('subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <Section className="bg-card border-b">
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center">
          {t('introText')}
        </p>
      </Section>

      {/* Mission & Vision */}
      <Section className="bg-card">
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
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Committee */}
      <Section className="bg-card">
        <SectionHeader
          title={t('committeeTitle')}
          subtitle={t('committeeSubtitle')}
          centered
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : committeeMembers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('committeeEmpty')}
          </div>
        ) : (
          (() => {
            const { president, rest } = splitFeaturedPresident(committeeMembers);
            return (
              <div className="max-w-6xl mx-auto">
                {president && (
                  <div className="flex justify-center mb-8">
                    <div className="w-full max-w-xs">
                      <CommitteeCard
                        key={president.id}
                        name={president.name}
                        role={president.role || "Committee Member"}
                        bio={president.bio || ""}
                        imageUrl={president.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                        index={0}
                        featured
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {rest.map((member, i) => (
                    <CommitteeCard key={member.id || i} name={member.name} role={member.role || "Committee Member"} bio={member.bio || ""} imageUrl={member.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} index={i + 1} />
                  ))}
                </div>
              </div>
            );
          })()
        )}
      </Section>
    </main>
  );
}
