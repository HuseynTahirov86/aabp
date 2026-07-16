import { useTranslations } from 'next-intl';
import { NewsCarouselHero } from '@/components/blocks/NewsCarouselHero';
import { Section, SectionHeader } from '@/components/shared/Section';
import { HomeEvents } from '@/components/blocks/home-events';
import { HomeResearch } from '@/components/blocks/home-research';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { ArrowRight, Mail } from 'lucide-react';
import { ParticlesBg } from '@/components/blocks/ParticlesBg';
import { StatsSection } from '@/components/blocks/StatsSection';
import { MagneticElement } from '@/components/ui/MagneticElement';

export default function Home() {
  const t = useTranslations('Index');

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <NewsCarouselHero />
      
      {/* Mission Section */}
      <Section className="bg-card">
        <SectionHeader 
          title={t('empoweringTitle')}
          subtitle={t('ourMission')}
          centered
        />
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            {t('description')}
          </p>
          <MagneticElement>
            <Button render={<Link href="/about" />} variant="outline" className="rounded-full px-8 h-12 group transition-all">
              {t('learnAbout')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </MagneticElement>
        </div>
      </Section>

      {/* Statistics */}
      <StatsSection />

      {/* Featured Events */}
      <Section className="bg-secondary/30">
        <HomeEvents />
      </Section>

      {/* Latest Research */}
      <Section className="bg-card">
        <HomeResearch />
      </Section>

      {/* CTA Section */}
      <Section className="relative bg-primary text-white overflow-hidden" animate={false}>
        <ParticlesBg />
        <div className="relative max-w-4xl mx-auto text-center py-12 z-10">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            {t('readyToJoin')}
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            {t('ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticElement>
              <Button render={<Link href="/register" />} size="lg" className="bg-accent text-white hover:bg-accent/90 rounded-full h-14 px-8 text-lg group transition-all w-full">
                {t('applyMembership')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </MagneticElement>
            <a href="mailto:contact@aabporg.uk">
              <MagneticElement>
                <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg bg-white text-primary hover:bg-gray-100 border-none group transition-all">
                  {t('contactUs')}
                  <Mail className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                </Button>
              </MagneticElement>
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
