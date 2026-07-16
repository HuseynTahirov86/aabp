import type { Metadata } from "next";
import { CareerClient } from "./_client";

export const metadata: Metadata = {
  title: "Career Center",
  description:
    "Discover exclusive job opportunities, mentorships, and internships for AABP members across the UK and Azerbaijan.",
};

export default function CareerPage() {
  return <CareerClient />;
}
