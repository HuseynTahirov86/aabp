import { Hero } from '@/components/shared/Hero';
import { Section, SectionHeader } from '@/components/shared/Section';
import { Timeline } from '@/components/shared/data-display/Timeline';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function HistoryPage() {
  const t = useTranslations('About');
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
        title={t('history')}
        subtitle={t('historySubtitle')}
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader 
              title={t('journeyTitle')}
              subtitle={t('historyLabel')}
              className="mb-6"
            />
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              The Association of Azerbaijani British Professionals began as a small initiative in London to connect local experts, and has since blossomed into a global powerhouse representing thousands of professionals across various sectors.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Our growth is a testament to the dedication of our members and the enduring bonds between the UK and Azerbaijan. Below is a timeline of our most significant milestones.
            </p>
          </div>
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="History of AABP" 
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section className="bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <Timeline events={historyEvents} />
        </div>
      </Section>
    </main>
  );
}
