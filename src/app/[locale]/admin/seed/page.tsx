"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";

const SEED_EVENTS = [
  {
    title: "AABP Annual Networking Evening",
    description: "Join us for an evening of networking with Azerbaijani and British professionals across all sectors.",
    date: "2025-03-15",
    location: "London, UK",
    type: "Networking",
    status: "Published",
  },
  {
    title: "Medical Science Symposium",
    description: "A collaborative symposium bringing together medical researchers from the UK and Azerbaijan.",
    date: "2025-05-20",
    location: "Imperial College London",
    type: "Conference",
    status: "Published",
  },
  {
    title: "Engineering & Innovation Forum",
    description: "Showcasing groundbreaking engineering projects led by AABP members across both countries.",
    date: "2025-07-10",
    location: "The Shard, London",
    type: "Forum",
    status: "Published",
  },
];

const SEED_ARTICLES = [
  {
    title: "AABP Launches New Research Collaboration Portal",
    content: "The Association of Azerbaijani British Professionals is proud to announce the launch of our new research collaboration portal, connecting academics and researchers across the UK and Azerbaijan.",
    excerpt: "AABP unveils a new digital platform for cross-border research collaboration.",
    author: "AABP Editorial Team",
    category: "News",
    status: "Published",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Interview: Building Bridges in Medical Science",
    content: "We sat down with Dr. Leyla Mammadova, a leading AABP member and oncologist at King's College London, to discuss her groundbreaking cross-border research initiatives.",
    excerpt: "An exclusive interview with AABP member Dr. Leyla Mammadova on her research journey.",
    author: "AABP Editorial Team",
    category: "Interview",
    status: "Published",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "AABP Members Win Prestigious Engineering Award",
    content: "Two AABP members from the engineering sector have been jointly awarded the UK-Azerbaijan Innovation Prize for their work on sustainable energy solutions.",
    excerpt: "AABP engineers recognised for innovation in sustainable energy.",
    author: "AABP Editorial Team",
    category: "Achievement",
    status: "Published",
    publishedAt: new Date().toISOString(),
  },
];

const SEED_COMMITTEE = [
  {
    name: "Dr. Farid Aliyev",
    role: "President",
    field: "Medical Science",
    bio: "Dr. Aliyev is a consultant cardiologist at University College London Hospital and leads AABP's medical science initiatives.",
    imageUrl: "",
    order: 1,
  },
  {
    name: "Nigar Hasanova",
    role: "Vice President",
    field: "Engineering",
    bio: "Nigar is a senior civil engineer with Arup and spearheads AABP's engineering networking programmes.",
    imageUrl: "",
    order: 2,
  },
  {
    name: "Rashad Mammadov",
    role: "Secretary General",
    field: "Social Science",
    bio: "Rashad holds a PhD in International Relations from the LSE and manages AABP's strategic partnerships.",
    imageUrl: "",
    order: 3,
  },
];

const SEED_JOBS = [
  {
    title: "Research Associate — Life Sciences",
    company: "AstraZeneca",
    location: "Cambridge, UK",
    type: "Full-time",
    description: "AstraZeneca is seeking a Research Associate to join our oncology team. AABP members are encouraged to apply.",
    status: "Published",
    postedAt: new Date().toISOString(),
  },
  {
    title: "Structural Engineer",
    company: "Mott MacDonald",
    location: "London, UK",
    type: "Full-time",
    description: "Mott MacDonald is recruiting a Structural Engineer for major infrastructure projects across the UK and Azerbaijan.",
    status: "Published",
    postedAt: new Date().toISOString(),
  },
];

const SEED_RESEARCH = [
  {
    title: "Cross-Border Cardiovascular Health Outcomes Study",
    authors: ["Dr. Farid Aliyev", "Prof. Sarah Chen"],
    abstract: "A longitudinal study comparing cardiovascular health outcomes between Azerbaijani and British populations, examining lifestyle, genetic, and environmental factors.",
    field: "Medical Science",
    status: "Published",
    year: 2024,
  },
  {
    title: "Sustainable Infrastructure Development in the South Caucasus",
    authors: ["Nigar Hasanova", "Dr. James Clarke"],
    abstract: "This research evaluates sustainable engineering practices applicable to infrastructure development projects in Azerbaijan and neighbouring regions.",
    field: "Engineering",
    status: "Published",
    year: 2024,
  },
];

async function seedAll(setStatus: (s: string) => void) {
  setStatus("seeding");
  try {
    let count = 0;
    for (const item of SEED_EVENTS) { await addDoc(collection(db, "events"), item); count++; }
    for (const item of SEED_ARTICLES) { await addDoc(collection(db, "articles"), item); count++; }
    for (const item of SEED_COMMITTEE) { await addDoc(collection(db, "committee"), item); count++; }
    for (const item of SEED_JOBS) { await addDoc(collection(db, "jobs"), item); count++; }
    for (const item of SEED_RESEARCH) { await addDoc(collection(db, "research"), item); count++; }
    setStatus(`success:${count}`);
  } catch (e) {
    setStatus(`error:${e instanceof Error ? e.message : String(e)}`);
  }
}

export default function SeedPage() {
  const [status, setStatus] = useState("idle");

  const isSeeding = status === "seeding";
  const isSuccess = status.startsWith("success:");
  const isError = status.startsWith("error:");
  const successCount = isSuccess ? status.split(":")[1] : null;
  const errorMessage = isError ? status.slice("error:".length) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary">Seed Demo Data</h1>
        <p className="text-muted-foreground mt-2">
          Populate Firebase with sample AABP content for testing and demos.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => seedAll(setStatus)}
          disabled={isSeeding}
        >
          {isSeeding ? "Seeding…" : "Seed All Data"}
        </Button>

        {isSuccess && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <p className="font-medium">Success</p>
            <p className="text-sm mt-1">{successCount} records added to Firebase.</p>
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
