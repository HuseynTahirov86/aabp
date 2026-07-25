import type { Metadata } from "next";
import { EventsClient } from "./_client";

export const metadata: Metadata = {
  title: "Events & Conferences",
  description:
    "Join upcoming AABP networking events, professional conferences, and webinars connecting Azerbaijan and British professionals in London and beyond.",
};

export default function EventsPage() {
  return <EventsClient />;
}
