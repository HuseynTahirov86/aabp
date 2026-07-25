import type { Metadata } from "next";
import { getEventById } from "@/lib/firebase/db-events";
import { EventDetailsClient } from "./_client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  return {
    title: event?.title ?? "Event",
    description: event?.description
      ? event.description.replace(/<[^>]+>/g, "").slice(0, 160)
      : "AABP event details — join our upcoming networking events, conferences, and webinars.",
    openGraph: {
      title: event?.title ?? "AABP Event",
      description: event?.description
        ? event.description.replace(/<[^>]+>/g, "").slice(0, 160)
        : "Join this AABP event to connect with professionals across the UK and Azerbaijan.",
      images: event?.imageUrl ? [event.imageUrl] : [],
    },
  };
}

export default function EventDetailsPage() {
  return <EventDetailsClient />;
}
