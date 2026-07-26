"use client";

import { useEffect, useState } from 'react';
import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { EventCard } from '@/components/shared/cards/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, Grid3X3, List } from 'lucide-react';
import { getEvents, AABPEvent } from '@/lib/firebase/db-events';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export function EventsClient() {
  const t = useTranslations('Events');
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [allEvents, setAllEvents] = useState<AABPEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const data = await getEvents(true);
        setAllEvents(data);
      } catch {
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicEvents();
  }, []);

  const categories = ["All", ...Array.from(new Set(allEvents.map(e => e.category).filter(Boolean)))];

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                          event.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const parseEventDate = (dateStr: string): Date | null => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const calendarEvents = allEvents.filter(e => parseEventDate(e.date) !== null);

  const getEventsForDate = (dateStr: string): AABPEvent[] => {
    return calendarEvents.filter(e => {
      const d = parseEventDate(e.date);
      if (!d) return false;
      return d.toDateString() === new Date(dateStr).toDateString();
    });
  };

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const prevMonth = () => setCalendarDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCalendarDate(new Date(year, month + 1, 1));

  const hasEventsOnDay = (day: number): boolean => {
    const dateStr = new Date(year, month, day).toDateString();
    return calendarEvents.some(e => {
      const d = parseEventDate(e.date);
      return d ? d.toDateString() === dateStr : false;
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title={t('title')}
        subtitle={t('subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <Section className="bg-secondary/20 pt-10">
        {/* Filter / Search Bar */}
        <div className="max-w-4xl mx-auto mb-8 bg-card p-4 rounded-2xl shadow-glass flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder={t('search')}
              className="pl-12 h-14 rounded-xl border-border bg-muted/30 focus-visible:ring-accent text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`rounded-xl h-14 px-6 ${selectedCategory === cat ? 'bg-primary' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "All" ? t('all') : cat}
              </Button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="max-w-4xl mx-auto mb-8 flex justify-end">
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-lg"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4 mr-2" /> List
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              className="rounded-lg"
              onClick={() => setViewMode("calendar")}
            >
              <Grid3X3 className="w-4 h-4 mr-2" /> Calendar
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-[350px] w-full rounded-2xl" />
            <Skeleton className="h-[350px] w-full rounded-2xl" />
            <Skeleton className="h-[350px] w-full rounded-2xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : viewMode === "calendar" ? (
          /* Calendar View */
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl shadow-glass p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-bold text-primary">
                  {monthNames[month]} {year}
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>&larr;</Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>&rarr;</Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} className="aspect-square rounded-lg" />;
                  const dateStr = new Date(year, month, day).toDateString();
                  const hasEvents = hasEventsOnDay(day);
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : hasEvents
                          ? 'bg-accent/15 text-accent hover:bg-accent/25 font-semibold'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <span>{day}</span>
                      {hasEvents && <span className="w-1.5 h-1.5 rounded-full bg-accent mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              {selectedDate && getEventsForDate(selectedDate).length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                    Events on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h4>
                  <div className="space-y-2">
                    {getEventsForDate(selectedDate).map(e => (
                      <Link
                        key={e.id}
                        href={`/events/${e.id}`}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-sm">{e.title}</p>
                          <p className="text-xs text-muted-foreground">{e.location}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{e.category}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && getEventsForDate(selectedDate).length === 0 && (
                <div className="mt-4 pt-4 border-t border-border text-center text-sm text-muted-foreground">
                  No events on this date.
                </div>
              )}
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          /* List View - No Events */
          <div className="text-center py-20 text-muted-foreground">
            {t('noEvents')}
          </div>
        ) : (
          /* List View - Event Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, i) => (
              <EventCard key={event.id || i} {...event} index={i} />
            ))}
          </div>
        )}

      </Section>
    </main>
  );
}
