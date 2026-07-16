import { SectionHeader } from "@/components/shared/Section";
import { EventCard } from "@/components/shared/cards/EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { adminDb } from "@/lib/firebase/admin";
import { AABPEvent } from "@/lib/firebase/db-events";

export async function HomeEvents() {
  let events: AABPEvent[] = [];
  try {
    if (!adminDb) {
      console.warn("Firebase Admin DB not initialized. Skipping events fetch.");
    } else {
      const snapshot = await adminDb.collection("events")
        .where("status", "==", "Published")
        .orderBy("createdAt", "desc")
        .limit(3)
        .get();
        
      events = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          date: data.date || "",
          location: data.location || "",
          category: data.category || "",
          status: data.status || "Published",
          imageUrl: data.imageUrl || ""
        } as AABPEvent;
      });
    }
  } catch (error) {
    console.log("Failed to load events for home:", error instanceof Error ? error.message : error);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <SectionHeader 
          title="Upcoming Events"
          subtitle="Connect & Grow"
          className="mb-0"
        />
        <Button render={<Link href="/events" />} variant="link" className="text-accent font-semibold hidden md:flex">
          View All Events &rarr;
        </Button>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No upcoming events at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <EventCard key={event.id || i} {...event} index={i} />
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center md:hidden">
        <Button render={<Link href="/events" />} variant="outline" className="rounded-full">
          View All Events
        </Button>
      </div>
    </>
  );
}
