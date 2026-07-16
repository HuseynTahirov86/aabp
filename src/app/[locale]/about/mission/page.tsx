import Image from "next/image";
import { Hero } from '@/components/shared/Hero';
import { Section, SectionHeader } from '@/components/shared/Section';
import { useTranslations } from 'next-intl';
import { Target, Lightbulb, Users, Globe } from "lucide-react";

export default function MissionPage() {
  const t = useTranslations('About');
  
  const values = [
    {
      icon: Target,
      title: "Excellence",
      desc: "Striving for the highest standards in professional and academic achievements."
    },
    {
      icon: Users,
      title: "Collaboration",
      desc: "Fostering teamwork and partnerships between the UK and Azerbaijan."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      desc: "Encouraging forward-thinking ideas and solutions across all industries."
    },
    {
      icon: Globe,
      title: "Global Impact",
      desc: "Building a network that transcends borders and makes a worldwide difference."
    }
  ];

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('missionVision')}
        subtitle={t('buildingBridges')}
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />
      
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <SectionHeader 
              title={t('buildingBridges')}
              subtitle={t('ourVision')}
              className="mb-8"
            />
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t('missionP1')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('missionP2')}
            </p>
          </div>
          <div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-glass border border-border/50">
            <Image 
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Team collaboration" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
              <h3 className="text-2xl font-serif font-bold text-white max-w-sm">
                Empowering the next generation of leaders.
              </h3>
            </div>
          </div>
        </div>

        {/* Core Values Bento Grid */}
        <div className="mt-12">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-3">Core Values</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary">What Drives Us Forward</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="p-8 rounded-3xl bg-secondary/30 hover:bg-secondary/50 border border-border/50 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mb-6 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-3">{value.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>
    </main>
  );
}
