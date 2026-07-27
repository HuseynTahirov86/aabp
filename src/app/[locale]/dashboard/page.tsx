"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Section } from "@/components/shared/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, FileText, User, Settings, LogOut, Loader2, MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/firebase/useAuth";
import { getUserEvents, AABPEvent } from "@/lib/firebase/db-events";
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const { user, userData, loading, logout } = useAuth();
  const [userEvents, setUserEvents] = useState<AABPEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [publicationsCount, setPublicationsCount] = useState(0);
  const [networkCount, setNetworkCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && userData) {
      const fetchDashboardData = async () => {
        // Fetch events
        const events = await getUserEvents(user.uid);
        setUserEvents(events);
        setEventsLoading(false);
        
        // Dynamic stats
        const { getResearch } = await import('@/lib/firebase/db-research');
        
        const allResearch = await getResearch();
        const myResearch = allResearch.filter(r => 
          r.authors.some(a => a.toLowerCase().includes(userData.firstName.toLowerCase()) || 
                              a.toLowerCase().includes(userData.lastName.toLowerCase()))
        );
        setPublicationsCount(myResearch.length);
        
        const { getPublicUsersCount } = await import('@/lib/firebase/db-users');
        const count = await getPublicUsersCount();
        setNetworkCount(Math.max(0, count - 1)); // Exclude self
      };
      fetchDashboardData();
    }
  }, [user, userData]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-secondary/20 pt-32 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </main>
    );
  }

  const firstName = userData?.firstName || user.displayName?.split(" ")[0] || "Member";

  return (
    <main className="min-h-screen bg-secondary/20 pt-8 pb-12">
      <Section className="py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold font-serif text-foreground mb-2">{t('title')}</h1>
            <p className="text-foreground/70 text-lg">{t('welcome', { name: firstName })}</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {userData?.role === 'ADMIN' || userData?.role === 'SUPER_ADMIN' ? (
              <Link href="/admin" passHref>
                <Button variant="outline" className="rounded-full bg-primary text-white hover:bg-primary/90 hover:text-white">
                  Admin Panel
                </Button>
              </Link>
            ) : null}
            <Link href="/dashboard/settings" passHref>
              <Button variant="outline" className="rounded-full">
                <Settings className="w-4 h-4 mr-2" />
                {t('settings')}
              </Button>
            </Link>
            <Button variant="destructive" className="rounded-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Quick Stat Cards */}
          <Card className="shadow-sm border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">{t('myEvents')}</CardTitle>
              <Calendar className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{eventsLoading ? "-" : userEvents.length}</div>
              <p className="text-xs text-foreground/60 mt-1">{t('upcomingEvents')}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">{t('publications')}</CardTitle>
              <FileText className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{publicationsCount}</div>
              <p className="text-xs text-foreground/60 mt-1">{t('foundMatches')}</p>
            </CardContent>
          </Card>

          <Link href="/dashboard/network" className="block group">
            <Card className="shadow-sm border-border transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full cursor-pointer bg-card/80 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                  {t('network')}
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accent" />
                </CardTitle>
                <User className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-2xl font-bold text-foreground">{networkCount}</div>
                <p className="text-xs text-foreground/60 mt-1">{t('connectionsMade')}</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="shadow-sm border-border bg-primary text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/80">{t('membershipStatus')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{t('active')}</div>
              <p className="text-xs text-white/60 mt-1">{t('role', { role: userData?.role || 'Member' })}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold font-serif text-foreground mb-6">{t('recentActivity')}</h2>
            {eventsLoading ? (
               <div className="grid gap-4">
                 <Skeleton className="h-24 w-full rounded-xl" />
                 <Skeleton className="h-24 w-full rounded-xl" />
               </div>
            ) : userEvents.length === 0 ? (
              <Card className="shadow-sm border-border p-8 text-center text-foreground/60 bg-card/80">
                <p>{t('noRecentEvents')}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/events')}>{t('browseEvents')}</Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userEvents.map(ev => (
                  <Card key={ev.id} className="shadow-sm border-border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-all duration-300 group bg-card/80">
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">{ev.title}</h4>
                      <p className="text-sm text-foreground/60 flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" /> {ev.date} | <MapPin className="w-3 h-3 ml-2" /> {ev.location}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 sm:mt-0 group-hover:border-accent group-hover:text-accent transition-colors" onClick={() => router.push(`/events/${ev.id}`)}>{t('viewEvent')}</Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold font-serif text-foreground mb-6">{t('quickLinks')}</h2>
            <div className="bg-card/80 p-6 rounded-2xl shadow-sm border border-border flex flex-col gap-3">
              <a href="mailto:research@aabporg.uk" className="w-full">
                <Button variant="ghost" className="justify-start w-full text-foreground hover:text-accent hover:bg-secondary group transition-all">
                  {t('submitResearch')}
                  <ArrowRight className="ml-auto w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                </Button>
              </a>
              <Link href="/career" passHref className="w-full">
                <Button variant="ghost" className="justify-start w-full text-foreground hover:text-accent hover:bg-secondary group transition-all">
                  {t('findCareer')}
                  <ArrowRight className="ml-auto w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                </Button>
              </Link>
              <Link href="/dashboard/mentorship" passHref className="w-full">
                <Button variant="ghost" className="justify-start w-full text-foreground hover:text-accent hover:bg-secondary group transition-all">
                  Mentorship
                  <ArrowRight className="ml-auto w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                </Button>
              </Link>
              <Link href="/resources" passHref className="w-full">
                <Button variant="ghost" className="justify-start w-full text-foreground hover:text-accent hover:bg-secondary group transition-all">
                  Resource Library
                  <ArrowRight className="ml-auto w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                </Button>
              </Link>
              <Link href="/forum" passHref className="w-full">
                <Button variant="ghost" className="justify-start w-full text-foreground hover:text-accent hover:bg-secondary group transition-all">
                  Forum
                  <ArrowRight className="ml-auto w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                </Button>
              </Link>
              <Link href="/dashboard/settings" passHref className="w-full">
                <Button variant="ghost" className="justify-start w-full text-foreground hover:text-accent hover:bg-secondary group transition-all">
                  {t('updateProfile')}
                  <ArrowRight className="ml-auto w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                </Button>
              </Link>
              <a href="mailto:contact@aabporg.uk" className="w-full">
                <Button variant="ghost" className="justify-start w-full text-foreground hover:text-accent hover:bg-secondary group transition-all">
                  {t('contactSupport')}
                  <ArrowRight className="ml-auto w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
