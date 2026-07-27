"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { getEventById, AABPEvent, registerForEvent, checkUserRegistration, getEventRegistrations } from '@/lib/firebase/db-events';
import { Loader2, ArrowLeft, Calendar, MapPin, Tag, Users, CalendarPlus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getAuthInstance } from "@/lib/firebase/config";
import { toast } from "sonner";
import { JsonLd } from "@/components/shared/JsonLd";

export function EventDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<AABPEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (params.id && typeof params.id === 'string') {
        const data = await getEventById(params.id);
        setEvent(data);

        const currentUser = getAuthInstance().currentUser;
        if (data && currentUser) {
          const [registered, regs] = await Promise.all([
            checkUserRegistration(params.id, currentUser.uid),
            getEventRegistrations(params.id)
          ]);
          setIsRegistered(registered);
          setRegistrationCount(regs.length);
          if (data.maxAttendees && data.maxAttendees > 0) {
            setIsFull(regs.length >= data.maxAttendees);
          }
        } else if (data) {
          const regs = await getEventRegistrations(params.id);
          setRegistrationCount(regs.length);
          if (data.maxAttendees && data.maxAttendees > 0) {
            setIsFull(regs.length >= data.maxAttendees);
          }
        }
      }
      setIsLoading(false);
    };
    fetchEvent();
  }, [params.id]);

  const handleAddToCalendar = () => {
    if (!event) return;
    const parsed = new Date(event.date);
    const hasValidDate = !isNaN(parsed.getTime());
    const start = hasValidDate ? parsed : new Date();
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // default 2h duration

    const toICSDate = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const escapeICS = (text: string) =>
      text.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");

    const description = escapeICS(event.description?.replace(/<[^>]+>/g, "") ?? "");

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AABP//Events//EN",
      "BEGIN:VEVENT",
      `UID:${event.id ?? Date.now()}@aabporg.uk`,
      `DTSTAMP:${toICSDate(new Date())}`,
      `DTSTART:${toICSDate(start)}`,
      `DTEND:${toICSDate(end)}`,
      `SUMMARY:${escapeICS(event.title)}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${escapeICS(event.location)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]+/gi, "-")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRegister = async () => {
    const currentUser = getAuthInstance().currentUser;
    if (!currentUser) {
      toast.error("Please sign in to register for events.");
      router.push('/login');
      return;
    }

    setIsRegistering(true);
    try {
      await registerForEvent(params.id as string, currentUser.uid);
      setIsRegistered(true);
      setRegistrationCount(prev => prev + 1);
      if (event?.maxAttendees && event.maxAttendees > 0 && registrationCount + 1 >= event.maxAttendees) {
        setIsFull(true);
      }
      toast.success("Successfully registered for the event!");

      if (event) {
        fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email,
            firstName: currentUser.displayName || '',
            type: 'EVENT_CONFIRMATION',
            eventTitle: event.title,
            eventDate: event.date,
          }),
        }).catch(() => {});
      }
    } catch {
      toast.error("Failed to register. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background pt-8">
        <h1 className="text-3xl font-serif text-foreground mb-4">Event not found</h1>
        <Button variant="outline" onClick={() => router.push('/events')}>Return to Events</Button>
      </main>
    );
  }

  const remainingSpots = event.maxAttendees && event.maxAttendees > 0
    ? Math.max(0, event.maxAttendees - registrationCount)
    : null;

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: event.description?.replace(/<[^>]+>/g, "") ?? "",
          startDate: event.date,
          location: {
            "@type": "Place",
            name: event.location,
          },
          image: event.imageUrl,
          organizer: {
            "@type": "Organization",
            name: "AABP",
            url: "https://aabporg.uk",
          },
        }}
      />
      <Hero
        title={event.title}
        subtitle={event.category}
        backgroundImage={event.imageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"}
      />

      <Section className="bg-card">
        <div className="max-w-4xl mx-auto">
          <Link href="/events" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
          </Link>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-10 pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {event.date}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {event.category}
            </div>
            {remainingSpots !== null && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {remainingSpots} spot{remainingSpots !== 1 ? 's' : ''} remaining
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none text-foreground mb-12">
            {event.description ? (
              <div dangerouslySetInnerHTML={{ __html: event.description }} />
            ) : (
              <p>No description provided for this event.</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 border-t border-border pt-10">
            {isFull && !isRegistered ? (
              <Button
                size="lg"
                className="rounded-full bg-muted text-muted-foreground cursor-not-allowed h-14 px-10 text-lg"
                disabled
              >
                Event Full
              </Button>
            ) : (
              <Button
                size="lg"
                className="rounded-full bg-accent text-white hover:bg-accent/90 h-14 px-10 text-lg"
                disabled={isRegistering || isRegistered}
                onClick={handleRegister}
              >
                {isRegistering ? <Loader2 className="w-5 h-5 animate-spin" /> : isRegistered ? "Already Registered" : "Register for Event"}
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="rounded-full h-14 px-10 text-lg"
              onClick={handleAddToCalendar}
            >
              <CalendarPlus className="w-5 h-5 mr-2" /> Add to Calendar
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
