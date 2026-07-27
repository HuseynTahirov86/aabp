"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Section, SectionHeader } from "@/components/shared/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/firebase/useAuth";
import { getUserEvents, AABPEvent } from "@/lib/firebase/db-events";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';

export default function MyEventsPage() {
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userEvents, setUserEvents] = useState<AABPEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchEvents = async () => {
        const events = await getUserEvents(user.uid);
        setUserEvents(events);
        setEventsLoading(false);
      };
      fetchEvents();
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-secondary/20 pt-8 pb-12">
      <Section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('backToDashboard')}
          </Link>
          
          <SectionHeader 
            title={t('myRegisteredEvents')}
            subtitle={t('schedule')}
          />
          
          <div className="mt-8">
            {eventsLoading ? (
               <div className="grid gap-4">
                 <Skeleton className="h-32 w-full rounded-xl" />
                 <Skeleton className="h-32 w-full rounded-xl" />
               </div>
            ) : userEvents.length === 0 ? (
              <Card className="shadow-sm border-border p-12 text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>{t('noEventsYet')}</p>
                <Button variant="default" className="mt-6" onClick={() => router.push('/events')}>{t('browseUpcoming')}</Button>
              </Card>
            ) : (
              <div className="grid gap-6">
                {userEvents.map(ev => (
                  <Card key={ev.id} className="shadow-sm border-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h4 className="text-xl font-semibold text-foreground">{ev.title}</h4>
                      <p className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 mt-3">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {ev.date}</span>
                        <span className="hidden sm:inline">|</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {ev.location}</span>
                      </p>
                    </div>
                    <Button variant="outline" className="mt-4 md:mt-0" onClick={() => router.push(`/events/${ev.id}`)}>{t('viewDetails')}</Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}
