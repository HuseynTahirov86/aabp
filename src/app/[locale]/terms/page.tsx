import { useTranslations } from 'next-intl';
import { Section } from '@/components/shared/Section';

export default function TermsPage() {
  const t = useTranslations('Terms');

  return (
    <main className="flex min-h-screen flex-col bg-background pt-8">
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto py-16 px-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-10 text-primary border-b pb-6">
            {t('title')}
          </h1>
          
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">{t('sec1Title')}</h2>
              <p>{t('sec1Desc')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">{t('sec2Title')}</h2>
              <p>{t('sec2Desc')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">{t('sec3Title')}</h2>
              <p>{t('sec3Desc')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">{t('sec4Title')}</h2>
              <p>{t('sec4Desc')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">{t('sec5Title')}</h2>
              <p>{t('sec5Desc')}</p>
            </section>
          </div>
        </div>
      </Section>
    </main>
  );
}
