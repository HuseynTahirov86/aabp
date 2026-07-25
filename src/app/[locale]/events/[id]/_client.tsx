"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Hero } from '@/components/shared/Hero';
import { Section } from '@/components/shared/Section';
import { getEventById, AABPEvent, registerForEvent, checkUserRegistration } from '@/lib/firebase/db-events';
import { Loader2, ArrowLeft, Calendar, MapPin, Tag } from "lucide-react";
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

  useEffect(() => {
    const fetchEvent = async () => {
      if (params.id && typeof params.id === 'string') {
        const data = await getEventById(params.id);
        setEvent(data);

        const currentUser = getAuthInstance().currentUser;
        if (data && currentUser) {
          const registered = await checkUserRegistration(params.id, currentUser.uid);
          setIsRegistered(registered);
        }
      }
      setIsLoading(false);
    };
    fetchEvent();
  }, [params.id]);

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
      toast.success("Successfully registered for the event!");
    } catch {
      toast.error("Failed to register. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background pt-8">
        <h1 className="text-3xl font-serif text-primary mb-4">Event not found</h1>
        <Button variant="outline" onClick={() => router.push('/events')}>Return to Events</Button>
      </main>
    );
  }

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
          </div>

          <div className="prose prose-lg max-w-none text-foreground mb-12">
            {event.description ? (
              <div dangerouslySetInnerHTML={{ __html: event.description }} />
            ) : (
              <p>No description provided for this event.</p>
            )}
          </div>

          <div className="flex justify-center border-t border-border pt-10">
            <Button
              size="lg"
              className="rounded-full bg-accent text-white hover:bg-accent/90 h-14 px-10 text-lg"
              disabled={isRegistering || isRegistered}
              onClick={handleRegister}
            >
              {isRegistering ? <Loader2 className="w-5 h-5 animate-spin" /> : isRegistered ? "Already Registered" : "Register for Event"}
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
